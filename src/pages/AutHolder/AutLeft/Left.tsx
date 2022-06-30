/* eslint-disable react/button-has-type */
import NotFound from '@components/NotFound';
import { styled } from '@mui/material';
import { BrowserRouter, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import AutCommunityEdit from './AutCommunityEdit';
import AutProfileEdit from './AutProfileEdit';
import AutToolBar from './AutToolBar';
import AutUserInfo from './AutUserInfo';

const AutLeftContainer = styled('div')(({ theme }) => ({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
}));

class DebugRouter extends BrowserRouter {
  history: any;

  constructor(props) {
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null, 2));
    this.history.listen((location, action) => {
      console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`);
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null, 2));
    });
  }
}

const AutLeft = ({ match }) => {
  const { pathname } = useLocation();
  const params = useParams<any>();
  const history = useHistory();
  const { url } = useRouteMatch();
  console.log(pathname, history, url, 'PATH', params);
  console.log(match.path, ' MATCH PATH');

  return (
    <AutLeftContainer>
      <>
        <AutToolBar />
      </>

      <Switch>
        <Route exact path={`${match.path}`} component={AutUserInfo} />
        <Route exact path={`${match.path}/edit-community`} component={AutCommunityEdit} />
        <Route exact path={`${match.path}/edit-profile`} render={(props) => <AutProfileEdit {...props} />} />
        {/* <Route path="/holders/:holders-adress/edit-profile" component={AutProfileEdit} /> */}
        {/* <Route component={NotFound} /> */}
      </Switch>
    </AutLeftContainer>
  );
};

export default AutLeft;
