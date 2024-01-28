import axios, { CancelTokenSource } from "axios";
import { ethers } from "ethers";
import { AutID } from "./aut.model";
import { Community } from "./community.model";
import { ipfsCIDToHttpUrl, isValidUrl } from "./storage.api";
import { base64toFile } from "@utils/to-base-64";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorParser } from "@utils/error-parser";
import { NetworkConfig } from "./ProviderFactory/network.config";
import { environment } from "./environment";
import AutSDK, {
  CommunityMembershipDetails,
  HolderData,
  fetchMetadata
} from "@aut-labs/sdk";

export const fetchHolderEthEns = async (address: string) => {
  if (typeof window.ethereum !== "undefined") {
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

export const fetchHolderData = async (
  holderName: string,
  network: string,
  source: CancelTokenSource
): Promise<HolderData> => {
  return axios
    .get<HolderData>(
      `${environment.apiUrl}/autID/${holderName}?network=${network}`,
      { cancelToken: source.token }
    )
    .then((res) => res.data)
    .catch(() => null);
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

export const fetchSearchResults = createAsyncThunk(
  "fetch-search-results",
  async (data: any, thunkAPI) => {
    const { username, signal } = data;
    try {
      const source = axios.CancelToken.source();
      signal.addEventListener("abort", () => {
        source.cancel();
      });
      const result = [];
      const state = thunkAPI.getState() as any;
      const networks: NetworkConfig[] =
        state.walletProvider.networksConfig.filter(
          (n: NetworkConfig) => !n.disabled
        );

      for (const network of networks) {
        const holderData = await fetchHolderData(
          username,
          network.network?.toLowerCase(),
          source
        );
        if (holderData) {
          const member = await fetchAutID(
            holderData,
            network.network?.toLowerCase()
          );
          if (member) {
            result.push(member);
          }
        }
      }
      if ((signal as AbortSignal).aborted) {
        throw new Error("Aborted");
      }
      return result;
    } catch (error) {
      const message = ErrorParser(error);
      throw new Error(message);
    }
  }
);

export const fetchHolder = createAsyncThunk(
  "fetch-holder",
  async (data: any, { getState, rejectWithValue }) => {
    const { autName, network, signal } = data;
    const { search, walletProvider } = getState() as any;
    const networks: string[] = network
      ? [network]
      : walletProvider.networksConfig
          .filter((n: NetworkConfig) => !n.disabled)
          .map((n: NetworkConfig) => n.network?.toLowerCase());
    // const networks: string[] = network ? [network] : ['goerli', 'goerli'];
    const profiles = [];
    try {
      const source = axios.CancelToken.source();
      if (signal) {
        signal.addEventListener("abort", () => {
          source.cancel();
        });
      }
      for (const networkName of networks) {
        const result: AutID = search.searchResult.find(
          (a: AutID) =>
            a.name === autName &&
            a.properties.network?.toLowerCase() === networkName?.toLowerCase()
        );
        const holderData =
          result?.properties?.holderData ||
          (await fetchHolderData(autName, networkName, source));
        if (holderData) {
          const autID = await fetchAutID(holderData, networkName);
          autID.properties.communities = await fetchHolderCommunities(
            holderData.daos
          );
          if (autID) {
            profiles.push(autID);
          }
        }
      }
      if ((signal as AbortSignal)?.aborted) {
        throw new Error("Aborted");
      }
      return profiles;
    } catch (error) {
      const message =
        error?.message === "Aborted" ? error?.message : ErrorParser(error);
      return rejectWithValue(message);
    }
  }
);

export const editCommitment = createAsyncThunk(
  "holder/edit-commitment",
  async (
    requestBody: { communityAddress: string; commitment: number },
    { rejectWithValue }
  ) => {
    const sdk = AutSDK.getInstance();
    const response = await sdk.autID.contract.editCommitment(
      requestBody.communityAddress,
      requestBody.commitment
    );
    try {
      const autIdData = JSON.parse(window.sessionStorage.getItem("aut-data"));
      autIdData.properties.communities = autIdData.properties.communities.map(
        (c) => {
          if (c.properties.address === requestBody.communityAddress) {
            c.properties.commitment = requestBody.commitment;
            c.properties.userData.commitment = `${requestBody.commitment}`;
          }
          return c;
        }
      );
      window.sessionStorage.setItem("aut-data", JSON.stringify(autIdData));
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
    const sdk = AutSDK.getInstance();
    const response = await sdk.autID.contract.withdraw(communityAddress);

    try {
      const autIdData = JSON.parse(window.sessionStorage.getItem("aut-data"));
      autIdData.properties.communities = autIdData.properties.communities.map(
        (c) => {
          if (c.properties.address === communityAddress) {
            c.properties.userData.isActive = false;
          }
          return c;
        }
      );
      window.sessionStorage.setItem("aut-data", JSON.stringify(autIdData));
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
    const sdk = AutSDK.getInstance();
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
      const autIdData = JSON.parse(window.sessionStorage.getItem("aut-data"));
      autIdData.name = updatedUser.name;
      autIdData.description = updatedUser.description;
      autIdData.properties.avatar = updatedUser.properties.avatar;
      autIdData.properties.socials = updatedUser.properties.socials;
      window.sessionStorage.setItem("aut-data", JSON.stringify(autIdData));
    } catch (err) {
      console.log(err);
    }

    if (response.isSuccess) {
      return user;
    }
    return rejectWithValue(response?.errorMessage);
  }
);
