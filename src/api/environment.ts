import { NetworkConfig } from '@store/model';
import { envionmentGenerator } from 'sw-web-shared';

export enum EnvMode {
  Production = 'production',
  Development = 'development',
}

export const swEnvVariables = {
  // app config
  env: 'REACT_APP_NODE_ENV',
  apiUrl: 'REACT_APP_API_URL',

  // Aut networks
  networks: 'REACT_APP_NETWORKS',
  networkNames: 'REACT_APP_NETWORK_NAMES',
  rpcUrls: 'REACT_APP_RPC_URLS',
  chainIds: 'REACT_APP_CHAIN_IDS',
  blockExplorerUrls: 'REACT_APP_BLOCK_EXPLORER_URLS',
  registryAddresses: 'REACT_APP_DAO_REGISTRY_ADDRESSES',
  autIDAddresses: 'REACT_APP_AUT_ID_ADDRESSES',

  // NFT storage
  nftStorageKey: 'REACT_APP_NFT_STORAGE_KEY',
  nftStorageUrl: 'REACT_APP_IPFS_URL',
};

export const environment: typeof swEnvVariables = envionmentGenerator(swEnvVariables);

export const getNetworkVariables = (name: string): NetworkConfig => {
  const index = environment.networks.split(',').findIndex((r) => r.trim().toLowerCase() === name.trim().toLowerCase());
  const autIdAddress = environment.autIDAddresses.split(',')[index];
  const registryAddress = environment.registryAddresses.split(',')[index];
  const rpcUrls = environment.rpcUrls.split(',')[index].split('|');
  const blockExplorerUrls = environment.blockExplorerUrls.split(',')[index].split('|');
  const chainId = environment.chainIds.split(',')[index];

  return {
    autIdAddress,
    registryAddress,
    network: {
      name,
      rpcUrls,
      chainId: Number(chainId),
      blockExplorerUrls,
    },
  } as NetworkConfig;
};
