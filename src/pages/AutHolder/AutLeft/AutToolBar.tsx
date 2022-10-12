import { ReactComponent as MyAutIDLogo } from '@assets/MyAutIdLogo.svg';
import { DAOExpanderABI } from '@aut-protocol/abi-types';
import { AppBar, styled, Toolbar } from '@mui/material';
import { resetSearchState } from '@store/search/search.reducer';
import { useAppDispatch } from '@store/store.model';
import { pxToRem } from '@utils/text-size';
import { useHistory, useLocation, useParams } from 'react-router-dom';

const AutBar = styled(Toolbar)(({ theme }) => ({
  '&.MuiToolbar-root': {
    paddingLeft: pxToRem(100),
    paddingRight: pxToRem(100),
    paddingTop: pxToRem(30),
    justifyContent: 'space-between',

    '@media(max-width: 1024px)': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
}));

const AutToolBar = ({ hideWebComponent = false, hideLogo = false }) => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams<any>();
  const dispatch = useAppDispatch();

  function goHome() {
    history.push({
      pathname: `/`,
      search: location.search,
    });
    dispatch(resetSearchState());
  }
  return (
    <>
      <AutBar>
        {!hideLogo && <MyAutIDLogo style={{ cursor: 'pointer' }} onClick={() => goHome()} />}
        {!hideWebComponent && <d-aut id="d-aut" button-type="simple" network={params.network} />}
      </AutBar>
    </>
  );
};

export default AutToolBar;
