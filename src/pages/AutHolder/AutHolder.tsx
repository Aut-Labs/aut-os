import { HolderStatus, HolderData } from "@store/holder/holder.reducer";
import { ResultState } from "@store/result-status";
import { useAppDispatch } from "@store/store.model";
import { useSelector } from "react-redux";
import { Box, Button, Typography, styled } from "@mui/material";
import { AutShareDialog } from "@components/AutShare";
import { setOpenShare } from "@store/ui-reducer";
import AutLeft from "./AutLeft/Left";
import { useNavigate } from "react-router-dom";
import backgroundImage from "@assets/autos/background.png";
import { autUrls } from "@utils/aut-urls";

const AutContainer = styled("div")(() => ({
  display: "flex",
  height: "100%",
  backgroundImage: `url(${backgroundImage})`,
  backgroundBlendMode: "hard-light",
  backgroundSize: "cover",
  backgroundRepeat: "repeat-y"
}));

const AutHolder = (props) => {
  const dispatch = useAppDispatch();
  const { openShare } = useSelector((state: any) => state.ui);
  const status = useSelector(HolderStatus);
  const holderData = useSelector(HolderData);
  const navigate = useNavigate();

  const handleClose = () => {
    dispatch(setOpenShare(false));
  };

  return (
    <>
      <AutShareDialog
        open={openShare}
        url={`${autUrls.myAut}/${holderData?.name}`}
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
            {`${autUrls.myAut}/${holderData?.name}`}
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
          <AutContainer>
            <AutLeft {...props} />
          </AutContainer>
          <>
            {/* <AutSwiper
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
            </AutSwiper> */}
          </>
        </>
      )}
    </>
  );
};

export default AutHolder;
