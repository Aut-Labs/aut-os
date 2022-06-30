import { envionmentGenerator } from 'sw-web-shared';

export enum EnvMode {
  Production = 'production',
  Development = 'development',
}

export const swEnvVariables = {
  // app config
  rpcUrls: 'REACT_APP_MATIC_RPC_URLS',
  env: 'REACT_APP_NODE_ENV',
  apiUrl: 'REACT_APP_API_URL',
  autIDAddress: 'REACT_APP_AUT_ID_ADDRESS',
};

export const environment: typeof swEnvVariables = envionmentGenerator(swEnvVariables);
