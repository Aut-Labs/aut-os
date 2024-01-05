import { NodeObject, GraphData } from "react-force-graph-2d";
import { CENTRAL_NODE_SIZE, MAX_LINK_THICKNESS } from "./map-constants";
/* eslint-disable max-len */
import { mockNovas } from "./mock";
import { AutId, Nova } from "@api/map.model";

export const generateNovas = () => {
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
        member.completedInteractionsCount,
        member.avatar,
        newNova
      );
      members.push(newMember);
    });

    newNova.members = members;

    return newNova;
  });
};

export const getProximityLevels = () => {
  const novas = generateNovas();

  const autIds: AutId[] = novas.flatMap((nova) => nova.members);
  const centralAutId: AutId = autIds[0];
  const accountedUsernames = new Set([centralAutId.username]);

  const filterNonAccountedAutIds = (levelAutIds: AutId[], test: string) => {
    if (!Array.isArray(levelAutIds)) {
      console.error("Expected an array, received:", levelAutIds, test);
      return [];
    }

    return levelAutIds.filter((autId) => {
      const isAlreadyAccounted = accountedUsernames.has(autId.username);
      if (!isAlreadyAccounted) {
        accountedUsernames.add(autId.username);
      }
      return !isAlreadyAccounted;
    });
  };

  const sameRoleAutIds = filterNonAccountedAutIds(
    autIds.filter((autId) => autId.role === centralAutId.role),
    "sameRoleAutIds"
  );

  const sameNovaAutIds = filterNonAccountedAutIds(
    centralAutId.nova.members,
    "sameNovaAutIds"
  );

  const sameMarketAutIds = filterNonAccountedAutIds(
    autIds.filter((autId) => autId.nova.market === centralAutId.nova.market),
    "sameMarketAutIds"
  );

  const differentMarketAutIds = filterNonAccountedAutIds(
    autIds.filter((autId) => autId.nova.market !== centralAutId.nova.market),
    "differentMarketAutIds"
  );

  let plArrays = [
    sameRoleAutIds,
    sameNovaAutIds,
    sameMarketAutIds,
    differentMarketAutIds
  ];
  plArrays = plArrays.filter((plArray) => plArray.length > 0); // Filter out empty levels
  const numberOfLevels = plArrays.length;

  let [minRadius, maxRadius] = [80, 260];
  switch (numberOfLevels) {
    case 1:
      [minRadius, maxRadius] = [120, 120];
      break;
    case 2:
      [minRadius, maxRadius] = [120, 180];
      break;
    case 3:
      [minRadius, maxRadius] = [80, 200];
      break;
  }

  const incrementStep =
    numberOfLevels > 1 ? (maxRadius - minRadius) / (numberOfLevels - 1) : 0;

  const plValues = plArrays.map((members, index) => ({
    level: index + 1,
    radius: minRadius + incrementStep * index,
    members: members
  }));

  return { plValues, centralAutId };
};

export const linkWidth = (link) => {
  return (link.is / 100) * MAX_LINK_THICKNESS;
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

export function cloneGraphData(data): GraphData {
  const nodesCopy = data.nodes.map((node: NodeObject) => ({
    ...node,
    img: node.img instanceof Image ? node.img : undefined
  }));
  const linksCopy = data.links.map((link) => ({ ...link }));
  return { nodes: nodesCopy, links: linksCopy };
}

const calculateIS = (interactionsUserB, interactionsUserA) => {
  return (interactionsUserB / interactionsUserA) * 100;
};

function generateNodes(plValues, centralNode) {
  const nodes = [centralNode];
  const linkStrengths = {};

  plValues.forEach((pl) => {
    const usersInLevel = pl.members;
    const angleIncrement = 360 / Math.max(1, usersInLevel.length);

    usersInLevel.forEach((user, index) => {
      const angle = angleIncrement * index;
      const { x, y } = polarToCartesian(0, 0, pl.radius, angle);

      user.x = x;
      user.y = y;
      const userLevel = pl.level;

      const minPercentage = 0.5;
      const maxPercentage = 0.7;

      const numberOfLevels = plValues.length;
      const decrementStep =
        (maxPercentage - minPercentage) / (numberOfLevels - 1);

      let nodeSizePercentage;
      if (userLevel >= 1 && userLevel <= numberOfLevels) {
        nodeSizePercentage = maxPercentage - decrementStep * (userLevel - 1);
      } else {
        nodeSizePercentage = 1;
      }

      console.log("nodeSizePercentage:", nodeSizePercentage);

      user.size = CENTRAL_NODE_SIZE * nodeSizePercentage;
      user.color = `hsl(${(pl.level - 1) * 120}, 100%, 70%)`;

      linkStrengths[user.id] = calculateIS(
        user.completedInteractionsCount,
        centralNode.completedInteractionsCount
      );

      nodes.push(user);
    });
  });

  return { nodes, linkStrengths };
}

const generateLinks = (sourceId, nodes, linkStrengths) => {
  return nodes
    .filter((node) => node.id !== sourceId)
    .map((node) => {
      return {
        source: sourceId,
        target: node.id,
        is: linkStrengths[node.id]
      };
    });
};

export const generateGraphData = (centralAutId, plValues): GraphData => {
  // Central node based on specific AutId data

  const img = new Image();
  img.src = centralAutId.avatar;

  const centralNode = {
    id: centralAutId.id,
    username: centralAutId.username,
    role: centralAutId.role,
    img: centralAutId.img,
    completedInteractionsCount: centralAutId.completedInteractionsCount,
    pl: 0,
    x: 0,
    y: 0,
    size: CENTRAL_NODE_SIZE,
    color: "red"
  };

  const { nodes, linkStrengths } = generateNodes(plValues, centralNode);
  const links = generateLinks(centralAutId.id, nodes, linkStrengths);

  return { nodes, links };
};
