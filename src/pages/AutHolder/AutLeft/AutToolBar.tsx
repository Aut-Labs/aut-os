import { ReactComponent as MyAutIDLogo } from '@assets/MyAutIdLogo.svg';
import { DautPlaceholder } from '@components/DautPlaceholder';
import { styled, Toolbar, useMediaQuery } from '@mui/material';
import { HolderStatus } from '@store/holder/holder.reducer';
import { ResultState } from '@store/result-status';
import { resetSearchState } from '@store/search/search.reducer';
import { useAppDispatch } from '@store/store.model';
import { pxToRem } from '@utils/text-size';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

const AutBar = styled(Toolbar)(({ theme }) => ({
  '&.MuiToolbar-root': {
    paddingLeft: pxToRem(80),
    paddingRight: pxToRem(80),
    justifyContent: 'space-between',

    '@media(max-width: 1024px)': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
}));

const AutToolBar = ({ isDesktop = false }) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const status = useSelector(HolderStatus);

  function goHome() {
    const params = new URLSearchParams(location.search);
    params.delete('network');
    history.push({
      pathname: `/`,
      search: `?${params.toString()}`,
    });
    dispatch(resetSearchState());
  }
  return (
    <AutBar>
      <MyAutIDLogo height="90" style={{ cursor: 'pointer' }} onClick={() => goHome()} />
      {isDesktop && <DautPlaceholder hide={status === ResultState.Loading} />}
    </AutBar>
  );
};

export default AutToolBar;
