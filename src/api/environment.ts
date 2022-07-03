import { envionmentGenerator } from 'sw-web-shared';

export enum EnvMode {
  Production = 'production',
  Development = 'development',
}

export const swEnvVariables = {
  // app config
  rpcUrls: 'REACT_APP_MATIC_RPC_URLS',
  env: 'REACT_APP_NODE_ENV',
  // Aut
  apiUrl: 'REACT_APP_API_URL',
  registryAdress: 'REACT_APP_COMMUNITY_REGISTRY_ADDRESS',
  autIDAddress: 'REACT_APP_AUT_ID_ADDRESS',
  // NFT storage
  nftStorageKey: 'REACT_APP_NFT_STORAGE_KEY',
  nftStorageUrl: 'REACT_APP_IPFS_URL',
};

export const environment: typeof swEnvVariables = envionmentGenerator(swEnvVariables);
