import { useEffect, useState } from 'react';
import { withRouter, Switch, Route, Redirect as RedirectRoute, useLocation, useHistory, useParams } from 'react-router-dom';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { useAppDispatch } from '@store/store.model';
import { ReactComponent as AutLogo } from '@assets/AutLogo.svg';
import NotFound from '@components/NotFound';
import { ResultState } from '@store/result-status';
import { updateHolderState } from '@store/holder/holder.reducer';
import { resetAuthState, setAuthenticated } from '@auth/auth.reducer';
import { Init } from 'd-aut-alpha';
import { fetchHolderEthEns } from '@api/holder.api';
import { pxToRem } from '@utils/text-size';
import { AutID } from '@api/aut.model';
import AutHolder from './pages/AutHolder/AutHolder';
import SWSnackbar from './components/snackbar';
import './App.scss';
// eslint-disable-next-line import/order
import { ethers, providers } from 'ethers';
import AutSearch from './pages/AutHome/AutSearch';

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
      autID.properties.address = window.ethereum.selectedAddress;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { name } = await provider.getNetwork();
      const network = name === 'maticmum' ? 'mumbai' : name === 'goerli' ? 'goerli' : '';
      const ethDomain = await fetchHolderEthEns(autID.properties.address);
      autID.properties.ethDomain = ethDomain;
      console.log(autID, 'autid');
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
  }, [dispatch, history, location.pathname, location.state?.from]);

  return (
    <>
      <div id="app" />
      <CssBaseline />
      <SWSnackbar />
      <Box
        sx={{
          backgroundColor: '#000',
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
