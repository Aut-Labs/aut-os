import { CanUpdateProfile } from "@auth/auth.reducer";
import { Box, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import MapPlaceholder from "@assets/autos/map-placeholder.png";

const AutMap = ({ communities = [] }) => {
  const theme = useTheme();
  const canUpdateProfile = useSelector(CanUpdateProfile);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: theme.spacing(4)
      }}
    >
      <img src={MapPlaceholder} height="50%" width="50%"></img>
    </Box>
  );
};

export default AutMap;
