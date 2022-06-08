import { Web3SkillWalletProvider } from '@skill-wallet/sw-abi-types';
import axios from 'axios';
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
    // const communityDetails = await contract.getCommunityData(tokenId, holderCommunities[0]);
    // console.log(communityDetails);
    // const uriCid = await contract.tokenURI(skillWallet);
    // console.log('tokenURI', uriCid);
    // const res = await await axios.get(uriCid);
    // const jsonMetadata = await res.json();
    // const jsonMetadata = {
    //   name: 'migrenaa',
    //   description:
    //     'SkillWallets are a new standard for self-sovereign Identities that do not depend from the provider, therefore, they are universal. They are individual NFT IDs.',
    //   image:
    //     'https://lh3.googleusercontent.com/4k5vzUF5W6ClZAPYoxH1E5syIqkblfUBfLg1_UGAwNWQ-H7X1h0maONCYJKacQJ0mLHhSSv0F8YR5XobvmsdFmABKQRDKuL_xayCJw=s0',
    //   properties: {
    //     avatar: 'https://hub.textile.io/ipfs/bafkreidgaufifu5fncso4lym7eotzzlxlg5neg7qdazwufhg3g3ztr7jzm',
    //     timestamp: 1654505809249,
    //   },
    // };
    const jsonMetadata = {
      name: 'migrenaa',
      description:
        'SkillWallets are a new standard for self-sovereign Identities that do not depend from the provider, therefore, they are universal. They are individual NFT IDs.',
      image:
        'https://lh3.googleusercontent.com/4k5vzUF5W6ClZAPYoxH1E5syIqkblfUBfLg1_UGAwNWQ-H7X1h0maONCYJKacQJ0mLHhSSv0F8YR5XobvmsdFmABKQRDKuL_xayCJw=s0',
      properties: {
        avatar:
          'https://media.istockphoto.com/photos/penne-pasta-picture-id495231784?k=20&m=495231784&s=612x612&w=0&h=3fuYKO0af_pB_w7FY40JHjx9_XdQN2IZhHuirdMXptU=',
        timestamp: 1654505809249,
      },
    };

    console.log('deets');
    console.log(holderCommunities);
    for (let i = 0; i < (holderCommunities as any).length; i += 1) {
      console.log(holderCommunities[i]);
    }
    const communities = await Promise.all(
      (holderCommunities as any).map(async (communityAddress) => {
        // const details = await contract.getCommunityData(tokenId, communityAddress);
        // console.log('nope');
        // return {
        //   communityAddress,
        //   communityName: details[0],
        //   role: details[1],
        //   commitment: details[2],
        // };
        return {
          communityAddress: '0x75878b9701308470296cD69b734fa8b2f4303f5e',
          communityName: 'SmartTacktics',
          role: 2,
          commitment: 66,
        };
      })
    );

    console.log(communities);

    const holder = {
      holderName: jsonMetadata.name,
      holderProfilePic: jsonMetadata.properties.avatar,
      holderRepScore: 69,
      communities,
    };

    console.log(holder);
    return holder;
  }
);
