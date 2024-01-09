import { CanUpdateProfile } from "@auth/auth.reducer";
import { Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import MapPlaceholder from "@assets/autos/map-placeholder.png";
import InteractionMap from "@components/InteractionMap";
import { useRef } from "react";
import { AutButton, AutOsButton } from "@components/AutButton";
import { useAppDispatch } from "@store/store.model";
import { setOpenInteractions } from "@store/ui-reducer";
import { AutInteractionsDialog } from "@components/AutInteractionsDialog";

const AutMap = ({ communities = [] }) => {
  const dispatch = useAppDispatch();
  const { openInteractions } = useSelector((state: any) => state.ui);

  const handleClose = () => {
    dispatch(setOpenInteractions(false));
  };

  const openInteractionsModal = () => {
    dispatch(setOpenInteractions(true));
  };
  const theme = useTheme();
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const ref = useRef();
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <AutInteractionsDialog
          open={openInteractions}
          title="Interactions"
          onClose={handleClose}
        />
        <AutOsButton
          onClick={openInteractionsModal}
          type="button"
          color="primary"
          variant="outlined"
          sx={{
            mt: theme.spacing(3)
          }}
        >
          <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
            View Interactions
          </Typography>
        </AutOsButton>
      </Box>
      <Box
        ref={ref}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          height: "100%", // Assign a height to the container so that it can be defined
          overflow: "hidden",
          marginTop: theme.spacing(4)
        }}
      >
        <InteractionMap parentRef={ref} />
      </Box>
    </>
  );
};

export default AutMap;
