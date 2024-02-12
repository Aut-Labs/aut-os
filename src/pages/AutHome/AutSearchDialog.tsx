import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import AutSearch from "./AutSearch";
import { Box } from "@mui/material";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "transparent",
    boxShadow: "none"
  }
}));

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

const AutSearchDialog = ({ open, onClose }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: { backgroundColor: "transparent", boxShadow: "none" }
      }}
    >
      <AutBox
        sx={{
          position: "fixed",
          width: "520px",
          height: "200px"
        }}
      >
        <AutSearch onSelect={onClose} mode="full" />
      </AutBox>
    </StyledDialog>
  );
};

export default AutSearchDialog;
