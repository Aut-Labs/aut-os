import { AutId } from "@api/map.model";
import { generateNovas } from "./mock";
import { NodeObject } from "react-force-graph-2d";
import { MapNode } from "../node.model";

const PROXIMITY_LEVEL_DETAILS = [
  {
    name: "Role",
    description: "Members with the same role as you."
  },
  {
    name: "Nova",
    description: "Members within the same Nova as you."
  },
  {
    name: "Market",
    description: "Members within the same market but different Novas."
  },
  {
    name: "Āut Network",
    description: "Members from different Novas across various markets."
  }
];

export interface PLConfig {
  members: AutId[];
  name: string;
  description: string;
  level: number;
  radius: number;
}

export const getProximityLevels = (
  newuser: any,
  isNewCentralId: boolean
): {
  proximityLevels: PLConfig[];
  centralAutId: AutId;
} => {
  const novas = generateNovas(newuser);

  const autIds: AutId[] = novas.flatMap((nova) => nova.members);
  const centralAutId: AutId = isNewCentralId
    ? autIds.find((v) => v.username == newuser.username)
    : autIds[0];
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
    autIds.filter(
      (autId) =>
        autId.nova.id === centralAutId.nova.id &&
        autId.role === centralAutId.role
    ),
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

  const differentNovaAutIds = filterNonAccountedAutIds(
    autIds.filter((autId) => autId.nova.market !== centralAutId.nova.id),
    "differentNovaAutIds"
  );

  let plArrays = [
    {
      members: sameRoleAutIds,
      name: PROXIMITY_LEVEL_DETAILS[0]?.name,
      description: PROXIMITY_LEVEL_DETAILS[0]?.description
    },
    {
      members: sameNovaAutIds,
      name: PROXIMITY_LEVEL_DETAILS[1]?.name,
      description: PROXIMITY_LEVEL_DETAILS[1]?.description
    },
    {
      members: sameMarketAutIds,
      name: PROXIMITY_LEVEL_DETAILS[2]?.name,
      description: PROXIMITY_LEVEL_DETAILS[2]?.description
    },
    {
      members: differentNovaAutIds,
      name: PROXIMITY_LEVEL_DETAILS[3]?.name,
      description: PROXIMITY_LEVEL_DETAILS[3]?.description
    }
  ];
  plArrays = plArrays.filter((plArray) => plArray.members.length > 0); // Filter out empty levels
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

  const plValues = plArrays.map((plConfig, index) => ({
    level: index + 1,
    radius: minRadius + incrementStep * index,
    ...plConfig
  }));

  return { proximityLevels: plValues, centralAutId };
};

export function calculatePLCircleCentersAndRadii(nodes) {
  const circles = {};

  nodes.forEach((node) => {
    if (node.pl > 0) {
      if (!circles[node.pl]) {
        circles[node.pl] = {
          pl: node.pl,
          radius: 0,
          centerX: 0,
          centerY: 0,
          memberCount: 0
        };
      }

      circles[node.pl].radius += Math.sqrt(node.x * node.x + node.y * node.y);
      circles[node.pl].centerX += node.x;
      circles[node.pl].centerY += node.y;
      circles[node.pl].memberCount++;
    }
  });

  Object.keys(circles).forEach((pl) => {
    circles[pl].radius /= circles[pl].memberCount;
    circles[pl].centerX /= circles[pl].memberCount;
    circles[pl].centerY /= circles[pl].memberCount;
  });

  return circles;
}
