import { Community } from "@api/community.model";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { AutOSCommitmentSlider } from "@theme/commitment-slider-styles";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { AutOsButton } from "./AutButton";
import { AutID, socialUrls } from "@api/aut.model";
import { useSelector } from "react-redux";
import { HolderData } from "@store/holder/holder.reducer";

export interface EditDialogProps {
  title: string;
  description?: JSX.Element;
  open?: boolean;
  onClose?: () => void;
  hideCloseBtn?: boolean;
}

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "420px",
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
      border: "none"
    }
  }
}));

export function AutEditProfileDialog(props: EditDialogProps) {
  const holderData = useSelector(HolderData);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      avatar: holderData?.properties?.avatar,
      socials: (holderData?.properties?.socials || []).map((social) => {
        return {
          ...social,
          link: (social.link as string).replace(
            socialUrls[social.type].prefix,
            ""
          )
        };
      })
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "socials"
  });

  const values = watch();

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
          padding: "0px 30px"
        }}
      ></DialogContent>
    </AutStyledDialog>
  );
}
