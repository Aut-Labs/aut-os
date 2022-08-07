import { environment } from '@api/environment';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';

const supportedChainIds = environment.chainIds.split(',').map(Number);

const URLS = supportedChainIds.reduce((prev, curr, index) => {
  const rpcUrl = environment.rpcUrls.split(',')[index].split('|');
  prev[curr] = rpcUrl;
  return prev;
}, {});

export const metaMaskConnector = initializeConnector<MetaMask>((actions) => new MetaMask(actions), supportedChainIds);

export const walletConnectConnector = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      qrcode: true,
      bridge: 'https://bridge.walletconnect.org',
      rpc: URLS,
    }),
  supportedChainIds
);
