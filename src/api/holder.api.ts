import { AutIDContractEventType, Web3AutIDProvider } from '@skill-wallet/sw-abi-types';
import axios from 'axios';
import { HolderData, ipfsCIDToHttpUrl } from './api.model';
import { AutID } from './aut.model';
import { Community } from './community.model';
import { environment } from './environment';
import { Web3ThunkProviderFactory } from './ProviderFactory/web3-thunk.provider';

export const fetchHolderData = (holderName: string): Promise<AutID> => {
  return axios
    .get<HolderData>(`${environment.apiUrl}/autID/${holderName}`)
    .then((res) => res.data)
    .then(async (data) => {
      const userMetadataUri = ipfsCIDToHttpUrl(data.metadataUri);
      const userMetadata: AutID = (await axios.get(userMetadataUri)).data;
      const autID = new AutID({
        ...userMetadata,
        properties: {
          ...userMetadata.properties,
          address: data.address,
          tokenId: data.tokenId,
        },
      });
      const communities: Community[] = await Promise.all(
        data.communities.map((curr) => {
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

const autIDProvider = Web3ThunkProviderFactory('AutID', {
  provider: Web3AutIDProvider,
});

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
    return response;
  }
);

// export const fetchHolder = holderSkillWalletProvider(
//   {
//     type: 'holder/get',
//   },
//   (thunkAPI) => {
//     console.log('SOMETHING');
//     // console.log(thunkAPI.getState());
//     // const { auth } = thunkAPI.getState();
//     return Promise.resolve('0x0c79Bf83577169310A172F9e6445c0Cc286fCA87');
//   },
//   async (contract, ownerAddress) => {
//     const skillWallet = await contract.getSkillWalletIdByOwner(ownerAddress);
//     const holderCommunities = await contract.getCommunities(ownerAddress);
//     const uriCid = await contract.tokenURI(skillWallet);
//     const res = await fetch(uriCid);
//     const jsonMetadata = await res.json();
//     console.log(jsonMetadata);
//     for (let i = 0; i < (holderCommunities as any).length; i += 1) {
//       console.log(holderCommunities[i]);
//     }
//     const communities = await Promise.all(
//       (holderCommunities as any).map(async (communityAddress) => {
//         const details = await contract.getCommunityData(ownerAddress, communityAddress);
//         console.log(details);

//         const communityExtensioncontract = await Web3CommunityExtensionProvider('0x96dCCC06b1729CD8ccFe849CE9cA7e020e19515c');
//         const resp = await communityExtensioncontract.getComData();
//         console.log(resp);
//         const communityMetadata = await fetch(resp[2]);
//         const communityJson = await communityMetadata.json();
//         console.log(communityJson);
//         console.log(communityJson.rolesSets[0].roles.find((x) => x.id.toString() === details[1].toString()));
//         return {
//           address: communityAddress,
//           picture: ipfsCIDToHttpUrl(communityJson.image, false),
//           name: communityJson.name,
//           description: communityJson.description,
//           role: communityJson.rolesSets[0].roles.find((x) => x.id.toString() === details[1].toString()).roleName,
//           commitment: details[2].toString(),
//         };
//       })
//     );
//     const holder = {
//       holderName: jsonMetadata.name,
//       holderProfilePic: ipfsCIDToHttpUrl(jsonMetadata.properties.avatar, false),
//       holderRepScore: 69,
//       communities,
//     };

//     return holder;
//   }
// );
