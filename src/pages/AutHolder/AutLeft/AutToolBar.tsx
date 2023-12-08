import { DautPlaceholder } from "@api/ProviderFactory/components/web3-daut-connect";
import { ReactComponent as MyAutIDLogo } from "@assets/MyAutIdLogoToolbarPath.svg";
import { CanUpdateProfile } from "@auth/auth.reducer";
import { Toolbar } from "@mui/material";
import { HolderStatus } from "@store/holder/holder.reducer";
import { resetSearchState } from "@store/search/search.reducer";
import { useAppDispatch } from "@store/store.model";
import { setOpenShare } from "@store/ui-reducer";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as AutOsLogo } from "@assets/autos/os-logo.svg";

const AutToolBar = ({ isDesktop = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const status = useSelector(HolderStatus);
  const canUpdateProfile = useSelector(CanUpdateProfile);

  function goHome() {
    const params = new URLSearchParams(location.search);
    params.delete("network");
    navigate({
      pathname: `/`,
      search: `?${params.toString()}`
    });
    dispatch(resetSearchState());
  }

  const handleClickOpen = () => {
    dispatch(setOpenShare(true));
  };

  return (
    <Toolbar
      sx={{
        width: "100%",
        position: "fixed",
        "&.MuiToolbar-root": {
          zIndex: 5,
          paddingLeft: {
            _: 4,
            md: 8
          },
          paddingRight: {
            _: 4,
            md: 8
          },
          minHeight: "84px",
          justifyContent: {
            xs: "space-between",
            sm: "space-between"
          },
          alignItems: "center"
        }
      }}
    >
      <AutOsLogo
        height="62"
        style={{ cursor: "pointer" }}
        onClick={() => goHome()}
      ></AutOsLogo>
      <DautPlaceholder></DautPlaceholder>
    </Toolbar>
  );
};

export default AutToolBar;
