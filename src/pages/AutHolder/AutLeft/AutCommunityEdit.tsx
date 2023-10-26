import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  styled,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactComponent as MyAutIDLogo } from "@assets/MyAutIdLogoToolbarPath.svg";
import {
  SelectedCommunity,
  UpdateErrorMessage,
  updateHolderState,
  UpdateStatus
} from "@store/holder/holder.reducer";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useAppDispatch } from "@store/store.model";
import { ResultState } from "@store/result-status";
import { useEffect, useMemo, useState } from "react";
import { editCommitment, withdraw } from "@api/holder.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  BlockExplorerUrl,
  IsConnected,
  SelectedNetworkConfig,
  setProviderIsOpen
} from "@store/WalletProvider/WalletProvider";
import { EditContentElements } from "@components/EditContentElements";
import { AutCommitmentSlider } from "@theme/commitment-slider-styles";
import { useEthers } from "@usedapp/core";
import CopyAddress from "@components/CopyAddress";
import AutTabs from "@components/AutTabs";
import { CommunityTasksTable } from "./CommunityTabs";
import CountdownClock from "@components/CountdownClock";
import AutToolBar from "./AutToolBar";
import { DautPlaceholder } from "@api/ProviderFactory/components/web3-daut-connect";
import { resetSearchState } from "@store/search/search.reducer";
import { AutButtonVariant } from "@components/AutButton";

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

const LeftWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "40%"
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  alignSelf: "flex-start",
  display: "flex",
  flexDirection: "column",
  px: "30px",
  marginLeft: "50px",
  height: "100%",
  width: "60%"
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
  const selectedNetworkConfig = useSelector(SelectedNetworkConfig);

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

  function goHome() {
    const params = new URLSearchParams(location.search);
    params.delete("network");
    navigate({
      pathname: `/`,
      search: `?${params.toString()}`
    });
    dispatch(resetSearchState());
  }

  const nextPeriod = new Date("10/10/2023");

  const tabs = [
    {
      label: "open tasks",
      props: {
        tasks: [
          {
            name: "Task 1",
            description: "Description for task 1",
            startDate: new Date("2022-01-01"),
            endDate: new Date("2022-01-05")
          },
          {
            name: "Task 2",
            description: "Description for task 2",
            startDate: new Date("2022-02-01"),
            endDate: new Date("2022-02-10")
          },
          {
            name: "Task 3",
            description: "Description for task 3",
            startDate: new Date("2022-03-01"),
            endDate: new Date("2022-03-10")
          },
          {
            name: "Task 4",
            description: "Description for task 4",
            startDate: new Date("2022-04-01"),
            endDate: new Date("2022-04-10")
          },
          {
            name: "Task 5",
            description: "Description for task 5",
            startDate: new Date("2022-05-01"),
            endDate: new Date("2022-05-10")
          }
        ]
      },
      component: CommunityTasksTable
    },
    {
      label: "community polls",
      props: {
        tasks: [
          {
            name: "Poll 1",
            description: "Description for poll 1",
            startDate: new Date("2022-03-01"),
            endDate: new Date("2022-03-10")
          },
          {
            name: "Poll 2",
            description: "Description for poll 2",
            startDate: new Date("2022-04-01"),
            endDate: new Date("2022-04-10")
          },
          {
            name: "Poll 3",
            description: "Description for poll 3",
            startDate: new Date("2022-05-01"),
            endDate: new Date("2022-05-10")
          },
          {
            name: "Poll 4",
            description: "Description for poll 4",
            startDate: new Date("2022-06-01"),
            endDate: new Date("2022-06-10")
          },
          {
            name: "Poll 5",
            description: "Description for poll 5",
            startDate: new Date("2022-07-01"),
            endDate: new Date("2022-07-10")
          }
        ]
      },
      component: CommunityTasksTable
    },
    {
      label: "community event",
      props: {
        tasks: [
          {
            name: "Event 1",
            description: "Description for event 1",
            startDate: new Date("2022-05-01"),
            endDate: new Date("2022-05-10")
          },
          {
            name: "Event 2",
            description: "Description for event 2",
            startDate: new Date("2022-06-01"),
            endDate: new Date("2022-06-10")
          },
          {
            name: "Event 3",
            description: "Description for event 3",
            startDate: new Date("2022-07-01"),
            endDate: new Date("2022-07-10")
          },
          {
            name: "Event 4",
            description: "Description for event 4",
            startDate: new Date("2022-08-01"),
            endDate: new Date("2022-08-10")
          },
          {
            name: "Event 5",
            description: "Description for event 5",
            startDate: new Date("2022-09-01"),
            endDate: new Date("2022-09-10")
          }
        ]
      },
      component: CommunityTasksTable
    }
  ];

  return (
    <>
      <Toolbar
        sx={{
          width: "100%",
          boxShadow: 2,
          "&.MuiToolbar-root": {
            width: "100%",
            paddingLeft: 6,
            paddingRight: 6,
            minHeight: "84px",
            justifyContent: "space-between",
            alignItems: "center"
          }
        }}
      >
        <MyAutIDLogo
          height="62"
          style={{ cursor: "pointer" }}
          onClick={() => goHome()}
        />
        <DautPlaceholder />
      </Toolbar>
      <PerfectScrollbar
        style={{
          height: "calc(100% - 84px)",
          display: "flex",
          flexDirection: "column"
        }}
      >
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
              <LeftWrapper>
                <>
                  {/* <TopWrapper>
             <Typography variant="h3" color="white" textAlign="left">
               Edit your community
             </Typography>
           </TopWrapper> */}
                  <Button
                    startIcon={<ArrowBackIcon />}
                    color="offWhite"
                    sx={{
                      position: "absolute",
                      top: "15px",
                      mb: 2
                    }}
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                  <MiddleWrapper>
                    <AutCard
                      sx={{
                        bgcolor: "transparent",
                        border: "none",
                        boxShadow: "none"
                      }}
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
                            src={ipfsCIDToHttpUrl(
                              selectedCommunity.image as string
                            )}
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
                          <Typography
                            color="white"
                            variant="h3"
                            textAlign="left"
                          >
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
                        <Stack direction="row" alignItems="center">
                          <CopyAddress
                            address={selectedCommunity?.properties?.address}
                          />
                          {selectedNetworkConfig?.name && (
                            <Tooltip
                              title={`Explore in ${selectedNetworkConfig?.name}`}
                            >
                              <IconButton
                                sx={{ p: 0, ml: 1 }}
                                href={`${blockExplorer}/address/${selectedCommunity?.properties?.address}`}
                                target="_blank"
                                color="offWhite"
                              >
                                <OpenInNewIcon
                                  sx={{ cursor: "pointer", width: "20px" }}
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
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
                      </CardContent>
                    </AutCard>
                    <CommitmentSliderWrapper>
                      <Typography
                        color="white"
                        variant="subtitle2"
                        fontWeight="bold"
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
                    <AutButtonVariant
                      disabled={!isValid || !isDirty}
                      type="submit"
                      sx={{
                        width: {
                          xs: "200px",
                          md: "250px",
                          xxl: "300px"
                        },
                        mb: 2
                      }}
                    >
                      Change commitment
                    </AutButtonVariant>
                    <Stack sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography
                        color="white"
                        variant="subtitle2"
                        textAlign="left"
                        sx={{ textWrap: "wrap", pb: "20px" }}
                      >
                        My Local Reputation:
                      </Typography>
                      <Typography
                        color="white"
                        variant="subtitle2"
                        textAlign="left"
                        sx={{
                          textWrap: "wrap",
                          pb: "20px",
                          ml: 2,
                          fontWeight: "normal"
                        }}
                      >
                        1.2
                      </Typography>
                    </Stack>
                    <Stack sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography
                        color="white"
                        variant="subtitle2"
                        textAlign="left"
                        sx={{ textWrap: "wrap", pb: "20px" }}
                      >
                        My Contribution Points
                      </Typography>
                      <Typography
                        color="white"
                        variant="subtitle2"
                        textAlign="left"
                        sx={{
                          textWrap: "wrap",
                          pb: "20px",
                          ml: 2,
                          fontWeight: "normal"
                        }}
                      >
                        1.0
                      </Typography>
                    </Stack>{" "}
                    <AutButtonVariant
                      sx={{
                        width: {
                          xs: "200px",
                          md: "250px",
                          xxl: "300px"
                        },
                        mb: 2
                      }}
                    >
                      Similar Novae
                    </AutButtonVariant>
                  </MiddleWrapper>
                </>
              </LeftWrapper>
              <RightWrapper>
                <Box
                  sx={{
                    mb: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Typography color="white" variant="h3" textAlign="left">
                    Novæ Tasks
                  </Typography>
                  <Stack>
                    <Typography
                      color="white"
                      variant="body"
                      textAlign="center"
                      sx={{ mb: 1 }}
                    >
                      Next period starts
                    </Typography>
                    <CountdownClock to={nextPeriod}></CountdownClock>
                  </Stack>
                </Box>
                <AutTabs tabs={tabs}></AutTabs>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    mt: 4
                  }}
                >
                  <Button
                    onClick={beforeWithdraw}
                    type="button"
                    color="error"
                    sx={{
                      // textDecoration: "underline",
                      // textTransform: "none",
                      // padding: "0"
                      mb: 4
                    }}
                  >
                    <Typography variant="subtitle2">
                      Withdraw from Nova
                    </Typography>
                  </Button>
                </Box>
              </RightWrapper>
            </>
          )}
        </FormWrapper>
      </PerfectScrollbar>
    </>
  );
};

export default AutCommunityEdit;
