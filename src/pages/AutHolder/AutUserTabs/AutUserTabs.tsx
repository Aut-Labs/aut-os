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
    title: "NFT Profile Showcase",
    type: "NFT",
    description:
      "Enhance your web3 profile with customizable NFT galleries and decentralized identity.",
    reputation: 100,
    xp: 100
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Decentralized Chat Hub",
    type: "Communication",
    description:
      "Connect and chat securely with web3 friends, preserving privacy and ownership.",
    reputation: 100,
    xp: 100
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Crypto Wallet Integrator",
    type: "Financial Tools",
    description:
      "Seamlessly manage assets and transactions with integrated crypto wallet support..",
    reputation: 100,
    xp: 100
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Web3 Analytics Tracker",
    type: "Data Insights",
    description:
      "Gain valuable insights into your web3 activity and trends with detailed analytics.",
    reputation: 100,
    xp: 100
  },
  {
    image:
      "ipfs://bafybeifbq3ysgpfmknctgc5nda7gxmdmkqhhurj7typk5a34svp6nlsvg4/AutID.png",
    title: "Token Swap Wizard",
    type: "Defi",
    description:
      "Effortlessly exchange tokens, liquidity, and yield farm on web3 DeFi platforms.",
    reputation: 100,
    xp: 100
  }
];

const AutUserTabs = ({ communities }) => {
  const tabs = [
    {
      label: "Map",
      props: {
        communities
      },
      component: AutMap
    },
    {
      label: "Novae",
      props: {
        communities: communities
      },
      component: NovaeList
    },

    {
      label: "Plugins ✨",
      props: {
        plugins
      },
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
