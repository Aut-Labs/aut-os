import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { pxToRem } from "@utils/text-size";

export const AutButton = styled<ButtonProps<any, any>>(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    border: `${pxToRem(5)} solid ${theme.palette.primary.main}`,
    borderRadius: "50px",
    textDecoration: "uppercase",
    color: "white",
    letterSpacing: "3px",
    fontSize: "20px",
    "&.Mui-disabled": {
      color: "white",
      opacity: ".3"
    },
    "&:hover": {
      backgroundColor: "#009ADE",
      color: "white"
    }
  }
}));

export const AutButtonVariant = styled<ButtonProps<any, any>>(Button)(
  ({ theme }) => ({
    "&.MuiButton-root": {
      border: `2px solid white`,
      textDecoration: "uppercase",
      color: "white",
      letterSpacing: "3px",
      fontSize: "12px",
      "&.Mui-disabled": {
        color: "white",
        opacity: ".3"
      },
      "&:hover": {
        backgroundColor: "#009ADE",
        color: "white"
      }
    }
  })
);
