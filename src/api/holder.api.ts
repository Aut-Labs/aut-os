import { AutIDContractEventType, Web3AutIDProvider } from '@aut-protocol/abi-types';
import axios, { CancelTokenSource } from 'axios';
import { ethers } from 'ethers';
import { HolderCommunity, HolderData } from './api.model';
import { AutID } from './aut.model';
import { Community } from './community.model';
import { environment } from './environment';
import { ipfsCIDToHttpUrl, isValidUrl, storeAsBlob, storeImageAsBlob } from './storage.api';
import { Web3ThunkProviderFactory } from './ProviderFactory/web3-thunk.provider';
import { NetworkConfig } from './ProviderFactory/network.config';
import { base64toFile } from '@utils/to-base-64';

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

export const fetchHolderCommunities = async (communities: HolderCommunity[]): Promise<Community[]> => {
  return Promise.all(
    communities
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
};

export const fetchHolderData = async (holderName: string, network: string, source: CancelTokenSource): Promise<HolderData> => {
  return axios
    .get<HolderData>(`${environment.apiUrl}/autID/${holderName}?network=${network}`, { cancelToken: source.token })
    .then((res) => res.data)
    .catch(() => null);
};

export const fetchAutID = async (holderData: HolderData, network: string): Promise<AutID> => {
  const userMetadataUri = ipfsCIDToHttpUrl(holderData.metadataUri);
  const userMetadata: AutID = (await axios.get(userMetadataUri)).data;
  const ethDomain = await fetchHolderEthEns(userMetadata.properties.address);
  const autID = new AutID({
    ...userMetadata,
    properties: {
      ...userMetadata.properties,
      network,
      ethDomain,
      address: holderData.address,
      tokenId: holderData.tokenId,
      holderData,
    },
  });
  return autID;
};

export const editCommitment = autIDProvider(
  {
    type: 'holder/edit-commitment',
    event: AutIDContractEventType.CommitmentUpdated,
  },
  (thunkAPI) => {
    const state = thunkAPI.getState() as any;
    const { selectedNetwork, networksConfig } = state.walletProvider;
    const config: NetworkConfig = networksConfig.find((n) => n.network === selectedNetwork);
    return Promise.resolve(config.contracts.autIDAddress);
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
    const { selectedNetwork, networksConfig } = state.walletProvider;
    const config: NetworkConfig = networksConfig.find((n) => n.network === selectedNetwork);
    return Promise.resolve(config.contracts.autIDAddress);
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
    const { selectedNetwork, networksConfig } = state.walletProvider;
    const config: NetworkConfig = networksConfig.find((n) => n.network === selectedNetwork);
    return Promise.resolve(config.contracts.autIDAddress);
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
