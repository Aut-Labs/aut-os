import { MapAutID, MapNova } from "@api/map.model";
import { NodeObject } from "react-force-graph-2d";
import {
  CENTRAL_NODE_SIZE,
  NODE_PADDING,
  NODE_BORDER_WIDTH
} from "./map-constants";

const PROXIMITY_LEVEL_DETAILS = [
  {
    name: "Role",
    description: "Members with the same role as you."
  },
  {
    name: "Hub",
    description: "Members within the same Hub as you."
  }
  // {
  //   name: "Market",
  //   description: "Members within the same market but different Hubs."
  // },
  // {
  //   name: "Āut Network",
  //   description: "Members from different Novas across various markets."
  // }
];

export interface PLConfig {
  members: MapAutID[];
  name: string;
  description: string;
  level: number;
  radius: number;
}

export const getProximityLevels = (
  mapData: MapNova
): {
  proximityLevels: PLConfig[];
  centralAutId: MapAutID;
} => {
  const centralAutId: MapAutID = mapData.centralNode;
  const autIds: MapAutID[] = mapData.members;
  const accountedUsernames = new Set([centralAutId.name]);

  const filterNonAccountedAutIds = (levelAutIds) => {
    return levelAutIds.filter((autId: MapAutID) => {
      const isAlreadyAccounted = accountedUsernames.has(autId.name);
      if (!isAlreadyAccounted) {
        accountedUsernames.add(autId.name);
      }
      return !isAlreadyAccounted;
    });
  };

  const sameHubAndRoleAutIds = filterNonAccountedAutIds(
    autIds.filter(
      (autId: MapAutID) =>
        autId.nova.properties.address ===
          centralAutId.nova.properties.address &&
        autId.properties.role === centralAutId.properties.role
    )
  );

  const sameHubDifferentRoleAutIds = filterNonAccountedAutIds(
    autIds.filter(
      (autId: MapAutID) =>
        autId.nova.properties.address ===
          centralAutId.nova.properties.address &&
        autId.properties.role !== centralAutId.properties.role
    )
  );

  // Assign proximity levels
  const plArrays = [
    {
      members: sameHubAndRoleAutIds,
      name: PROXIMITY_LEVEL_DETAILS[0]?.name,
      description: PROXIMITY_LEVEL_DETAILS[0]?.description
    },
    {
      members: sameHubDifferentRoleAutIds,
      name: PROXIMITY_LEVEL_DETAILS[1]?.name,
      description: PROXIMITY_LEVEL_DETAILS[1]?.description
    }
  ];

  const plValues = plArrays.map((plConfig, index) => ({
    level: index + 1,
    radius: (index + 1) * 100, // Adjust radius calculation as per the new levels
    ...plConfig
  }));

  return { proximityLevels: plValues, centralAutId };
};

export function calculatePLCircleCentersAndRadii(nodes: NodeObject<any>[]) {
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
