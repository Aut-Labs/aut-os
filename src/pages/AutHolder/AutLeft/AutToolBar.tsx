import { DautPlaceholder } from "@api/ProviderFactory/web3-daut-connect";
import { Box, Toolbar, styled } from "@mui/material";
import { useAppDispatch } from "@store/store.model";
import { setOpenShare } from "@store/ui-reducer";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as AutOsLogo } from "@assets/autos/os-logo.svg";
import AutSearch from "src/pages/AutHome/AutSearch";

const AutToolBar = ({ isDesktop = false, hideSearch = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  function goHome() {
    const params = new URLSearchParams(location.search);
    params.delete("network");
    navigate({
      pathname: `/`,
      search: `?${params.toString()}`
    });
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "20px"
        }}
      >
        {!hideSearch && <AutSearch mode="simple" />}
        <DautPlaceholder></DautPlaceholder>
      </Box>
    </Toolbar>
  );
};

export default AutToolBar;
