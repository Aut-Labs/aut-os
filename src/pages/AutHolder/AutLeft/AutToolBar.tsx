import { ReactComponent as MyAutIDLogo } from '@assets/MyAutIdLogo.svg';
import { AppBar, styled, Toolbar } from '@mui/material';
import { pxToRem } from '@utils/text-size';

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
  return (
    <>
      <AutBar>
        {!hideLogo && <MyAutIDLogo />}
        {!hideWebComponent && <d-aut id="d-aut" use-dev="true" />}
      </AutBar>
    </>
  );
};

export default AutToolBar;
