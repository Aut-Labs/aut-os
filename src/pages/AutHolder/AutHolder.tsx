import { HolderStatus, HolderData } from "@store/holder/holder.reducer";
import { ResultState } from "@store/result-status";
import { useAppDispatch } from "@store/store.model";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { AutShareDialog } from "@components/AutShare";
import { setOpenShare } from "@store/ui-reducer";
import AutLeft from "./AutLeft/Left";
import AutTunnelRight from "./AutRight/Right";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { DautPlaceholder } from "@api/ProviderFactory/components/web3-daut-connect";
import { useNavigate } from "react-router-dom";

const AutContainer = styled("div")(() => ({
  display: "flex",
  height: "100%"
}));
const AutSwiper = styled(Swiper)(({ theme }) => ({
  height: "100%",
  ".swiper-pagination-bullet": {
    backgroundColor: theme.palette.background.paper
  }
}));

const AutHolder = (props) => {
  const dispatch = useAppDispatch();
  const { openShare } = useSelector((state: any) => state.ui);
  const status = useSelector(HolderStatus);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const holderData = useSelector(HolderData);
  const navigate = useNavigate();

  const handleClose = () => {
    dispatch(setOpenShare(false));
  };

  const url = `https://my.aut.id/${holderData?.name}`;

  return (
    <>
      <AutShareDialog
        open={openShare}
        url={url}
        hideCloseBtn={false}
        title="Show off your ĀutID  🙌"
        description={
          <>
            Hello, friend 🖖
            <br />
            <br />
            This is my ĀutID - and it’s the first identity I can truly own.
            <br />
            I will shape it, and it will grow with me & the Communities I commit
            to.
            <br />
            <br />
            Follow my journey - and see you on the āuter space 🪐
            <br />
            {url}
          </>
        }
        twitterProps={{
          // eslint-disable-next-line max-len
          title: `Hello, friend 🖖 This is my ĀutID - and it’s the first identity I can truly own. I will shape it, and it will grow with me & the Communities I commit to. Follow my journey - and see you on the āuter space 🪐`,
          hashtags: ["Aut", "DAO", "Blockchain"]
        }}
        linkedinProps={{
          // eslint-disable-next-line max-len
          summary: `Hello, friend 🖖 This is my ĀutID - and it’s the first identity I can truly own. I will shape it, and it will grow with me & the Communities I commit to. Follow my journey - and see you on the āuter space 🪐`,
          title: "My ĀutID"
        }}
        telegramProps={{
          // eslint-disable-next-line max-len
          title: `Hello, friend 🖖 This is my ĀutID - and it’s the first identity I can truly own. I will shape it, and it will grow with me & the Communities I commit to. Follow my journey - and see you on the āuter space 🪐`
        }}
        onClose={handleClose}
      />

      {!holderData && status === ResultState.Success ? (
        <Box
          sx={{
            height: "100%"
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <Typography color="white" variant="h2">
              ĀutID not found
            </Typography>
            <Button
              variant="outlined"
              size="normal"
              color="offWhite"
              onClick={() => navigate("/")}
              sx={{
                mt: 4
              }}
            >
              Home
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {desktop ? (
            <AutContainer>
              <AutLeft {...props} />
              {status === ResultState.Success && <AutTunnelRight />}
            </AutContainer>
          ) : (
            <>
              <AutSwiper
                direction="horizontal"
                slidesPerView={1}
                spaceBetween={30}
                mousewheel
                pagination={{
                  clickable: true
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {status === ResultState.Success && (
                  <SwiperSlide>
                    <AutTunnelRight />
                  </SwiperSlide>
                )}
                <SwiperSlide>
                  <AutLeft />
                </SwiperSlide>
              </AutSwiper>
              <Toolbar
                sx={{
                  width: "100%",
                  backgroundColor: "nightBlack.main",
                  boxShadow: 0,
                  "&.MuiToolbar-root": {
                    paddingLeft: 6,
                    paddingRight: 6,
                    minHeight: "84px",
                    bottom: "35px",
                    position: "fixed",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }
                }}
              >
                <DautPlaceholder />
              </Toolbar>
            </>
          )}
        </>
      )}
    </>
  );
};

export default AutHolder;
