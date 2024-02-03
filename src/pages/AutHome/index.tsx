import React, { memo } from "react";
import AutToolBar from "../AutHolder/AutLeft/AutToolBar";
import MainBackground from "src/MainBackground";
import AutSearch from "./AutSearch";
import { Box, styled } from "@mui/material";

const AutBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  alignItems: "center",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  left: "50%",
  top: "50%",
  [theme.breakpoints.down("xl")]: {
    justifyContent: "center"
  },

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center"
  }
}));

const AutHome = () => {
  const [dimensions, setDimensions] = React.useState({
    width: 0,
    height: 0
  });

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <AutToolBar></AutToolBar>
      <MainBackground dimensions={dimensions}></MainBackground>
      <AutBox
        sx={{
          position: "fixed",
          width: "520px",
          height: "200px"
        }}
      >
        <AutSearch />
      </AutBox>
    </>
  );
};

export default memo(AutHome);
