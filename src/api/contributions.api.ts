import { TaskContributionNFT } from "@aut-labs/sdk";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { AuthSig } from "@aut-labs/connector/lib/esm/aut-sig";
import { DiscordGatheringContribution } from "./models/contribution-types/discord-gathering.model";
import { OpenTaskContribution } from "./models/contribution-types/open-task.model";
import { QuizTaskContribution } from "./models/contribution-types/quiz.model.model";
import { RetweetContribution } from "./models/contribution-types/retweet.model";
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
  api: BaseQueryApi
) => {
  try {
    const state: any = api.getState() as any;
    const hubAddress = state.aut.selectedHubAddress;
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

const commitOpenTaskContribution = async (
  {
    contribution,
    autSig
  }: { contribution: OpenTaskContribution; autSig: AuthSig },
  api: BaseQueryApi
) => {
  const secredMessage = "secred";
  return commitContribution(autSig, contribution, secredMessage, api);
};

const commitTwitterRetweetContribution = async (
  {
    contribution,
    autSig
  }: { contribution: RetweetContribution; autSig: AuthSig },
  api: BaseQueryApi
) => {
  const secredMessage = "secred";
  return commitContribution(autSig, contribution, secredMessage, api);
};

const commitDiscordGatheringContribution = async (
  {
    contribution,
    autSig
  }: { contribution: DiscordGatheringContribution; autSig: AuthSig },
  api: BaseQueryApi
) => {
  const secredMessage = "secred";
  return commitContribution(autSig, contribution, secredMessage, api);
};

const commitQuizContribution = async (
  {
    contribution,
    autSig
  }: { contribution: QuizTaskContribution; autSig: AuthSig },
  api: BaseQueryApi
) => {
  const secredMessage = "secred";
  return commitContribution(autSig, contribution, secredMessage, api);
};

const commitAnyContribution = async (
  {
    contribution,
    autSig
  }: { contribution: TaskContributionNFT; autSig: AuthSig },
  api: BaseQueryApi
) => {
  if (contribution instanceof OpenTaskContribution) {
    return commitOpenTaskContribution({ contribution, autSig }, api);
  } else if (contribution instanceof DiscordGatheringContribution) {
    return commitDiscordGatheringContribution({ contribution, autSig }, api);
  } else if (contribution instanceof RetweetContribution) {
    return commitTwitterRetweetContribution({ contribution, autSig }, api);
  } else if (contribution instanceof QuizTaskContribution) {
    return commitQuizContribution({ contribution, autSig }, api);
  } else {
    throw new Error("Unknown contribution type");
  }
};

export const contributionsApi = createApi({
  reducerPath: "contributionsApi",
  baseQuery: (args, api, extraOptions) => {
    const { url, body } = args;
    if (url === "commitOpenTaskContribution") {
      return commitOpenTaskContribution(body, api);
    }
    if (url === "commitDiscordGatheringContribution") {
      return commitDiscordGatheringContribution(body, api);
    }
    if (url === "commitTwitterRetweetContribution") {
      return commitTwitterRetweetContribution(body, api);
    }
    if (url === "commitQuizContribution") {
      return commitQuizContribution(body, api);
    }
    if (url === "commitAnyContribution") {
      return commitAnyContribution(body, api);
    }
    return {
      data: "Test"
    };
  },
  tagTypes: ["Contributions"],
  endpoints: (builder) => ({
    commitOpenTaskContribution: builder.mutation<
      void,
      {
        autSig: AuthSig;
        contribution: OpenTaskContribution;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "commitOpenTaskContribution"
        };
      }
    }),
    commitDiscordGatheringContribution: builder.mutation<
      void,
      {
        autSig: AuthSig;
        contribution: DiscordGatheringContribution;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "commitDiscordGatheringContribution"
        };
      }
    }),
    commitTwitterRetweetContribution: builder.mutation<
      void,
      {
        autSig: AuthSig;
        contribution: RetweetContribution;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "commitTwitterRetweetContribution"
        };
      }
    }),
    commitQuizContribution: builder.mutation<
      void,
      {
        autSig: AuthSig;
        contribution: QuizTaskContribution;
      }
    >({
      query: (body) => {
        return {
          body,
          url: "commitQuizContribution"
        };
      }
    }),
    commitAnyContribution: builder.mutation<
      void,
      {
        autSig: AuthSig;
        contribution: TaskContributionNFT;
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

export const {
  useCommitAnyContributionMutation,
  useCommitTwitterRetweetContributionMutation,
  useCommitOpenTaskContributionMutation,
  useCommitDiscordGatheringContributionMutation,
  useCommitQuizContributionMutation
} = contributionsApi;
