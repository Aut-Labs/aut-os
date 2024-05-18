import AutOsTabs from "@components/AutOsTabs";
import InteractionList from "../AutUserTabs/InteractionList";
import { AutOsInteractionTypes } from "./AutInteractionsData";

const AutInteractionTabs = () => {
  const { tech, defi, art, governance, reputation } = AutOsInteractionTypes;
  const tabs = [
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
      label: (
        <>
          Tech <br /> & Infra
        </>
      ),
      props: {
        interactions: tech
      },
      component: InteractionList
    },

    {
      label: (
        <>
          Art, Gaming <br />& NFTs
        </>
      ),
      props: {
        interactions: art
      },
      component: InteractionList
    },
    {
      label: (
        <>
          Reputation <br />& ID
        </>
      ),
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
