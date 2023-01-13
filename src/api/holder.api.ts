import axios, { CancelTokenSource } from "axios";
import { ethers } from "ethers";
import { AutID, HolderData } from "./aut.model";
import { Community } from "./community.model";
import { ipfsCIDToHttpUrl, isValidUrl } from "./storage.api";
import { base64toFile } from "@utils/to-base-64";
import { createAsyncThunk } from "@reduxjs/toolkit";
import AutSDK from "@aut-protocol/sdk";
import { ErrorParser } from "@utils/error-parser";
import { NetworkConfig } from "./ProviderFactory/network.config";
import { CommunityMembershipDetails } from "@aut-protocol/sdk/dist/models/holder";
import { environment } from "./environment";

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
        return axios.get<Community>(communityMetadataUri).then((metadata) => {
          return new Community({
            ...metadata.data,
            properties: {
              ...metadata.data.properties,
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
      const networks: NetworkConfig[] = state.walletProvider.networksConfig;

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
      : walletProvider.networksConfig.map((n) => n.network?.toLowerCase());
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
    const response = await sdk.autID.autIDContract.editCommitment(
      requestBody.communityAddress,
      requestBody.commitment
    );
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
    const response = await sdk.autID.autIDContract.withdraw(communityAddress);
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
      user.properties.avatar = await sdk.client.storeImageAsBlob(file as File);
      console.log("New image: ->", ipfsCIDToHttpUrl(user.properties.avatar));
    }

    const uri = await sdk.client.storeAsBlob(AutID.updateAutID(user));
    console.log("New metadata: ->", ipfsCIDToHttpUrl(uri));
    const response = await sdk.autID.autIDContract.setMetadataUri(uri);

    if (response.isSuccess) {
      return user;
    }
    return rejectWithValue(response?.errorMessage);
  }
);
