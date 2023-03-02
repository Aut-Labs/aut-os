import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  styled,
  Typography,
  useMediaQuery
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  SelectedCommunity,
  UpdateErrorMessage,
  updateHolderState,
  UpdateStatus
} from "@store/holder/holder.reducer";
import { useAppDispatch } from "@store/store.model";
import { ResultState } from "@store/result-status";
import { useEffect, useState } from "react";
import { editCommitment, withdraw } from "@api/holder.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import {
  BlockExplorerUrl,
  IsConnected,
  setProviderIsOpen
} from "@store/WalletProvider/WalletProvider";
import { EditContentElements } from "@components/EditContentElements";
import { AutCommitmentSlider } from "@theme/commitment-slider-styles";
import { useEthers } from "@usedapp/core";

const AutCard = styled(Card)(() => ({
  "&.MuiCard-root": {
    display: "flex"
  },
  ".MuiCardHeader-root": {
    padding: "0"
  },

  ".MuiCardContent-root:last-child": {
    padding: "0"
  }
}));

const ExternalUrl = styled("a")(() => ({
  color: "white"
}));

const MiddleWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  height: "100%",
  alignItems: "flex-start",
  width: "100%",
  flex: 1
}));

const CommitmentSliderWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
  [theme.breakpoints.down("lg")]: {
    marginTop: "50px",
    marginBottom: "50px"
  }
}));

const { FormWrapper, BottomWrapper, TopWrapper } = EditContentElements;

const AutCommunityEdit = () => {
  const dispatch = useAppDispatch();
  const desktop = useMediaQuery("(min-width:1024px)");
  const xs = useMediaQuery("(max-width:360px)");
  const params = useParams<{
    network: string;
    holderAddress: string;
    communityAddress: string;
  }>();
  const selectedCommunity = useSelector(
    SelectedCommunity(params.communityAddress)
  );
  const navigate = useNavigate();
  const status = useSelector(UpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);
  const blockExplorer = useSelector(BlockExplorerUrl);
  const isConnected = useSelector(IsConnected);
  const [editInitiated, setEditInitiated] = useState(false);
  const [withdrawInitiated, setWithdrawInitiated] = useState(false);
  const { active: isActive } = useEthers();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      commitment: selectedCommunity?.properties?.userData?.commitment
    }
  });

  const values = watch();

  const beforeEdit = () => {
    setEditInitiated(true);
    if (!isActive || !isConnected) {
      dispatch(setProviderIsOpen(true));
    }
  };

  const onEditCommitment = async (data) => {
    setEditInitiated(false);
    const result = await dispatch(
      editCommitment({
        communityAddress: params.communityAddress,
        commitment: data.commitment
      })
    );
    if (result.meta.requestStatus === "fulfilled") {
      // do somethhing on success
    }
  };

  const beforeWithdraw = () => {
    setWithdrawInitiated(true);
    if (!isActive || !isConnected) {
      dispatch(setProviderIsOpen(true));
    }
  };

  const onWithdraw = async () => {
    setWithdrawInitiated(false);
    const result = await dispatch(withdraw(params.communityAddress));
    if (result.meta.requestStatus === "fulfilled") {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (!withdrawInitiated || !isActive || !isConnected) {
      return;
    }
    onWithdraw();
  }, [isActive, isConnected, withdrawInitiated]);

  useEffect(() => {
    if (!editInitiated || !isActive || !isConnected) {
      return;
    }
    onEditCommitment(values);
  }, [isActive, isConnected, editInitiated]);

  const handleDialogClose = () => {
    dispatch(
      updateHolderState({
        status: ResultState.Idle
      })
    );
  };

  useEffect(() => {
    return () => {
      handleDialogClose();
    };
  }, []);

  return (
    <FormWrapper autoComplete="off" onSubmit={handleSubmit(beforeEdit)}>
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message={errorMessage}
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Loading}
        message="Editing community..."
      />
      {selectedCommunity && (
        <>
          {/* <TopWrapper>
            <Typography variant="h3" color="white" textAlign="left">
              Edit your community
            </Typography>
          </TopWrapper> */}

          <MiddleWrapper>
            <AutCard
              sx={{ bgcolor: "transparent", border: "none", boxShadow: "none" }}
            >
              <CardHeader
                sx={{ alignSelf: "flex-start" }}
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: "background.default",
                      height: {
                        xs: "100px",
                        xxl: "150px"
                      },
                      width: {
                        xs: "100px",
                        xxl: "150px"
                      },
                      borderRadius: 0
                    }}
                    aria-label="community-avatar"
                    src={ipfsCIDToHttpUrl(selectedCommunity.image as string)}
                  />
                }
              />
              <CardContent
                sx={{
                  ml: {
                    xs: "30px"
                  },
                  mr: {
                    xs: "30px"
                  },
                  alignSelf: "flex-end",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography color="white" variant="h3" textAlign="left">
                    {selectedCommunity?.name}
                  </Typography>
                </div>
                {/* <ExternalUrl
                  href={`${blockExplorer}/address/${selectedCommunity.properties.address}`}
                  target="_blank"
                >
                  <Typography variant="caption" color="white">
                    {trimAddress(selectedCommunity.properties.address)}
                  </Typography>
                </ExternalUrl> */}
                <Typography
                  variant="subtitle2"
                  color="white"
                  textAlign="left"
                  fontWeight="normal"
                  sx={{ textWrap: "wrap" }}
                >
                  {selectedCommunity?.properties?.market}
                </Typography>
                <Typography
                  variant="body"
                  color="white"
                  textAlign="left"
                  sx={{ textWrap: "wrap", padding: "20px 0" }}
                >
                  {selectedCommunity?.description}
                </Typography>
                <Button
                  onClick={beforeWithdraw}
                  type="button"
                  color="error"
                  sx={{
                    textDecoration: "underline",
                    textTransform: "none",
                    padding: "0"
                  }}
                >
                  <Typography variant="subtitle2">
                    Withdraw from this community
                  </Typography>
                </Button>
              </CardContent>
            </AutCard>
            <CommitmentSliderWrapper>
              <Typography
                color="white"
                variant="subtitle2"
                textAlign="left"
                sx={{ textWrap: "wrap", pb: "20px" }}
              >
                My Commitment Level
              </Typography>
              <Controller
                name="commitment"
                key="commitment"
                control={control}
                rules={{
                  min: selectedCommunity?.properties?.commitment,
                  required: true
                }}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <AutCommitmentSlider
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
          </MiddleWrapper>

          <BottomWrapper>
            <Button
              variant="outlined"
              size="normal"
              color="offWhite"
              onClick={() => navigate(-1)}
              sx={{
                width: {
                  xs: "140px",
                  md: "200px",
                  xxl: "270px"
                }
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!isValid || !isDirty}
              type="submit"
              variant="outlined"
              size="normal"
              color="primary"
              sx={{
                width: {
                  xs: "140px",
                  md: "200px",
                  xxl: "270px"
                }
              }}
            >
              Save
            </Button>
          </BottomWrapper>
        </>
      )}
    </FormWrapper>
  );
};

export default AutCommunityEdit;
