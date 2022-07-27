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
    const [, holderAddress] = location.pathname.split('/');
    if (holderAddress) {
      history.push(`/${holderAddress}`);
    } else {
      history.push(`/`);
    }
    dispatch(resetAuthState());
  }, []);

  useEffect(() => {
    const onSWLogin = async ({ detail }: any) => {
      const autID = new AutID(detail);
      autID.properties.communities = autID.properties.communities.filter((c) => {
        return c.properties.userData?.isActive;
      });
      autID.properties.address = window.ethereum.selectedAddress;
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
      history.push(`/${autID.name}`);
    };

    const onDisconnected = () => {
      const [, holderAddress] = location.pathname.split('/');
      if (holderAddress) {
        history.push(`/${holderAddress}`);
      } else {
        history.push(`/`);
      }
      dispatch(resetAuthState());
    };

    const onSWInit = async () => setLoading(false);

    window.addEventListener('aut-Init', onSWInit);
    window.addEventListener('aut-onConnected', onSWLogin);
    window.addEventListener('aut-onDisconnected', onDisconnected);

    Init({
      container: document.querySelector('#connect-wallet-container'),
    });

    return () => {
      window.removeEventListener('aut-Init', onSWInit);
      window.removeEventListener('aut-onConnected', onSWLogin);
      window.removeEventListener('aut-onDisconnected', onSWLogin);
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
            <Route component={AutHolder} path="/:holderAddress" />
            <Route component={NotFound} /> : <RedirectRoute to={{ pathname: '/', state: { from: location.pathname } }} />
          </Switch>
        )}
      </Box>
    </>
  );
}

export default withRouter(App);
