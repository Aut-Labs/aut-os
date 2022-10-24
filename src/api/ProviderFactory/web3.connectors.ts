import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { NetworkConfig } from './network.config';

export const initializeConnectors = (networks: NetworkConfig[]) => {
  const { supportedChainIds, rpcUrls } = networks.reduce(
    (prev, curr) => {
      prev.supportedChainIds = [...prev.supportedChainIds, Number(curr.chainId)];
      prev.rpcUrls = {
        ...prev.rpcUrls,
        [curr.chainId]: curr.rpcUrls.join('|'),
      };
      return prev;
    },
    {
      supportedChainIds: [],
      rpcUrls: {},
    }
  );

  const metaMaskConnector = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }));
  const walletConnectConnector = initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          qrcode: true,
          bridge: 'https://bridge.walletconnect.org',
          rpc: rpcUrls,
        },
      })
  );

  return {
    metaMaskConnector,
    walletConnectConnector,
  };
};
