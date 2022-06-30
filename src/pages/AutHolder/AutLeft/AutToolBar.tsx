import MyAutIDLogo from '@assets/MyAutIdLogo';
import { AppBar, styled, Toolbar } from '@mui/material';
import { pxToRem } from '@utils/text-size';

const AutBar = styled(Toolbar)(({ theme }) => ({
  '&.MuiToolbar-root': {
    paddingLeft: pxToRem(100),
    paddingRight: pxToRem(100),
    paddingTop: pxToRem(30),
  },
}));

const AutToolBar = () => {
  return (
    <>
      <AutBar>
        <MyAutIDLogo />
      </AutBar>
    </>
  );
};

export default AutToolBar;
