import { BrowserProvider } from "ethers";
import { AutID } from "./aut.model";
import { Community } from "./community.model";
import { ipfsCIDToHttpUrl, isValidUrl } from "./storage.api";
import { base64toFile } from "@utils/to-base-64";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NetworkConfig } from "./ProviderFactory/network.config";
import { environment } from "./environment";
import AutSDK, {
  CommunityMembershipDetails,
  HolderData,
  fetchMetadata,
  queryParamsAsString
} from "@aut-labs/sdk";
import { gql } from "@apollo/client";
import { isAddress } from "viem";
import { apolloClient } from "@store/graphql";
import { BaseNFTModel } from "@aut-labs/sdk/dist/models/baseNFTModel";

export const fetchHolderEthEns = async (address: string) => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new BrowserProvider(window.ethereum as any);
      return await provider.lookupAddress(address);
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};

export const fetchHolderCommunities = async (
  communities: CommunityMembershipDetails[]
): Promise<Community[]> => {
  return Promise.all(
    communities
      .filter((c) => c.holderIsActive)
      .map((curr: CommunityMembershipDetails) => {
        const communityMetadataUri = ipfsCIDToHttpUrl(curr.metadata);
        return fetchMetadata<Community>(
          communityMetadataUri,
          environment.ipfsGatewayUrl
        ).then((metadata) => {
          return new Community({
            ...metadata,
            properties: {
              ...metadata.properties,
              additionalProps: curr,
              address: curr.daoAddress,
              userData: {
                role: curr.holderRole,
                commitment: curr.holderCommitment
              }
            }
          });
        });
      })
  );
};

export const fetchAutID = async (
  holderData: HolderData,
  network: string
): Promise<AutID> => {
  const userMetadataUri = ipfsCIDToHttpUrl(holderData.metadataUri);
  const userMetadata: AutID = await fetchMetadata<AutID>(
    userMetadataUri,
    environment.ipfsGatewayUrl
  );
  const ethDomain = await fetchHolderEthEns(userMetadata.properties.address);
  const autID = new AutID({
    ...userMetadata,
    properties: {
      ...userMetadata.properties,
      network,
      ethDomain,
      address: holderData.address,
      tokenId: holderData.tokenId,
      holderData
    }
  });
  return autID;
};

export const fetchHolder = createAsyncThunk(
  "fetch-holder",
  async (data: any, { getState, rejectWithValue }) => {
    const { autName, network } = data;
    const { walletProvider } = getState() as any;
    const networks: string[] = network
      ? [network?.network?.toString().toLowerCase() || network]
      : walletProvider.networksConfig
          .filter((n: NetworkConfig) => !n.disabled)
          .map((n: NetworkConfig) => n.network?.toString().toLowerCase());
    // const networks: string[] = network ? [network] : ['goerli', 'goerli'];

    const networkName =
      walletProvider?.selectedNetwork?.network?.toString().toLowerCase() ||
      networks[0];

    const filters = [];

    if (isAddress(autName)) {
      filters.push({
        prop: "id",
        comparison: "equals",
        value: autName.toLowerCase()
      });
    } else {
      filters.push({
        prop: "username",
        comparison: "equals",
        value: autName.toLowerCase()
      });
    }

    const queryArgsString = queryParamsAsString({
      skip: 0,
      take: 1,
      filters
    });
    const query = gql`
      query AutIds {
        autIDs(${queryArgsString}) {
          id
          username
          tokenID
          joinedNovas
          role
          commitment
          metadataUri
        }
      }
    `;
    const response = await apolloClient.query<any>({
      query
    });

    const {
      autIDs: [autID]
    } = response.data;

    const loadNova = async (novaAddress: string): Promise<Community> => {
      const novaQuery = gql`
      query GetHub {
        hub(id: "${novaAddress?.toLowerCase()}") {
          id
          address
          market
          minCommitment
          metadataUri
          domain
        }
      }
    `;
      const novaResponse = await apolloClient.query<any>({
        query: novaQuery
      });
      const { hub } = novaResponse.data;

      const novaMetadata = await fetchMetadata<BaseNFTModel<Community>>(
        hub.metadataUri,
        environment.ipfsGatewayUrl
      );

      // const nova = sdk.initService<Nova>(Nova, novaAddress);
      // const isAdmin = await nova.contract.admins.isAdmin(autID.id);

      const userNova = new Community({
        ...novaMetadata,
        properties: {
          ...novaMetadata.properties,
          address: novaAddress,
          market: +hub.market - 1,
          userData: {
            role: autID.role.toString(),
            commitment: autID.commitment.toString(),
            isActive: true
            // isAdmin: isAdmin.data
          }
        }
      } as unknown as Community);

      return userNova;
    };

    const novas: Community[] = await Promise.all(
      autID.joinedNovas.map((n: string) => loadNova(n))
    );

    const autIdMetadata = await fetchMetadata<BaseNFTModel<any>>(
      autID.metadataUri,
      environment.ipfsGatewayUrl
    );
    const { avatar, thumbnailAvatar, timestamp } = autIdMetadata.properties;

    const newAutId = new AutID({
      name: autIdMetadata.name,
      image: autIdMetadata.image,
      description: autIdMetadata.description,
      properties: {
        ...autIdMetadata.properties,
        avatar,
        thumbnailAvatar,
        timestamp,
        role: autID.role,
        socials: autIdMetadata?.properties?.socials,
        address: autID.id,
        tokenId: autID.tokenID,
        network: networkName,
        communities: novas
      }
    });

    return [newAutId];
  }
);

export const editCommitment = createAsyncThunk(
  "holder/edit-commitment",
  async (
    requestBody: { communityAddress: string; commitment: number },
    { rejectWithValue }
  ) => {
    const sdk = await AutSDK.getInstance();
    const response = await sdk.autID.contract.editCommitment(
      requestBody.communityAddress,
      requestBody.commitment
    );
    try {
      const autIdData = JSON.parse(window.localStorage.getItem("aut-data"));
      autIdData.properties.communities = autIdData.properties.communities.map(
        (c) => {
          if (c.properties.address === requestBody.communityAddress) {
            c.properties.commitment = requestBody.commitment;
            c.properties.userData.commitment = `${requestBody.commitment}`;
          }
          return c;
        }
      );
      window.localStorage.setItem("aut-data", JSON.stringify(autIdData));
    } catch (err) {
      console.log(err);
    }
    if (response?.isSuccess) {
      return requestBody;
    }
    return rejectWithValue(response?.errorMessage);
  }
);

export const withdraw = createAsyncThunk(
  "holder/withdraw",
  async (communityAddress: string, { rejectWithValue }) => {
    const sdk = await AutSDK.getInstance();
    const response = await sdk.autID.contract.withdraw(communityAddress);

    try {
      const autIdData = JSON.parse(window.localStorage.getItem("aut-data"));
      autIdData.properties.communities = autIdData.properties.communities.map(
        (c) => {
          if (c.properties.address === communityAddress) {
            c.properties.userData.isActive = false;
          }
          return c;
        }
      );
      window.localStorage.setItem("aut-data", JSON.stringify(autIdData));
    } catch (err) {
      console.log(err);
    }
    if (response?.isSuccess) {
      return communityAddress;
    }
    return rejectWithValue(response?.errorMessage);
  }
);

export const updateProfile = createAsyncThunk(
  "holder/update",
  async (user: AutID, { rejectWithValue }) => {
    const sdk = await AutSDK.getInstance();
    if (
      user.properties.avatar &&
      !isValidUrl(user.properties.avatar as string)
    ) {
      const file = base64toFile(user.properties.avatar as string, "image");
      user.properties.avatar = await sdk.client.sendFileToIPFS(file as File);
      console.log("New image: ->", ipfsCIDToHttpUrl(user.properties.avatar));
    }

    const updatedUser = AutID.updateAutID(user);
    const uri = await sdk.client.sendJSONToIPFS(updatedUser as any);
    console.log("New metadata: ->", ipfsCIDToHttpUrl(uri));
    console.log("avatar: ->", ipfsCIDToHttpUrl(updatedUser.properties.avatar));
    console.log("badge: ->", ipfsCIDToHttpUrl(updatedUser.image));
    const response = await sdk.autID.contract.setMetadataUri(uri);
    try {
      const autIdData = JSON.parse(window.localStorage.getItem("aut-data"));
      autIdData.name = updatedUser.name;
      autIdData.description = updatedUser.description;
      autIdData.properties.avatar = updatedUser.properties.avatar;
      autIdData.properties.socials = updatedUser.properties.socials;
      autIdData.properties.bio = updatedUser.properties.bio;
      window.localStorage.setItem("aut-data", JSON.stringify(autIdData));
    } catch (err) {
      console.log(err);
    }

    if (response.isSuccess) {
      return user;
    }
    return rejectWithValue(response?.errorMessage);
  }
);
