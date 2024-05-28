import {
  Box,
  CardMedia,
  styled,
  Toolbar,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useSelector } from "react-redux";
import { HolderData } from "@store/holder/holder.reducer";
import { useAppDispatch } from "@store/store.model";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { DautPlaceholder } from "@api/ProviderFactory/web3-daut-connect";
import AutToolBar from "../AutLeft/AutToolBar";

const CardZoom = styled<any>(CardMedia)(({ theme }) => ({
  borderRadius: 0,
  "@keyframes zoom-in-zoom-out": {
    "0%": {
      transform: "scale(1, 1)"
    },
    "10%": {
      transform: "scale(1.025, 1.025)"
    },
    "20%": {
      transform: "scale(1, 1)"
    },
    "100%": {
      transform: "scale(1, 1)"
    }
  },
  animation: `zoom-in-zoom-out 12s linear infinite`,
  animationDirection: "normal",
  animationDelay: "6s",

  [theme.breakpoints.down("md")]: {
    // width: "100%",
    // height: "100%",
    // margin: "10px"
  }
}));

const CardBack = styled("div")(({ theme }) => ({
  borderRadius: 0,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  position: "relative",
  width: "calc(100% - 40px)",
  height: "calc(100% - 40px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignContent: "center",
  // backgroundColor: '#141414',

  [theme.breakpoints.down("md")]: {
    width: "100%",
    height: "100%"
  }
}));

const AutRightContainer = styled("div")(() => ({
  width: "40%"
}));
const AutRightMobileContainer = styled("div")(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column"
}));

const AutIdCard = ({ avatar }) => {
  return (
    <CardZoom xmlns="http://www.w3.org/1999/xhtml" src={avatar}>
      {/* <img
        alt="id"
        style={{
          width: '100%',
          height: '100%',
        }}
        src={avatar}
      /> */}
    </CardZoom>
  );
};

const AutTunnelRight = () => {
  const holderData = useSelector(HolderData);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      {desktop ? (
        <AutRightContainer
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%"
          }}
        >
          <Toolbar
            sx={{
              width: "100%",
              boxShadow: 2,
              "&.MuiToolbar-root": {
                width: "100%",
                paddingLeft: 6,
                paddingRight: 6,
                minHeight: "84px",
                justifyContent: "flex-end",
                alignItems: "center"
              }
            }}
          >
            <DautPlaceholder />
          </Toolbar>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CardZoom
              component="img"
              sx={{
                width: {
                  xs: "300px",
                  xxl: "400px"
                }
              }}
              src={ipfsCIDToHttpUrl(holderData?.image as string)}
            />
          </Box>
        </AutRightContainer>
      ) : (
        <AutRightMobileContainer>
          <AutToolBar />
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <CardZoom
              component="img"
              sx={{
                width: {
                  xs: "unset",
                  md: "300px"
                },
                maxWidth: {
                  xs: "300px"
                },
                maxHeight: {
                  xs: "calc(100vh - 220px)",
                  md: "unset"
                },
                mb: "100px",
                mr: "15px"
              }}
              src={ipfsCIDToHttpUrl(holderData?.image as string)}
            />
            <Toolbar
              sx={{
                boxShadow: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                "&.MuiToolbar-root": {
                  position: "fixed",
                  bottom: "35px",
                  minHeight: "84px",
                  justifyContent: "center",
                  alignItems: "center"
                }
              }}
            >
              <DautPlaceholder />
            </Toolbar>
          </Box>
        </AutRightMobileContainer>
      )}
    </>
  );
};

export default AutTunnelRight;
