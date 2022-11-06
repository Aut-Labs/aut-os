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
import { pxToRem } from "@utils/text-size";
import { Controller, useForm } from "react-hook-form";
import { AutButton } from "@components/AutButton";
import { useHistory, useParams } from "react-router-dom";
import { AutSlider } from "@components/AutSlider";
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
import { trimAddress } from "@utils/trim-address";
import {
  BlockExplorerUrl,
  IsConnected,
  setProviderIsOpen
} from "@store/WalletProvider/WalletProvider";
import { useWeb3React } from "@web3-react/core";
import { EditContentElements } from "@components/EditContentElements";

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
  color: "white",
  fontSize: pxToRem(14),
  marginBottom: pxToRem(10)
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
  const history = useHistory();
  const status = useSelector(UpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);
  const blockExplorer = useSelector(BlockExplorerUrl);
  const isConnected = useSelector(IsConnected);
  const [editInitiated, setEditInitiated] = useState(false);
  const [withdrawInitiated, setWithdrawInitiated] = useState(false);
  const { isActive } = useWeb3React();

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
      history.goBack();
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
          <TopWrapper>
            <Typography
              fontSize={pxToRem(40)}
              textTransform="uppercase"
              color="background.paper"
              textAlign="left"
            >
              Edit your community
            </Typography>
          </TopWrapper>

          <MiddleWrapper>
            <AutCard sx={{ bgcolor: "background.default", border: "none" }}>
              <CardHeader
                sx={{ alignSelf: "flex-start" }}
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: "background.default",
                      width: pxToRem(110),
                      height: pxToRem(110),
                      borderRadius: 0
                    }}
                    aria-label="community-avatar"
                    src={ipfsCIDToHttpUrl(selectedCommunity.image as string)}
                  />
                }
              />
              <CardContent
                sx={{
                  ml: pxToRem(30),
                  mr: pxToRem(30),
                  alignSelf: "flex-end",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    fontSize={pxToRem(25)}
                    color="background.paper"
                    textAlign="left"
                  >
                    {selectedCommunity?.name}
                  </Typography>
                </div>
                <ExternalUrl
                  href={`${blockExplorer}/address/${selectedCommunity.properties.address}`}
                  target="_blank"
                >
                  {trimAddress(selectedCommunity.properties.address)}
                </ExternalUrl>
                <Typography
                  variant="subtitle2"
                  color="background.paper"
                  textAlign="left"
                  sx={{ textWrap: "wrap" }}
                >
                  {selectedCommunity?.properties?.market}
                </Typography>
                <Typography
                  variant="body1"
                  color="background.paper"
                  textAlign="left"
                  sx={{ textWrap: "wrap", pt: pxToRem(30) }}
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
                    padding: "0",
                    mt: pxToRem(15),
                    fontSize: pxToRem(16)
                  }}
                >
                  Withdraw from this community
                </Button>
              </CardContent>
            </AutCard>
            <div
              style={{
                marginTop: desktop
                  ? pxToRem(100)
                  : !xs
                  ? pxToRem(50)
                  : pxToRem(30),
                width: "100%"
              }}
            >
              <Typography
                color="background.paper"
                textAlign="left"
                sx={{ textWrap: "wrap", pb: pxToRem(20), fontSize: "20px" }}
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
                    <AutSlider
                      value={value}
                      name={name}
                      errors={errors}
                      communityName={selectedCommunity?.name}
                      minCommitment={selectedCommunity?.properties?.commitment}
                      sliderProps={{
                        defaultValue: 1,
                        step: 1,
                        marks: true,
                        name,
                        value: +value || 0,
                        onChange,
                        min: 0,
                        max: 10
                      }}
                    />
                  );
                }}
              />
            </div>
          </MiddleWrapper>
          <BottomWrapper>
            <AutButton
              onClick={() => history.goBack()}
              sx={{
                width: desktop ? pxToRem(250) : pxToRem(150),
                height: pxToRem(50)
              }}
              type="button"
              color="primary"
              variant="outlined"
            >
              Cancel
            </AutButton>
            <AutButton
              disabled={!isValid || !isDirty}
              sx={{
                width: desktop ? pxToRem(250) : pxToRem(150),
                height: pxToRem(50),
                marginLeft: pxToRem(50)
              }}
              type="submit"
              color="primary"
              variant="outlined"
            >
              Save
            </AutButton>
          </BottomWrapper>
        </>
      )}
    </FormWrapper>
  );
};

export default AutCommunityEdit;
