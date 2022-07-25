import { AutIDContractEventType, Web3AutIDProvider } from '@aut-protocol/abi-types';
import axios from 'axios';
import { ethers } from 'ethers';
import { base64toFile } from 'sw-web-shared';
import { HolderCommunity, HolderData, ipfsCIDToHttpUrl } from './api.model';
import { AutID } from './aut.model';
import { Community } from './community.model';
import { environment } from './environment';
import { httpUrlToIpfsCID, storeAsBlob, storeImageAsBlob } from './storage.api';
import { Web3ThunkProviderFactory } from './ProviderFactory/web3-thunk.provider';

const autIDProvider = Web3ThunkProviderFactory('AutID', {
  provider: Web3AutIDProvider,
});

export const fetchHolderEthEns = async (address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045') => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      return await provider.lookupAddress(address);
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};

export const fetchHolderData = async (holderName: string): Promise<AutID> => {
  return axios
    .get<HolderData>(`${environment.apiUrl}/autID/${holderName}`)
    .then((res) => res.data)
    .then(async (data) => {
      const userMetadataUri = ipfsCIDToHttpUrl(data.metadataUri);
      const userMetadata: AutID = (await axios.get(userMetadataUri)).data;
      const ethDomain = await fetchHolderEthEns(userMetadata.properties.address);
      const autID = new AutID({
        ...userMetadata,
        properties: {
          ...userMetadata.properties,
          ethDomain,
          address: data.address,
          tokenId: data.tokenId,
        },
      });
      const communities: Community[] = await Promise.all(
        data.communities
          .filter((c) => c.holderIsActive)
          .map((curr: HolderCommunity) => {
            const communityMetadataUri = ipfsCIDToHttpUrl(curr.metadata);
            return axios.get<Community>(communityMetadataUri).then((metadata) => {
              return new Community({
                ...metadata.data,
                properties: {
                  ...metadata.data.properties,
                  additionalProps: curr,
                  address: curr.communityExtension,
                  userData: {
                    role: curr.holderRole,
                    commitment: curr.holderCommitment,
                  },
                },
              });
            });
          })
      );
      autID.properties.communities = communities;
      return autID;
    });
};

export const editCommitment = autIDProvider(
  {
    type: 'holder/edit-commitment',
    event: AutIDContractEventType.CommitmentUpdated,
  },
  () => Promise.resolve(environment.autIDAddress),
  async (contract, { communityAddress, commitment }) => {
    const response = await contract.editCommitment(communityAddress, commitment);
    return {
      communityAddress,
      commitment,
    };
  }
);

export const withdraw = autIDProvider(
  {
    type: 'holder/withdraw',
  },
  () => Promise.resolve(environment.autIDAddress),
  async (contract, communityAddress) => {
    const response = await contract.withdraw(communityAddress);
    return communityAddress;
  }
);

const isBase64 = (url: string) => {
  try {
    return /[A-Za-z0-9+/=]/.test(url);
  } catch (e) {
    return false;
  }
};

export const updateProfile = autIDProvider(
  {
    type: 'holder/update',
  },
  () => Promise.resolve(environment.autIDAddress),
  async (contract, user) => {
    if (user.properties.avatar && isBase64(user.properties.avatar)) {
      const file = base64toFile(user.properties.avatar as string, 'avatar');
      user.properties.avatar = await storeImageAsBlob(file as File);
    }

    const newUser = new AutID(user);
    newUser.image = httpUrlToIpfsCID(newUser.image as string);
    newUser.properties.avatar = httpUrlToIpfsCID(newUser.properties.avatar as string);
    delete newUser.properties.communities;
    delete newUser.properties.tokenId;
    delete newUser.properties.address;

    const uri = await storeAsBlob(newUser);
    console.log('New metadata: ->', ipfsCIDToHttpUrl(uri));
    const response = await contract.setMetadataUri(uri);
    return user;
  }
);
