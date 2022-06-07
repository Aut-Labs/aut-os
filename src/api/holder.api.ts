import { Web3SkillWalletProvider } from '@skill-wallet/sw-abi-types';
import { Web3ThunkProviderFactory } from './ProviderFactory/web3-thunk.provider';
import { EnableAndChangeNetwork } from './ProviderFactory/web3.network';

export function ipfsCIDToHttpUrl(url: string, isJson = false) {
  if (!url.includes('textile'))
    return isJson
      ? `https://skillwallet.infura-ipfs.io/ipfs/${url.replace('ipfs://', '')}/metadata.json`
      : `https://skillwallet.infura-ipfs.io/ipfs/${url.replace('ipfs://', '')}`;

  return url;
}

const holderSkillWalletProvider = Web3ThunkProviderFactory('Holder', {
  provider: Web3SkillWalletProvider,
});

export const fetchHolder = holderSkillWalletProvider(
  {
    type: 'holder/get',
  },
  (thunkAPI) => {
    console.log('SOMETHING');
    // console.log(thunkAPI.getState());
    // const { auth } = thunkAPI.getState();
    return Promise.resolve('0x96e7341457e4dDd57003178951A9d41A2a828676');
  },
  async (contract, tokenId) => {
    console.log(tokenId);
    console.log('fetching holder');
    const skillWallet = await contract.getSkillWalletIdByOwner(tokenId);
    console.log(skillWallet);
    const holderCommunities = await contract.getCommunities(tokenId);
    console.log(holderCommunities);
    // const communityDetails = await contract.getCommunityData(tokenId, communities[0]);
    // console.log(communityDetails);
    const uriCid = await contract.tokenURI(tokenId);
    console.log('tokenURI');
    const jsonUri = ipfsCIDToHttpUrl(uriCid, true);
    console.log('ipfsCIDToHttpUrl');
    const res = await fetch(jsonUri);
    const jsonMetadata = await res.json();
    console.log(jsonMetadata);

    const communities = await Promise.all(
      holderCommunities.communities.map(async (communityAddress) => {
        const details = await contract.getCommunityData(tokenId, communityAddress);
        return {
          communityAddress,
          communityName: details[0],
          role: details[1],
          commitment: details[2],
        };
      })
    );

    const holder = {
      holderName: jsonMetadata.properties.username,
      holderProfilePic: ipfsCIDToHttpUrl(jsonMetadata.properties.avatar, false),
      holderRepScore: 69,
      communities,
    };
    return holder;
  }
);
