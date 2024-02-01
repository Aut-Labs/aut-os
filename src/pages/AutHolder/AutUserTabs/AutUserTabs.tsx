/* eslint-disable max-len */
import AutTabs from "@components/AutTabs";
import { CommunityTasksTable } from "../../AutCommunity/AutNovaTabs/NovaTaskTable";
import PerfectScrollbar from "react-perfect-scrollbar";
import CommunitiesTable from "../AutLeft/CommunitiesTable";

import NovaeList from "./NovaeList";
import AutOsTabs from "@components/AutOsTabs";
import AutMap from "./ConnectionsMap";
import PluginList from "./PluginList";

const plugins = [
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Message in a bottle",
    description:
      "Allows anyone with an ĀutID to write a message, a statement, a proposal, a bio, an SOS, an ad, an eulogy or anything, really - to anyone who is connected to them in a customizable degree of proximity (i.e.: min. 4/5/200 interactions)",
    reputation: 100
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Portfolio ",
    description:
      "Highlight your favorite on-chain works, contributions or interactions in a custom-widget page.",
    reputation: 100
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Propose Collab",
    description:
      "You have one shot to connect to and work together with the most interesting stranger you've found in the entire decentralized world. What will you say to them?",
    reputation: 100
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Private Thread",
    description:
      'Create a decentralized, Reddit-like thread with custom rules such as ["same Role"; "same Nova"; "min Reputation"; etc.]. And start a conversation with provably like-minded people.',
    reputation: 100
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Accept Tips",
    description:
      'Add a fancy, customizable "Tip me" button to your profile - and accept support, funding or donations from anyone.',
    reputation: 100
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Multi-sig Thread",
    description:
      "Some conversations are more important than others. Create and export a multi-sig thread, in the form of an NFT that all the participants can own and create rules of distribution for. Think of it as a decentralized, portable protocol to record and enforce IPs.",
    reputation: 100
  }
];

const AutUserTabs = ({ nova }) => {
  const tabs = [
    {
      label: "Map",
      props: {
        nova
      },
      component: AutMap
    },
    {
      label: "Novae",
      props: {
        communities: [nova]
      },
      component: NovaeList
    },

    {
      label: "Plugins 🔒",
      props: {
        plugins
      },
      disabled: true,
      component: PluginList
    }
  ];
  return (
    <>
      <AutOsTabs tabs={tabs}></AutOsTabs>
    </>
  );
};

export default AutUserTabs;
