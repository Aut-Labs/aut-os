import { useEffect, useState } from 'react';
import { withRouter, Switch, Route, Redirect as RedirectRoute, useLocation, useHistory, useParams } from 'react-router-dom';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { useAppDispatch } from '@store/store.model';
import { ReactComponent as AutLogo } from '@assets/AutLogo.svg';
import { useSelector } from 'react-redux';
import { ConnectorTypes } from '@api/ProviderFactory/components/ConnectorBtn';
import { metaMaskConnector, walletConnectConnector } from '@api/ProviderFactory/web3.connectors';
import { SelectedNetworkConfig } from '@store/WalletProvider/WalletProvider';
import NotFound from '@components/NotFound';
import Web3NetworkProvider from '@api/ProviderFactory/components/Web3NetworkProvider';
import { ResultState } from '@store/result-status';
import { updateHolderState } from '@store/holder/holder.reducer';
import { resetAuthState, setAuthenticated } from '@auth/auth.reducer';
import { Init } from '@aut-protocol/d-aut';
import { fetchHolderEthEns } from '@api/holder.api';
import { useWeb3React } from '@web3-react/core';
import { pxToRem } from '@utils/text-size';
import { AutID } from '@api/aut.model';
import AutSearch from './pages/AutHome/AutSearch';
import AutHolder from './pages/AutHolder/AutHolder';
import SWSnackbar from './components/snackbar';
import './App.scss';

const wallets = {
  [ConnectorTypes.Metamask]: metaMaskConnector,
  [ConnectorTypes.WalletConnect]: walletConnectConnector,
};

const LoadingMessage = () => (
  <div className="app-loading">
    <AutLogo width="80" height="80" />
  </div>
);

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation<any>();
  const history = useHistory();
  const desktop = useMediaQuery('(min-width:1024px)');
  const networkConfig = useSelector(SelectedNetworkConfig);
  const [lastChainId, setLastChainId] = useState<number>(null);
  const { account } = useWeb3React();

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const [, network, holderAddress] = location.pathname.split('/');
    if (holderAddress && network) {
      history.push(`/${network}/${holderAddress}`);
    } else {
      history.push(`/`);
    }
    dispatch(resetAuthState());
  }, []);

  useEffect(() => {
    const onAutLogin = async ({ detail }: any) => {
      const autID = new AutID(detail);
      autID.properties.communities = autID.properties.communities.filter((c) => {
        return c.properties.userData?.isActive;
      });
      autID.properties.address = account;
      const ethDomain = await fetchHolderEthEns(autID.properties.address);
      autID.properties.ethDomain = ethDomain;
      await dispatch(
        setAuthenticated({
          isAuthenticated: true,
          userInfo: autID,
        })
      );
      await dispatch(
        updateHolderState({
          autID,
          fetchStatus: ResultState.Success,
          status: ResultState.Idle,
        })
      );

      const [connector] = wallets[sessionStorage.getItem('provider') || ConnectorTypes.Metamask];
      await connector.activate(+networkConfig.network.chainId);
      setLastChainId(+networkConfig.network.chainId);
      const network = networkConfig?.network?.name.toLowerCase();
      // TODO: figure out how network comes in the autID
      if (autID?.name && network) {
        history.push(`/${network}/${autID.name}`);
      } else {
        history.push(`/`);
      }
      history.push(`/${network}/${autID.name}`);
    };

    const onDisconnected = () => {
      const [, network, holderAddress] = location.pathname.split('/');
      if (holderAddress && network) {
        history.push(`/${network}/${holderAddress}`);
      } else {
        history.push(`/`);
      }
      dispatch(resetAuthState());
    };

    const onAutInit = async () => setLoading(false);

    window.addEventListener('aut-Init', onAutInit);
    window.addEventListener('aut-onConnected', onAutLogin);
    window.addEventListener('aut-onDisconnected', onDisconnected);

    Init({
      container: document.querySelector('#connect-wallet-container'),
    });

    return () => {
      window.removeEventListener('aut-Init', onAutInit);
      window.removeEventListener('aut-onConnected', onAutLogin);
      window.removeEventListener('aut-onDisconnected', onAutLogin);
    };
  }, [dispatch, history, location.pathname, location.state?.from, networkConfig]);

  return (
    <>
      <Web3NetworkProvider lastChainId={lastChainId} />
      <div id="app" />
      <CssBaseline />
      <SWSnackbar />
      <Box
        sx={{
          // backgroundColor: '#141414',
          // height: '100vh',
          // ...(desktop && {
          //   height: `calc(100vh - ${pxToRem(30)} - 50px)`,
          // }),
          ...(!desktop && {
            height: `calc(100% - ${pxToRem(120)})`,
          }),
        }}
        className={isLoading ? 'sw-loading' : ''}
      >
        {isLoading ? (
          <LoadingMessage />
        ) : (
          <Switch>
            <Route exact component={AutSearch} path="/" />
            <Route component={AutHolder} path="/:network/:holderAddress" />
            <Route component={NotFound} /> : <RedirectRoute to={{ pathname: '/', state: { from: location.pathname } }} />
          </Switch>
        )}
      </Box>
    </>
  );
}

export default withRouter(App);
