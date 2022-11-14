import { useEffect, useState } from "react";
import {
  withRouter,
  Switch,
  Route,
  Redirect as RedirectRoute,
  useLocation
} from "react-router-dom";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { useAppDispatch } from "@store/store.model";
import { setNetworks } from "@store/WalletProvider/WalletProvider";
import NotFound from "@components/NotFound";
import AutLoading from "@components/AutLoading";
import Web3NetworkProvider from "@api/ProviderFactory/components/Web3NetworkProvider";
import { pxToRem } from "@utils/text-size";
import Web3AutProvider from "@api/ProviderFactory/components/Web3Provider";
import Web3DautConnect from "@api/ProviderFactory/components/web3-daut-connect";
import { getAppConfig } from "@api/aut.api";
import AutSearch from "./pages/AutHome/AutSearch";
import AutHolder from "./pages/AutHolder/AutHolder";
import SWSnackbar from "./components/snackbar";
import "./App.scss";
import { environment } from "@api/environment";
import AutSDK from "@aut-protocol/sdk";

function App() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const location = useLocation<any>();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const [appLoading, setAppLoading] = useState(true);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getAppConfig()
      .then(async (res) => {
        dispatch(setNetworks(res));
        const sdk = new AutSDK({
          nftStorageApiKey: environment.nftStorageKey
        });

        console.log(sdk);
      })
      .finally(() => setAppLoading(false));
  }, []);

  return (
    <>
      {appLoading ? (
        <AutLoading />
      ) : (
        <Web3AutProvider>
          <Web3DautConnect setLoading={setLoading} />
          <Web3NetworkProvider />
          <CssBaseline />
          <SWSnackbar />
          <Box
            sx={{
              ...(!desktop && {
                height: `calc(100% - ${pxToRem(120)})`
              })
            }}
            className={isLoading ? "sw-loading" : ""}
          >
            {isLoading ? (
              <AutLoading />
            ) : (
              <Switch>
                <Route
                  exact
                  render={(props) => <AutSearch {...props} />}
                  path="/"
                />
                <Route component={AutHolder} path="/:holderAddress" />
                <Route component={NotFound} /> :{" "}
                <RedirectRoute
                  to={{ pathname: "/", state: { from: location.pathname } }}
                />
              </Switch>
            )}
          </Box>
        </Web3AutProvider>
      )}
    </>
  );
}

export default withRouter(App);
