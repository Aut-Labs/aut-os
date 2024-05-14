import { envionmentGenerator } from "@utils/env";

export enum EnvMode {
  Production = "production",
  Development = "development"
}

export const swEnvVariables = {
  // app config
  env: "REACT_APP_NODE_ENV",
  apiUrl: "REACT_APP_API_URL",
  interactionsApiUrl: "REACT_APP_INTERACTIONS_API",
  graphApiUrl: "REACT_APP_GRAPH_API_URL",

  // Aut networks
  networkEnv: "REACT_APP_NETWORK_ENV",

  // IPFS storage
  ipfsApiKey: "REACT_APP_IPFS_API_KEY",
  ipfsApiSecret: "REACT_APP_IPFS_API_SECRET",
  ipfsGatewayUrl: "REACT_APP_IPFS_GATEWAY_URL"
};

export const environment: typeof swEnvVariables =
  envionmentGenerator(swEnvVariables);
