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

export interface CommitmentDialogProps {
  title: string;
  description?: JSX.Element;
  open?: boolean;
  nova: Community;
  onClose?: () => void;
  onSubmit?: () => void;
  hideCloseBtn?: boolean;
}

const CommitmentSliderWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("lg")]: {
    marginTop: "32px"
  }
}));

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "420px",
    height: "320px",
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

export function AutChangeCommitmentDialog(props: CommitmentDialogProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      commitment: props.nova?.properties?.userData?.commitment
    }
  });
  const dispatch = useAppDispatch();
  const [editInitiated, setEditInitiated] = useState(false);

  const onEditCommitment = async (data) => {
    setEditInitiated(false);
    dispatch(setOpenCommitment(false));
    const result = await dispatch(
      editCommitment({
        communityAddress: props.nova.properties.address,
        commitment: data.commitment
      })
    );
    if (result.meta.requestStatus === "fulfilled") {
      console.log("changed", result);
      props.onClose();
    }
  };

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
          mt: {
            xs: "64px",
            md: "0"
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%"
            }}
          >
            <Typography
              variant="subtitle1"
              color="offWhite.main"
              fontWeight="bold"
            >
              {props?.title}
            </Typography>
          </Box>
          <CommitmentSliderWrapper>
            <Controller
              name="commitment"
              key="commitment"
              control={control}
              rules={{
                min: props.nova?.properties?.commitment,
                required: true
              }}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <AutOSCommitmentSlider
                    value={value}
                    name={name}
                    errors={errors}
                    sliderProps={{
                      defaultValue: 1,
                      step: 1,
                      marks: true,
                      name,
                      value: (value as any) || 0,
                      onChange,
                      min: 0,
                      max: 10
                    }}
                  />
                );
              }}
            />
          </CommitmentSliderWrapper>
        </Box>
        <Box
          sx={{
            bgcolor: (theme) => theme.palette.warning.light,
            borderRadius: "8px",
            padding: "8px 6px"
          }}
        >
          <Typography variant="caption" color="white">
            You'll be able to change your commitment on this Nova from the start
            of the 2nd period ahead
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "flex-start",
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
            Cancel
          </Typography>
        </AutOsButton>
        <AutOsButton
          onClick={handleSubmit(onEditCommitment)}
          type="button"
          color="primary"
          variant="outlined"
          disabled
          sx={{
            width: "100px"
          }}
        >
          <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
            Confirm
          </Typography>
        </AutOsButton>
      </DialogActions>
    </AutStyledDialog>
  );
}
