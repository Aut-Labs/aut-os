import { TaskContributionNFT } from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { AuthSig } from "@aut-labs/connector/lib/esm/aut-sig";
import axios from "axios";
import { environment } from "./environment";

interface CommitRequest {
  autSig: AuthSig;
  message: string;
  hubAddress: string;
  contributionId: string;
}

export const _commitContribution = async (
  body: CommitRequest
): Promise<string> => {
  const r = await axios.post(
    `${environment.apiUrl}/task/contribution/commit`,
    body
  );
  return r.data;
};

const commitContribution = async (
  autSig: AuthSig,
  contribution: TaskContributionNFT,
  message: string,
  hubAddress: string,
  api: BaseQueryApi
) => {
  try {
    const response = _commitContribution({
      autSig: autSig,
      message: message,
      hubAddress: hubAddress,
      contributionId: contribution.properties.id
    });
    return {
      data: response
    };
  } catch (error) {
    return {
      error: error.message
    };
  }
};

const commitAnyContribution = async (
  {
    contribution,
    autSig,
    message,
    hubAddress
  }: {
    contribution: TaskContributionNFT;
    autSig: AuthSig;
    message: string;
    hubAddress: string;
  },
  api: BaseQueryApi
) => {
  return commitContribution(autSig, contribution, message, hubAddress, api);
};

export const contributionsApi = createApi({
  reducerPath: "contributionsApi",
  baseQuery: (args, api) => {
    const { url, body } = args;
    if (url === "commitAnyContribution") {
      return commitAnyContribution(body, api);
    }
    return {
      data: "Test"
    };
  },
  tagTypes: [],
  endpoints: (builder) => ({
    commitAnyContribution: builder.mutation<
      void,
      {
        autSig: AuthSig;
        contribution: TaskContributionNFT;
        message: string;
        hubAddress: string;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "commitAnyContribution"
        };
      }
    })
  })
});

export const { useCommitAnyContributionMutation } = contributionsApi;
