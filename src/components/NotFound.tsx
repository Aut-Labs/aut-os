import { Box, Typography } from "@mui/material";

function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        transform: "translate(-50%, -50%)",
        left: "50%",
        top: "50%"
      }}
    >
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: "10px",
          fontSize: "70px",
          color: "white"
        }}
      >
        404.
      </Typography>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: "70px",
          color: "white"
        }}
        variant="subtitle2"
      >
        This page could not be found
      </Typography>
    </Box>
  );
}

export default NotFound;
