/* eslint-disable max-len */
import { CanUpdateProfile } from "@auth/auth.reducer";
import { Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import InteractionMap from "@components/InteractionMap";
import { useRef } from "react";
import { AutOsButton } from "@components/AutButton";
import { useAppDispatch } from "@store/store.model";
import { setOpenInteractions } from "@store/ui-reducer";
import { AutInteractionsDialog } from "@components/AutInteractionsDialog";

const AutMap = ({ communities = [] }) => {
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const ref = useRef();
  return (
    <>
      {!canUpdateProfile && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gridGap: "12px",
            textAlign: "center",
            position: "absolute",
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
            zIndex: 99,
            background: "rgba(87, 97, 118, 0.3)",
            borderRadius: "42px"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M32.0013 34.6667C39.3651 34.6667 45.3346 28.6971 45.3346 21.3333C45.3346 13.9695 39.3651 8 32.0013 8C24.6375 8 18.668 13.9695 18.668 21.3333C18.668 28.6971 24.6375 34.6667 32.0013 34.6667Z"
              stroke="#717BBC"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M53.3346 56C53.3346 50.342 51.087 44.9158 47.0862 40.915C43.0855 36.9142 37.6593 34.6666 32.0013 34.6666C26.3434 34.6666 20.9171 36.9142 16.9164 40.915C12.9156 44.9158 10.668 50.342 10.668 56"
              stroke="#717BBC"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <Typography
            color="white"
            fontWeight="700"
            fontSize="16px"
            lineHeight="26px"
          >
            Connect with this user to see their <br /> map of connections
          </Typography>
          <AutOsButton
            type="button"
            color="primary"
            size="small"
            variant="outlined"
          >
            <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
              Create a Link
            </Typography>
          </AutOsButton>
        </Box>
      )}
      <Box
        ref={ref}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          height: "100%",
          // overflow: "hidden",
          ...(!canUpdateProfile && {
            // borderBottomRightRadius: "72px",
            // borderBottomLeftRadius: "72px",
            mixBlendMode: "plus-lighter",
            // background: "lightgray 0% / cover no-repeat",
            opacity: 0.6,
            filter: "blur(20px)"
          })
        }}
      >
        <InteractionMap isActive={canUpdateProfile} parentRef={ref} />
      </Box>
    </>
  );
};

export default AutMap;
