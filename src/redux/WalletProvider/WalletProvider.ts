import { NetworkConfig } from "@api/ProviderFactory/network.config";
import { initializeConnectors } from "@api/ProviderFactory/web3.connectors";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { ethers } from "ethers";

export enum ConnectorTypes {
  WalletConnect = "walletConnect",
  Metamask = "metamask"
}

export interface WalletProviderState {
  signer: ethers.providers.JsonRpcSigner;
  selectedWalletType: "injected" | "walletConnect";
  selectedNetwork: string;
  networksConfig: NetworkConfig[];
  isOpen: boolean;
  connectors: [MetaMask | WalletConnect, Web3ReactHooks][];
  wallets: any;
}

const initialState: WalletProviderState = {
  signer: null,
  selectedWalletType: null,
  selectedNetwork: null,
  isOpen: false,
  networksConfig: [],
  connectors: [],
  wallets: {}
};

export const walletProviderSlice = createSlice({
  name: "walletProvider",
  initialState,
  reducers: {
    setSigner(state, action) {
      state.signer = action.payload;
    },
    setWallet(state, action) {
      state.selectedWalletType = action.payload;
    },
    setProviderIsOpen(state, action) {
      state.isOpen = action.payload;
    },
    setNetwork(state, action) {
      state.selectedNetwork = action.payload as string;
    },
    setNetworks(state, action) {
      state.networksConfig = action.payload;
      const { metaMaskConnector, walletConnectConnector } =
        initializeConnectors(action.payload);
      const [metamask, metaMaskHooks] = metaMaskConnector;
      const [walletConnect, walletConnectHooks] = walletConnectConnector;

      const connectors: [MetaMask | WalletConnect, Web3ReactHooks][] = [
        [metamask, metaMaskHooks],
        [walletConnect, walletConnectHooks]
      ];
      state.wallets = {
        [ConnectorTypes.Metamask]: metaMaskConnector,
        [ConnectorTypes.WalletConnect]: walletConnectConnector
      };
      state.connectors = connectors;
    },
    resetWalletProviderState: () => initialState
  }
});

export const {
  setSigner,
  setWallet,
  setNetwork,
  setNetworks,
  setProviderIsOpen
} = walletProviderSlice.actions;

export const NetworkSelectorIsOpen = (state: any) =>
  state.walletProvider.isOpen as boolean;
export const SelectedWalletType = (state: any) =>
  state.walletProvider.selectedWalletType as string;
export const NetworkSigner = (state: any) =>
  state.walletProvider.signer as ethers.providers.JsonRpcSigner;
export const NetworksConfig = (state: any) =>
  state.walletProvider.networksConfig as NetworkConfig[];
export const NetworkConnectors = (state: any) =>
  state.walletProvider.connectors as [
    MetaMask | WalletConnect,
    Web3ReactHooks
  ][];
export const NetworkWalletConnectors = (state: any) =>
  state.walletProvider.wallets as any;
export const SelectedNetwork = (state: any) =>
  state.walletProvider.selectedNetwork as string;
export const SelectedNetworkConfig = createSelector(
  NetworksConfig,
  SelectedNetwork,
  (networks, networkName) =>
    networks.find(
      (r) => r.network?.toLowerCase() === networkName?.toLowerCase()
    )
);
export const NetworkConnector = (connectorName: string) =>
  createSelector(NetworkWalletConnectors, (x1) => x1[connectorName]);
export const BlockExplorerUrl = createSelector(
  SelectedNetworkConfig,
  (config) => {
    if (config) {
      return config.explorerUrls[0];
    }
  }
);

export const IsConnected = createSelector(
  SelectedNetworkConfig,
  NetworkSelectorIsOpen,
  NetworkSigner,
  (network, isOpen, signer) => {
    return !isOpen && !!network && !!signer;
  }
);

export default walletProviderSlice.reducer;
