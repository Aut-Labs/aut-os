import { CanUpdateProfile } from "@auth/auth.reducer";
import { Box, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import MapPlaceholder from "@assets/autos/map-placeholder.png";
import InteractionMap from "@components/InteractionMap";
import { useRef } from "react";

const AutMap = ({ communities = [] }) => {
  const theme = useTheme();
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const ref = useRef();
  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: "100%",
        height: "800px", // Assign a height to the container so that it can be defined
        overflow: "hidden",
        marginTop: theme.spacing(4)
      }}
    >
      <InteractionMap parentRef={ref} />
    </Box>
  );
};

export default AutMap;
