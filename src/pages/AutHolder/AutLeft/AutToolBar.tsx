import MyAutIDLogo from '@assets/MyAutIdLogo';
import { AppBar, styled, Toolbar } from '@mui/material';
import { pxToRem } from '@utils/text-size';

const AutBar = styled(Toolbar)(({ theme }) => ({
  '&.MuiToolbar-root': {
    paddingLeft: pxToRem(100),
    paddingRight: pxToRem(100),
    paddingTop: pxToRem(30),
    justifyContent: 'space-between',
  },
}));

const AutToolBar = () => {
  return (
    <>
      <AutBar>
        <MyAutIDLogo />
        <d-aut id="d-aut" community-address="0x89fdb37aB5bf8E81c6b049b635244B8A58d5363c" use-dev="true" />
      </AutBar>
    </>
  );
};

export default AutToolBar;
