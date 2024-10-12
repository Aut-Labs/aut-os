/* eslint-disable no-debugger */

import AutSDK, {
  BaseNFTModel,
  fetchMetadata,
  Hub,
  TaskContribution,
  TaskContributionNFT
} from "@aut-labs/sdk";
import { QueryFunctionOptions, QueryResult } from "@apollo/client";
import { useEffect, useState } from "react";
import { environment } from "@api/environment";
import { AutOSHub } from "@api/models/hub.model";
import { useSelector } from "react-redux";
import { Select } from "@mui/material";
import { SelectedHub, SelectedHubAddress } from "@store/aut/aut.reducer";
import { RootState } from "@react-three/fiber";

const fetchOnChainContributions = async (
  hubData: AutOSHub
): Promise<TaskContributionNFT[]> => {
  const sdk = await AutSDK.getInstance();
  const hubService: Hub = sdk.initService<Hub>(Hub, hubData.properties.address);
  const taskFactory = await hubService.getTaskFactory();
  const ids = (await taskFactory.functions.contributionIds()) as string[];

  const contributions = await Promise.all(
    ids.map(async (id) => {
      const _contribution = await taskFactory.functions.getContributionById(id);
      const contribution = TaskContribution.mapFromTuple(_contribution as any);
      const metadata = await fetchMetadata<BaseNFTModel<any>>(
        contribution.uri,
        environment.ipfsGatewayUrl
      );
      return {
        ...metadata,
        properties: {
          ...metadata.properties,
          ...contribution
        }
      };
    })
  );
  return contributions;
};

const useQueryContributions = (props: QueryFunctionOptions<any, any> = {}) => {
  const [contributions, setContributions] = useState<TaskContributionNFT[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const selectedHubAddress = useSelector(SelectedHubAddress);
  const hubData = useSelector(SelectedHub(selectedHubAddress));
  useEffect(() => {
    if (hubData) {
      const fetch = async () => {
        setLoadingMetadata(true);
        const contributions = await fetchOnChainContributions(hubData);
        setLoadingMetadata(false);
        setContributions(contributions);
      };
      fetch();
    }
  }, [hubData]);

  return {
    data: contributions || [],
    loading: loadingMetadata
  } as QueryResult<TaskContributionNFT[]>;
};

export default useQueryContributions;
