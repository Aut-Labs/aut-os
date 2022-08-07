import { toHex } from '@utils/helpers';
import { NetworkConfig } from '@store/model';

const nativeCurrency = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
};

export const EnableAndChangeNetwork = async (provider: any, config: NetworkConfig) => {
  console.info('Changing Network', config);
  const params = [
    {
      chainId: toHex(config.network.chainId),
      chainName: config.network.name,
      rpcUrls: config.network.rpcUrls,
      blockExplorerUrls: config.network.blockExplorerUrls,
    },
  ];

  const [{ chainId }] = params;

  try {
    await provider.request({ method: 'eth_requestAccounts' });
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params,
        });
      } catch (addError) {
        throw new Error(addError);
      }
    } else {
      throw new Error(switchError);
    }
  }
};
