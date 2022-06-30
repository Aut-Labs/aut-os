/* eslint-disable react/button-has-type */
import { IsAuthenticated } from '@auth/auth.reducer';
import AutLoading from '@components/AutLoading';
import { styled } from '@mui/material';
import { HolderStatus } from '@store/holder/holder.reducer';
import { ResultState } from '@store/result-status';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AutCommunityEdit from './AutCommunityEdit';
import AutProfileEdit from './AutProfileEdit';
import AutToolBar from './AutToolBar';
import AutUserInfo from './AutUserInfo';

const AutLeftContainer = styled('div')(({ theme }) => ({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
}));

const AutLeft = ({ match }) => {
  const status = useSelector(HolderStatus);
  const isAuthenticated = useSelector(IsAuthenticated);
  return (
    <AutLeftContainer>
      <>
        <AutToolBar />
      </>

      {status === ResultState.Loading || status === ResultState.Idle ? (
        <AutLoading />
      ) : (
        <Switch>
          <Route exact path={`${match.path}`} component={AutUserInfo} />
          {isAuthenticated && (
            <>
              <Route exact path={`${match.path}/edit-community/:communityAddress`} component={AutCommunityEdit} />
              <Route exact path={`${match.path}/edit-profile`} render={(props) => <AutProfileEdit {...props} />} />
            </>
          )}
        </Switch>
      )}
    </AutLeftContainer>
  );
};

export default AutLeft;
