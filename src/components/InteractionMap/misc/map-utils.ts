import { CENTRAL_NODE_SIZE, MAX_LINK_THICKNESS } from "./map-constants";
import { calculateIS } from "./is-calculator";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import { PLConfig } from "./pl-generator";
import { MapLink, MapNode } from "../node.model";
import { MapAutID } from "@api/map.model";

export const linkWidth = (node: LinkObject<MapNode, MapLink>) => {
  return (node.is / 100) * MAX_LINK_THICKNESS;
};

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

export function cloneGraphData(
  data: GraphData<MapNode, LinkObject<MapNode, MapLink>>
): GraphData<MapNode, LinkObject<MapNode, MapLink>> {
  const nodesCopy = data.nodes.map((node: NodeObject<MapNode>) => ({
    ...node,
    img: node.img instanceof Image ? node.img : undefined
  }));
  const linksCopy = data.links.map((link) => ({ ...link }));
  return { nodes: nodesCopy, links: linksCopy };
}

function generateNodes(
  plValues: PLConfig[],
  centralNode: NodeObject<MapNode>
): NodeObject<MapNode>[] {
  const nodes: NodeObject<MapNode>[] = [centralNode];

  plValues.forEach((pl) => {
    const usersInLevel = pl.members;
    const angleIncrement = 360 / Math.max(1, usersInLevel.length);

    usersInLevel.forEach((user, index) => {
      const userLevel = pl.level;
      const angle = angleIncrement * index;
      const { x, y } = polarToCartesian(0, 0, pl.radius, angle);
      const minPercentage = 0.5;
      const maxPercentage = 0.7;

      const numberOfLevels = plValues.length;
      const decrementStep =
        (maxPercentage - minPercentage) /
        (numberOfLevels > 1 ? numberOfLevels - 1 : 1);

      let nodeSizePercentage: number;
      if (userLevel >= 1 && userLevel <= numberOfLevels) {
        nodeSizePercentage = maxPercentage - decrementStep * (userLevel - 1);
      } else {
        nodeSizePercentage = 1;
      }
      const node: NodeObject<MapNode> = {
        ...user,
        x,
        y,
        pl: userLevel,
        size: CENTRAL_NODE_SIZE * nodeSizePercentage,
        color: `hsl(${(pl.level - 1) * 120}, 100%, 70%)`
      };
      nodes.push(node);
    });
  });

  return nodes;
}

function generateLinks(
  centralNode: NodeObject<MapNode>,
  nodes: NodeObject<MapNode>[]
): LinkObject<MapNode, MapLink>[] {
  const linksToCentral: LinkObject<MapNode, MapLink>[] = nodes
    .filter((node) => node.id !== centralNode.id)
    .map((node) => ({
      source: centralNode.id,
      target: node.id,
      is: calculateIS(node, centralNode, centralNode)
    }));

  console.log(centralNode, nodes);

  const interNodeLinks: LinkObject<MapNode, MapLink>[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].id !== centralNode.id && nodes[j].id !== centralNode.id) {
        const interactionStrength = calculateIS(
          nodes[i],
          nodes[j],
          centralNode
        );

        interNodeLinks.push({
          is: interactionStrength,
          source: nodes[i].id,
          target: nodes[j].id
        });
      }
    }
  }

  return linksToCentral.concat(interNodeLinks);
}

export const generateGraphData = (
  centralAutId: MapAutID,
  plValues: PLConfig[]
): GraphData<MapNode, LinkObject<MapNode, MapLink>> => {
  const centralNode: NodeObject<MapNode> = {
    ...centralAutId,
    size: CENTRAL_NODE_SIZE,
    color: "red",
    pl: 0,
    x: 0,
    y: 0
  };

  const nodes = generateNodes(plValues, centralNode);
  const links = generateLinks(centralNode, nodes);

  return { nodes, links };
};
