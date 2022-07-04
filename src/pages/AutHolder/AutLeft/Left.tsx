/* eslint-disable react/button-has-type */
import { IsAuthenticated } from '@auth/auth.reducer';
import AutLoading from '@components/AutLoading';
import NotFound from '@components/NotFound';
import { styled, useMediaQuery } from '@mui/material';
import { BrowserRouter, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import Scrollbar from '@components/Scrollbar';
import { HolderStatus } from '@store/holder/holder.reducer';
import { ResultState } from '@store/result-status';
import { useSelector } from 'react-redux';
import { SwScrollbar } from 'sw-web-shared';
import AutCommunityEdit from './AutCommunityEdit';
import AutProfileEdit from './AutProfileEdit';
import AutToolBar from './AutToolBar';
import AutUserInfo from './AutUserInfo';

const AutLeftContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

const AutLeft = ({ match }) => {
  const status = useSelector(HolderStatus);
  const isAuthenticated = useSelector(IsAuthenticated);
  const { pathname } = useLocation();
  const params = useParams<any>();
  const history = useHistory();
  const { url } = useRouteMatch();
  console.log(pathname, history, url, 'PATH', params);
  console.log(match.path, ' MATCH PATH');
  const desktop = useMediaQuery('(min-width:769px)');

  return (
    <AutLeftContainer style={{ width: desktop && status === ResultState.Success ? '50%' : '100%', height: '100%' }}>
      <>
        <AutToolBar hideWebComponent={!desktop} />
      </>

      {status === ResultState.Loading || status === ResultState.Idle ? (
        <AutLoading />
      ) : (
        <>
          <Scrollbar>
            <Switch>
              <Route exact path={`${match.path}`} component={AutUserInfo} />
              {isAuthenticated && (
                <>
                  <Route exact path={`${match.path}/edit-community/:communityAddress`} component={AutCommunityEdit} />
                  <Route exact path={`${match.path}/edit-profile`} render={(props) => <AutProfileEdit {...props} />} />
                </>
              )}
            </Switch>
          </Scrollbar>
        </>
      )}
    </AutLeftContainer>
  );
};

export default AutLeft;
