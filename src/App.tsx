import { useState } from 'react';
import { withRouter, Switch, Route, Redirect as RedirectRoute, useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CssBaseline } from '@mui/material';
import { RootState, useAppDispatch } from '@store/store.model';
import NotFound from '@components/NotFound';
import SWSnackbar from './components/snackbar';
import './App.scss';
import EmptyPage from './pages/EmptyPage/EmptyPage';
import Holder from './pages/Holder/Holder';
import Community from './pages/Community/Community';

function App(props) {
  const dispatch = useAppDispatch();
  const location = useLocation<any>();
  const history = useHistory();
  const { isAutheticated } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <div id="app" />
      <CssBaseline />
      <SWSnackbar />
      <Box
        sx={{
          height: '100%',
        }}
      >
        <Switch>
          <Route exact component={EmptyPage} path="/" {...props} />
          <Route exact component={Holder} path="/:holderAddress" {...props} />
          <Route exact component={Community} path="/community/:communityAddress" {...props} />
          {isAutheticated ? <Route component={NotFound} /> : <RedirectRoute to={{ pathname: '/', state: { from: location.pathname } }} />}
        </Switch>
      </Box>
    </>
  );
}

export default withRouter(App);
