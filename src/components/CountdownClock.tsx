import { Typography, styled } from "@mui/material";
import { memo } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

const Countdown = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "& > DIV > DIV:nth-of-type(even)": {
    marginLeft: "4px",
    marginRight: "4px"
  },
  "& > DIV > DIV:nth-of-type(odd) > DIV:nth-of-type(2)": {
    marginRight: "2px"
  }
});

const CountdownClock = ({ to }: { to: Date }) => {
  return (
    <Countdown>
      <FlipClockCountdown
        digitBlockStyle={{
          fontFamily: "FractulRegular",
          width: "25px",
          height: "25px",
          fontSize: "20px"
        }}
        labelStyle={{
          fontSize: "12px",
          fontFamily: "FractulRegular"
        }}
        separatorStyle={{
          size: "4px"
        }}
        to={to?.toUTCString()}
      />
    </Countdown>
  );
};

export default memo(CountdownClock);
