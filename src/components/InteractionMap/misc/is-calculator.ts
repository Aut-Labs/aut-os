import { NodeObject } from "react-force-graph-2d";
import { MapNode } from "../node.model";

const getCompletedInteractions = (node: NodeObject<MapNode>) => {
  return node.properties.interactions
    .filter((interaction) => interaction.status === "Complete")
    .map((interaction) => interaction.name);
};

const getSharedInteractions = (
  sourceInteractions: string[],
  targeInteractions: string[]
) => {
  return sourceInteractions.filter((interaction) =>
    targeInteractions.includes(interaction)
  );
};

export const calculateIS = (
  source: NodeObject<MapNode>,
  target: NodeObject<MapNode>,
  centralNode: NodeObject<MapNode>
) => {
  const centralNodeInteractions = getCompletedInteractions(centralNode);
  if (centralNodeInteractions.length === 0) {
    return 0;
  }

  const sourceInteractions = getCompletedInteractions(source);
  const targetInteractions = getCompletedInteractions(target);

  // get only same name/type interactions that both source and target have completed
  const sharedInteractions = getSharedInteractions(
    sourceInteractions,
    targetInteractions
  );

  // now get only interactions that are shared with central node
  const sharedWithCentralNodeInteractions = getSharedInteractions(
    sharedInteractions,
    centralNodeInteractions
  );

  return (
    (sharedWithCentralNodeInteractions.length /
      centralNodeInteractions.length) *
    100
  );
};
