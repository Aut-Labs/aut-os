import { useEffect, useState } from 'react';
import { withRouter, Switch, Route, Redirect as RedirectRoute, useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CssBaseline } from '@mui/material';
import { RootState, useAppDispatch } from '@store/store.model';
import { ReactComponent as AutLogo } from '@assets/AutLogo.svg';

import NotFound from '@components/NotFound';
import './App.scss';
import { resetAuthState, setAuthenticated } from '@auth/auth.reducer';
import detectEthereumProvider from '@metamask/detect-provider';
import { openSnackbar } from '@store/ui-reducer';
import { InitSwAuth } from '@skill-wallet/auth';
import { environment } from '@api/environment';
import { pxToRem } from '@utils/text-size';
import AutHolder from './pages/AutHolder/AutHolder';
import Community from './pages/Deprecated/Community/Community';
import SWSnackbar from './components/snackbar';

const LoadingMessage = () => (
  <div className="app-loading">
    <AutLogo width="80" height="80" />
  </div>
);

function App(props) {
  const dispatch = useAppDispatch();
  const location = useLocation<any>();
  const history = useHistory();
  const { isAutheticated } = useSelector((state: RootState) => state.auth);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const checkForEthereumProvider = async () => {
      let ethereum: typeof window.ethereum;
      try {
        ethereum = await detectEthereumProvider();
      } catch (e) {
        console.log(e);
      }
      if (!ethereum) {
        dispatch(
          openSnackbar({
            message: 'Please install MetaMask and refresh the page to use the full array of Partner features.',
            severity: 'error',
            duration: 30000,
          })
        );
      }
    };
    checkForEthereumProvider();
  }, []);

  useEffect(() => {
    const onAutLogin = async ({ detail }: any) => {
      const isLoggedIn = true;
      if (isLoggedIn) {
        dispatch(
          setAuthenticated({
            isAuthenticated: isLoggedIn,
            userInfo: {},
          })
        );
        // get the user address
        const returnUrl = location.state?.from;
        history.push(returnUrl);
      } else {
        dispatch(resetAuthState());
        history.push('/');
      }
    };

    const onAutInit = async () => setLoading(false);
    onAutInit();

    window.addEventListener('initAutAuth', onAutInit);
    window.addEventListener('onAutLogin', onAutLogin);

    InitSwAuth({ container: document.querySelector('#connect-wallet-container') });

    return () => {
      window.removeEventListener('initAutAuth', onAutInit);
      window.removeEventListener('onAutLogin', onAutLogin);
    };
  }, [dispatch, history, location.pathname, location.state?.from]);

  const isIntegrateFlow = location?.pathname?.includes('integrate');
  const isRedirect = location?.pathname?.includes('redirect');
  const isGetStarted = location?.pathname === '/';
  const hideDashboard = !environment.hideDashboard || environment.hideDashboard === 'true';

  return (
    <>
      <div id="app" />
      <CssBaseline />
      <SWSnackbar />
      <Box
        sx={{
          backgroundColor: '#000',
        }}
        className={isLoading ? 'sw-loading' : ''}
      >
        {isLoading ? (
          <LoadingMessage />
        ) : (
          <Switch>
            <Route component={AutHolder} path="/holders/:holderAddress" {...props} />
            <Route exact component={Community} path="/community/:communityAddress" {...props} />
            {isAutheticated ? <Route component={NotFound} /> : <RedirectRoute to={{ pathname: '/', state: { from: location.pathname } }} />}
          </Switch>
        )}
      </Box>
    </>
  );
}

export default withRouter(App);
