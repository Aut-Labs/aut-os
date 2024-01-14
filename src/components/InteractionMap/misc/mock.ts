import tao from "@assets/aut-team-avatars/tao.jpeg";
import antonio from "@assets/aut-team-avatars/antonio.jpg";
import libby from "@assets/aut-team-avatars/libby.png";
import jl from "@assets/aut-team-avatars/jl.jpg";
import jabyl from "@assets/aut-team-avatars/jabyl.jpg";
import barbaros from "@assets/aut-team-avatars/barbaros.jpeg";
import iulia from "@assets/aut-team-avatars/iulia.jpg";
import unknown from "@assets/aut-team-avatars/unknown.png";
import { AutId, AutIdInteractions, Nova } from "@api/map.model";

export const interactionsMock: AutIdInteractions[] = [
  {
    type: "Tech & Infra",
    name: "Ethereum",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Tech & Infra",
    name: "Gnosis Chain",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Tech & Infra",
    name: "Polygon",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "DeFi",
    name: "Uniswap",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "DeFi",
    name: "1Inch",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "DeFi",
    name: "Quickswap",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "DeFi",
    name: "AAVE",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "DeFi",
    name: "Rarible",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "DeFi",
    name: "OpenSea",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "DeFi",
    name: "Foundation",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "DeFi",
    name: "Async",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "DeFi",
    name: "Superfluid",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Governance & Community",
    name: "Snapshot",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Governance & Community",
    name: "clr.fund",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Governance & Community",
    name: "givETH",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Governance & Community",
    name: "Gitcoin",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Governance & Community",
    name: "Kleros",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Governance & Community",
    name: "Aragon",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Governance & Community",
    name: "DAOHaus",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Governance & Community",
    name: "Colony",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Governance & Community",
    name: "Wonderverse",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Art, Gaming & NFTs",
    name: "Rarible",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Art, Gaming & NFTs",
    name: "OpenSea",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Art, Gaming & NFTs",
    name: "Foundation",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Art, Gaming & NFTs",
    name: "Async",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Art, Gaming & NFTs",
    name: "Mirror",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Art, Gaming & NFTs",
    name: "ReNFT",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Reputation & ID",
    name: "Praise",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Reputation & ID",
    name: "Coordinape",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Reputation & ID",
    name: "SourceCred",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Reputation & ID",
    name: "Optimism",
    description: "",
    weight: "0",
    status: "Incomplete"
  },
  {
    type: "Reputation & ID",
    name: "Ceramic",
    description: "",
    weight: "0",
    status: "Incomplete"
  }
];

function assignRandomStatus(interactions) {
  return interactions.map((interaction) => {
    return {
      ...interaction,
      status: Math.random() > 0.5 ? "Complete" : "Incomplete"
    };
  });
}

export function generateMembersWithInteractions(members) {
  return members.map((member) => {
    return {
      ...member,
      interactions: assignRandomStatus(interactionsMock)
    };
  });
}

const mockNovas = [
  {
    market: "Infra, Defi & DAO Tooling",
    roles: [1, 2, 3],
    avatar: "aut-labs.png",
    metadata: "",
    minCommitment: 5,
    members: generateMembersWithInteractions([
      {
        owner: "ownerC",
        username: "mr_meeseeks",
        avatar: tao,
        commitment: 7,
        role: 1
      },
      {
        owner: "ownerA",
        username: "AntAnt",
        avatar: antonio,
        commitment: 5,
        role: 1
      },
      {
        owner: "ownerP",
        username: "Eulalie",
        avatar: iulia,
        commitment: 5,
        role: 1
      },
      {
        owner: "ownerB",
        username: "ProudLemon",
        avatar: libby,
        commitment: 6,
        role: 2
      },
      {
        owner: "ownerD",
        username: "JL",
        avatar: jl,
        commitment: 5,
        role: 2
      },
      {
        owner: "ownerP",
        username: "Barbaros",
        avatar: barbaros,
        commitment: 5,
        role: 1
      },

      {
        owner: "ownerP",
        username: "Mihanix",
        avatar: unknown,
        commitment: 5,
        role: 2
      }
    ])
  }
  // {
  //   market: "Art, Events & NFTs",
  //   roles: [1, 2, 3],
  //   avatar: "healthtech1.png",
  //   metadata: "",
  //   minCommitment: 7,
  //   members: [
  //     {
  //       owner: "ownerF",
  //       username: "frank_morris",
  //       avatar: "userF.png",
  //       commitment: 9,
  //       role: 1,
  //     },
  //     {
  //       owner: "ownerG",
  //       username: "grace_taylor",
  //       avatar: "userG.png",
  //       commitment: 9,
  //       role: 2,
  //     }
  //   ]
  // }
  // {
  //   market: "Healthtech",
  //   roles: [1, 2, 3],
  //   avatar: "healthtech1.png",
  //   metadata: "",
  //   minCommitment: 7,
  //   members: [
  //     {
  //       owner: "ownerF",
  //       username: "frank_morris",
  //       avatar: "userF.png",
  //       commitment: 9,
  //       role: 1,
  //     },
  //     {
  //       owner: "ownerG",
  //       username: "grace_taylor",
  //       avatar: "userG.png",
  //       commitment: 8,
  //       role: 2,
  //     },
  //     {
  //       owner: "ownerH",
  //       username: "henry_allen",
  //       avatar: "userH.png",
  //       commitment: 7,
  //       role: 2,
  //     },
  //     {
  //       owner: "ownerI",
  //       username: "isabel_hernandez",
  //       avatar: "userI.png",
  //       commitment: 10,
  //       role: 3,
  //     },
  //     {
  //       owner: "ownerJ",
  //       username: "john_doe",
  //       avatar: "userJ.png",
  //       commitment: 6,
  //       role: 1,
  //     }
  //   ]
  // },
  // {
  //   market: "Edtech",
  //   roles: [1, 2, 3],
  //   avatar: "edtech1.png",
  //   minCommitment: 6,
  //   metadata: "",
  //   members: [
  //     {
  //       owner: "ownerK",
  //       username: "karen_lopez",
  //       avatar: "userK.png",
  //       commitment: 7,
  //       role: 1,
  //     },
  //     {
  //       owner: "ownerL",
  //       username: "leo_king",
  //       avatar: "userL.png",
  //       commitment: 6,
  //       role: 3,
  //     },
  //     {
  //       owner: "ownerM",
  //       username: "monica_garcia",
  //       avatar: "userM.png",
  //       commitment: 8,
  //       role: 2,
  //     },
  //     {
  //       owner: "ownerN",
  //       username: "nathan_moore",
  //       avatar: "userN.png",
  //       commitment: 5,
  //       role: 1,
  //     },
  //     {
  //       owner: "ownerO",
  //       username: "olivia_brown",
  //       avatar: "userO.png",
  //       commitment: 9,
  //       role: 3,
  //     },
  //     {
  //       owner: "ownerV",
  //       username: "victor_hugo",
  //       avatar: "userV.png",
  //       commitment: 4,
  //       role: 1,
  //     },
  //     {
  //       owner: "ownerW",
  //       username: "wanda_maximoff",
  //       avatar: "userW.png",
  //       commitment: 6,
  //       role: 2,
  //     },
  //     {
  //       owner: "ownerX",
  //       username: "xander_harris",
  //       avatar: "userX.png",
  //       commitment: 8,
  //       role: 1,
  //     },
  //     {
  //       owner: "ownerY",
  //       username: "yara_greyjoy",
  //       avatar: "userY.png",
  //       commitment: 5,
  //       role: 3,
  //     }
  //   ]
  // }
];

export const generateNovas = (newuser: any) => {
  return mockNovas.map((nova) => {
    const members = [];
    const newNova = new Nova(
      nova.market,
      nova.roles,
      nova.metadata,
      nova.avatar,
      nova.minCommitment,
      nova.members
    );

    nova.members.forEach((member) => {
      const newMember = new AutId(
        member.owner,
        member.username,
        member.commitment,
        member.role,
        member.interactions,
        member.avatar,
        newNova
      );
      members.push(newMember);
    });

    if (newuser) {
      const newMember = new AutId(
        newuser.owner,
        newuser.username,
        newuser.commitment,
        newuser.role,
        newuser.interactions,
        newuser.avatar,
        newNova
      );
      members.push(newMember);
    }

    debugger;

    newNova.members = members;

    return newNova;
  });
};
