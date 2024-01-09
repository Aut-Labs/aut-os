/* eslint-disable max-len */
import AutTabs from "@components/AutTabs";
import { CommunityTasksTable } from "../../AutCommunity/AutNovaTabs/NovaTaskTable";
import PerfectScrollbar from "react-perfect-scrollbar";
import CommunitiesTable from "../AutLeft/CommunitiesTable";

import AutOsTabs from "@components/AutOsTabs";
import InteractionList from "../AutUserTabs/InteractionList";
import { AutOsInteractionTypes } from "./AutInteractionsData";

const AutInteractionTabs = () => {
  const { tech, defi, art, governance, reputation } = AutOsInteractionTypes;
  const tabs = [
    {
      label: "Tech & Infra",
      props: {
        interactions: tech
      },
      component: InteractionList
    },
    {
      label: "DeFi",
      props: {
        interactions: defi
      },
      component: InteractionList
    },

    {
      label: "Governance",
      props: {
        interactions: governance
      },
      component: InteractionList
    },
    {
      label: "Art, Gaming & NFTs",
      props: {
        interactions: art
      },
      component: InteractionList
    },
    {
      label: "Reputation & ID",
      props: {
        interactions: reputation
      },
      component: InteractionList
    }
  ];
  return (
    <>
      <AutOsTabs tabs={tabs}></AutOsTabs>
    </>
  );
};

export default AutInteractionTabs;
