import { Box, styled } from "@mui/material";
import { pxToRem } from "@utils/text-size";

const TopWrapper = styled(Box)(({ theme }) => ({
  paddingBottom: pxToRem(80),
  [theme.breakpoints.down("lg")]: {
    paddingBottom: pxToRem(50)
  },
  [theme.breakpoints.down("sm")]: {
    paddingBottom: pxToRem(30)
  }
}));

const BottomWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(4),
  justifyContent: "space-between",
  maxWidth: "600px",
  display: "flex"
  // [theme.breakpoints.down("lg")]: {
  //   maxWidth: "unset"
  // }
}));

const FormWrapper = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  paddingTop: theme.spacing(4),
  paddingLeft: theme.spacing(8),
  paddingRight: theme.spacing(8),
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  [theme.breakpoints.down("md")]: {
    width: `calc(100% - 100px)`
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: "30px",
    paddingLeft: "10px",
    paddingRight: "10px",
    width: `calc(100% - 20px)`
  }
}));

const ContentWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  paddingTop: theme.spacing(8),
  paddingLeft: theme.spacing(8),
  paddingRight: theme.spacing(8),
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  [theme.breakpoints.down("md")]: {
    width: `calc(100% - 100px)`
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: "30px",
    paddingLeft: "10px",
    paddingRight: "10px",
    width: `calc(100% - 20px)`
  }
}));

const FieldWrapper = styled("div")(({ theme }) => ({
  flexDirection: "row",
  marginBottom: "20px",
  // minHeight: "70px",
  display: "flex",
  width: "100%",
  justifyContent: "flex-start",
  alignItems: "flex-start"
  // [theme.breakpoints.down("lg")]: {
  //   justifyContent: "center",
  //   alignItems: "center"
  // },
  // [theme.breakpoints.down("sm")]: {
  //   justifyContent: "flex-start",
  //   alignItems: "flex-start"
  //   // paddingLeft: "30px"
  // }
}));

export const EditContentElements = {
  FieldWrapper,
  FormWrapper,
  BottomWrapper,
  TopWrapper,
  ContentWrapper
};
