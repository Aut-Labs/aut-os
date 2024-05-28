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
        zIndex: 5,
        boxShadow: {
          xs: 4,
          sm: 0
        },
        paddingLeft: {
          xs: 4,
          md: 8
        },
        paddingRight: {
          xs: 4,
          md: 8
        },
        height: {
          xs: "130px",
          sm: "84px"
        },
        minHeight: {
          xs: "130px",
          sm: "84px"
        },
        flexDirection: {
          xs: "column",
          sm: "row"
        },
        justifyContent: {
          xs: "flex-start",
          sm: "space-between"
        },
        alignItems: "center"
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
