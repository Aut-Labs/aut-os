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
import { getAppConfig } from "@api/aut.api";
import AutSDK from "@aut-labs/sdk";
import "./App.scss";
import { useSelector } from "react-redux";
import { CanUpdateProfile } from "@auth/auth.reducer";
import AutCommunityEdit from "./pages/AutCommunity/AutNova";
import AutProfileEdit from "./pages/AutHolder/AutLeft/AutProfileEdit";
import { WagmiConfig } from "wagmi";
import { generateNetworkConfig } from "@api/ProviderFactory/setup.config";

function App() {
  const dispatch = useAppDispatch();
  const [appLoading, setAppLoading] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const canUpdateProfile = useSelector(CanUpdateProfile);

  useEffect(() => {
    getAppConfig()
      .then(async (res) => {
        dispatch(setNetworks(res));
        const [network] = res.filter((d) => !d.disabled);
        setConfig(generateNetworkConfig(network));
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
        <WagmiConfig config={config}>
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
                  <Route
                    path="/:holderAddress/edit-community/:communityAddress"
                    element={<AutCommunityEdit />}
                  />
                  <Route
                    path="/:holderAddress/edit-profile"
                    element={<AutProfileEdit />}
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            )}
          </Box>
        </WagmiConfig>
      )}
    </>
  );
}

export default App;
