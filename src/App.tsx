import { Suspense, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAppDispatch } from "@store/store.model";
import { setNetworks } from "@store/WalletProvider/WalletProvider";
import AutLoading from "@components/AutLoading";
import Web3DautConnect from "@api/ProviderFactory/components/web3-daut-connect";
import AutSearch from "./pages/AutHome/AutSearch";
import AutHolder from "./pages/AutHolder/AutHolder";
import SWSnackbar from "./components/snackbar";
import { environment } from "@api/environment";
import { NetworkConfig } from "@api/ProviderFactory/network.config";
import { ethers } from "ethers";
import { Network } from "@ethersproject/networks";
import { getAppConfig } from "@api/aut.api";
import { Config, DAppProvider, MetamaskConnector } from "@usedapp/core";
import { WalletConnectConnector } from "@usedapp/wallet-connect-connector";
import AutSDK from "@aut-labs/sdk";
import "./App.scss";

const generateConfig = (networks: NetworkConfig[]): Config => {
  const enabled_networks = networks.filter((n) => !n.disabled);
  const readOnlyUrls = enabled_networks.reduce((prev, curr) => {
    const network = {
      name: "mumbai",
      chainId: 80001,
      _defaultProvider: (providers) =>
        new providers.JsonRpcProvider(curr.rpcUrls[0])
    };
    const provider = ethers.getDefaultProvider(network);
    prev[curr.chainId] = provider;
    return prev;
  }, {});

  return {
    readOnlyUrls,
    notifications: {
      expirationPeriod: 0
    },
    autoConnect: false,
    // @ts-ignore
    networks: enabled_networks.map((n) => ({
      isLocalChain: false,
      isTestChain: environment.networkEnv === "testing",
      chainId: n.chainId,
      chainName: n.network,
      rpcUrl: n.rpcUrls[0],
      nativeCurrency: n.nativeCurrency
    })),
    gasLimitBufferPercentage: 50000,
    pollingIntervals: enabled_networks.reduce((prev, curr) => {
      prev[curr.chainId] = 40000;
      return prev;
    }, {}),
    connectors: {
      metamask: new MetamaskConnector(),
      walletConnect: new WalletConnectConnector({
        rpc: enabled_networks.reduce((prev, curr) => {
          // eslint-disable-next-line prefer-destructuring
          prev[curr.chainId] = curr.rpcUrls[0];
          return prev;
        }, {}),
        infuraId: "d8df2cb7844e4a54ab0a782f608749dd"
      })
    }
  };
};

function App() {
  const dispatch = useAppDispatch();
  const [appLoading, setAppLoading] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [config, setConfig] = useState<Config>(null);

  useEffect(() => {
    getAppConfig()
      .then(async (res) => {
        dispatch(setNetworks(res));
        setConfig(generateConfig(res));
        const sdk = new AutSDK({
          nftStorageApiKey: environment.nftStorageKey
        });
      })
      .finally(() => setAppLoading(false));
  }, []);

  return (
    <>
      {appLoading ? (
        <AutLoading />
      ) : (
        <DAppProvider config={config}>
          <Web3DautConnect config={config} setLoading={setLoading} />
          <SWSnackbar />
          <Box
            sx={{
              height: "100vh"
            }}
          >
            {isLoading ? (
              <AutLoading />
            ) : (
              <Suspense fallback={<AutLoading />}>
                <Routes>
                  <Route path="/" element={<AutSearch />} />
                  <Route path="/:holderAddress/*" element={<AutHolder />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            )}
          </Box>
        </DAppProvider>
      )}
    </>
  );
}

export default App;
