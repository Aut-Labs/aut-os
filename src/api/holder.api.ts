import { AutIDContractEventType, Web3AutIDProvider } from '@aut-protocol/abi-types';
import axios from 'axios';
import { ethers } from 'ethers';
import { base64toFile } from 'sw-web-shared';
import { NetworkConfig } from '@store/model';
import { HolderCommunity, HolderData } from './api.model';
import { AutID } from './aut.model';
import { Community } from './community.model';
import { environment } from './environment';
import { ipfsCIDToHttpUrl, isValidUrl, storeAsBlob, storeImageAsBlob } from './storage.api';
import { Web3ThunkProviderFactory } from './ProviderFactory/web3-thunk.provider';

const autIDProvider = Web3ThunkProviderFactory('AutID', {
  provider: Web3AutIDProvider,
});

export const fetchHolderEthEns = async (address: string) => {
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

export const fetchHolderData = async (holderName: string, network: string): Promise<AutID> => {
  return axios
    .get<HolderData>(`${environment.apiUrl}/autID/${holderName}?network=${network}`)
    .then((res) => res.data)
    .then(async (data) => {
      const userMetadataUri = ipfsCIDToHttpUrl(data.metadataUri);
      const userMetadata: AutID = (await axios.get(userMetadataUri)).data;
      const ethDomain = await fetchHolderEthEns(userMetadata.properties.address);
      const autID = new AutID({
        ...userMetadata,
        properties: {
          ...userMetadata.properties,
          network,
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

export const fetchHolder = async (holderName: string, network: string): Promise<AutID[]> => {
  return axios
    .get<HolderData>(`${environment.apiUrl}/autID/${holderName}?network=${network}`)
    .then((res) => res.data)
    .then(async (data) => {
      const userMetadataUri = ipfsCIDToHttpUrl(data.metadataUri);
      const userMetadata: AutID = (await axios.get(userMetadataUri)).data;
      const ethDomain = await fetchHolderEthEns(userMetadata.properties.address);
      const autID = new AutID({
        ...userMetadata,
        properties: {
          ...userMetadata.properties,
          network,
          ethDomain,
          address: data.address,
          tokenId: data.tokenId,
        },
      });
      return autID;
    })
    .catch(() => null);
};

export const editCommitment = autIDProvider(
  {
    type: 'holder/edit-commitment',
    event: AutIDContractEventType.CommitmentUpdated,
  },
  (thunkAPI) => {
    const state = thunkAPI.getState() as any;
    const config: NetworkConfig = state.walletProvider.networkConfig;
    return Promise.resolve(config.autIdAddress);
  },
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
  (thunkAPI) => {
    const state = thunkAPI.getState() as any;
    const config: NetworkConfig = state.walletProvider.networkConfig;
    return Promise.resolve(config.autIdAddress);
  },
  async (contract, communityAddress) => {
    const response = await contract.withdraw(communityAddress);
    return communityAddress;
  }
);

export const updateProfile = autIDProvider(
  {
    type: 'holder/update',
  },
  (thunkAPI) => {
    const state = thunkAPI.getState() as any;
    const config: NetworkConfig = state.walletProvider.networkConfig;
    return Promise.resolve(config.autIdAddress);
  },
  async (contract, user) => {
    if (user.properties.avatar && !isValidUrl(user.properties.avatar as string)) {
      const file = base64toFile(user.properties.avatar as string, 'image');
      user.properties.avatar = await storeImageAsBlob(file as File);
      console.log('New image: ->', ipfsCIDToHttpUrl(user.properties.avatar));
    }

    const uri = await storeAsBlob(AutID.updateAutID(user));
    console.log('New metadata: ->', ipfsCIDToHttpUrl(uri));
    await contract.setMetadataUri(uri);
    return user;
  }
);
