import { BrowserProvider } from "ethers";
import { ipfsCIDToHttpUrl, isValidUrl } from "../utils/ipfs";
import { base64toFile } from "@utils/to-base-64";
import { createAsyncThunk } from "@reduxjs/toolkit";
import AutSDK from "@aut-labs/sdk";
import { DAutAutID } from "@aut-labs/d-aut";
import { parse, stringify } from "flatted";
import { AutOSAutID } from "./models/aut.model";

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

export const editCommitment = createAsyncThunk(
  "holder/edit-commitment",
  async (
    requestBody: {
      hubAddress: string;
      commitment: number;
      autIDAddress: string;
    },
    { rejectWithValue }
  ) => {
    return requestBody;
    // const sdk = await AutSDK.getInstance();
    // const response = await sdk.autID.contract.editCommitment(
    //   requestBody.hubAddress,
    //   requestBody.commitment
    // );
    // if (response?.isSuccess) {
    //   return requestBody;
    // }
    // return rejectWithValue(response?.errorMessage);
  }
);

export const withdraw = createAsyncThunk(
  "holder/withdraw",
  async (hubAddress: string, { rejectWithValue }) => {
    const sdk = await AutSDK.getInstance();
    const response = await sdk.autID.contract.withdraw(hubAddress);

    try {
      const autIdData = JSON.parse(window.localStorage.getItem("aut-data"));
      autIdData.properties.communities = autIdData.properties.communities.map(
        (c) => {
          if (c.properties.address === hubAddress) {
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
      return hubAddress;
    }
    return rejectWithValue(response?.errorMessage);
  }
);

export const updateProfile = createAsyncThunk(
  "holder/update",
  async (user: AutOSAutID, { rejectWithValue }) => {
    const sdk = await AutSDK.getInstance();
    if (
      user.properties.avatar &&
      !isValidUrl(user.properties.avatar as string)
    ) {
      const file = base64toFile(user.properties.avatar as string, "image");
      user.properties.avatar = await sdk.client.sendFileToIPFS(file as File);
      console.log("New image: ->", ipfsCIDToHttpUrl(user.properties.avatar));
    }

    const updatedUser = AutOSAutID.updateAutIDNFT(user);
    const uri = await sdk.client.sendJSONToIPFS(updatedUser as any);
    console.log("New metadata: ->", ipfsCIDToHttpUrl(uri));
    console.log("avatar: ->", ipfsCIDToHttpUrl(updatedUser.properties.avatar));
    console.log("badge: ->", ipfsCIDToHttpUrl(updatedUser.image));
    const response = await sdk.autID.contract.setMetadataUri(uri);

    try {
      let connectedAutIdData: DAutAutID = {
        properties: {}
      } as DAutAutID;
      if (window.localStorage.getItem("aut-data")) {
        connectedAutIdData = JSON.parse(
          window.localStorage.getItem("aut-data")
        );
      }
      const dautAutId = new DAutAutID({
        ...user,
        ...connectedAutIdData,
        ...updatedUser,
        properties: {
          ...user.properties,
          ...connectedAutIdData.properties,
          ...updatedUser.properties
        }
      });
      if (connectedAutIdData.properties?.address && response.isSuccess) {
        window.localStorage.setItem(
          "aut-data",
          JSON.stringify(parse(stringify(dautAutId)))
        );
      }
    } catch (err) {
      console.log(err);
    }

    if (response.isSuccess) {
      return new AutOSAutID({
        ...user,
        ...updatedUser,
        properties: {
          ...user.properties,
          ...updatedUser.properties
        }
      } as AutOSAutID);
    }
    return rejectWithValue(response?.errorMessage);
  }
);
