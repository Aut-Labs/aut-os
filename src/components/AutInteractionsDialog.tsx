import { Community } from "@api/community.model";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { AutOSCommitmentSlider } from "@theme/commitment-slider-styles";
import { Controller, useForm } from "react-hook-form";
import { AutOsButton } from "./AutButton";
import { useAppDispatch } from "@store/store.model";
import { useState } from "react";
import { editCommitment } from "@api/holder.api";
import { setOpenCommitment } from "@store/ui-reducer";
import AutOsTabs from "./AutOsTabs";
import AutInteractionTabs from "src/pages/AutHolder/AutInteractionTabs/AutInteractionTabs";

export interface InteractionsDialogProps {
  title: string;
  description?: JSX.Element;
  open?: boolean;
  onClose?: () => void;
}

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "80%",
    height: "80%",
    border: "none",
    backgroundColor: "#1E2430",
    borderRadius: "30px",
    padding: "30px 0px",
    boxShadow:
      "0px 16px 80px 0px #2E90FA, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)"
  },
  [theme.breakpoints.down("md")]: {
    ".MuiPaper-root": {
      margin: "0",
      height: "100%",
      width: "100%",
      border: "none",
      borderRadius: "0",
      boxShadow: "none"
    }
  }
}));

export function AutInteractionsDialog(props: InteractionsDialogProps) {
  const dispatch = useAppDispatch();
  const [editInitiated, setEditInitiated] = useState(false);

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <AutStyledDialog
      fullScreen={!desktop}
      maxWidth={false}
      onClose={props.onClose}
      open={props.open}
    >
      <DialogContent
        sx={{
          border: 0,
          padding: "0px 30px",
          mb: theme.spacing(2),
          height: "100%",
          overflow: "hidden"
        }}
      >
        <AutInteractionTabs></AutInteractionTabs>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "flex-end",
          width: "100%",
          padding: "0px 30px"
        }}
      >
        <AutOsButton
          onClick={props.onClose}
          type="button"
          color="primary"
          variant="outlined"
          sx={{
            width: "100px",
            "&.MuiButton-root": {
              background: "#2F3746"
            }
          }}
        >
          <Typography fontWeight="normal" fontSize="16px" lineHeight="26px">
            Close
          </Typography>
        </AutOsButton>
      </DialogActions>
    </AutStyledDialog>
  );
}
