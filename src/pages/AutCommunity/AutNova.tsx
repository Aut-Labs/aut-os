/* eslint-disable max-len */
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  IconButton,
  LinearProgress,
  Link,
  Stack,
  styled,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HolderData,
  SelectedCommunity,
  UpdateErrorMessage,
  updateHolderState,
  UpdateStatus
} from "@store/holder/holder.reducer";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useAppDispatch } from "@store/store.model";
import { ResultState } from "@store/result-status";
import { useEffect, useState } from "react";
import { editCommitment, withdraw } from "@api/holder.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  BlockExplorerUrl,
  SelectedNetwork
} from "@store/WalletProvider/WalletProvider";
import CopyAddress from "@components/CopyAddress";
import { AutOsButton } from "@components/AutButton";
import AutToolBar from "../AutHolder/AutLeft/AutToolBar";
import backgroundImage from "@assets/autos/background.png";
import { SubtitleWithInfo } from "@components/SubtitleWithInfoIcon";
import { IconContainer, socialIcons } from "../AutHolder/AutLeft/AutUserInfo";
import { socialUrls } from "@api/social.model";
import { CanUpdateProfile } from "@auth/auth.reducer";
import {
  NovaBottomWrapper,
  NovaTopWrapper,
  PropertiesWrapper
} from "../AutHolder/AutUserTabs/NovaeList";
import { ReactComponent as ArrowDownIcon } from "@assets/autos/arrow-down-circle.svg";
import { ReactComponent as CheckmarkIcon } from "@assets/autos/checkmark-icon.svg";
import { ReactComponent as Check } from "@assets/autos/check.svg";

import Countdown from "react-countdown";
import { AutCountdown } from "@components/AutCountdown";
import { AutChangeCommitmentDialog } from "@components/AutChangeCommitment";
import { setOpenCommitment } from "@store/ui-reducer";
import { setOpenWithdraw } from "@store/ui-reducer";

import AutNovaTabs from "./AutNovaTabs/AutNovaTabs";
import { AutConfirmDialog } from "@components/Dialog/AutOsConfirmationDialog";

const AutContainer = styled("div")(() => ({
  display: "flex",
  height: "100%",
  backgroundImage: `url(${backgroundImage})`,
  backgroundBlendMode: "hard-light",
  backgroundSize: "cover",
  backgroundRepeat: "repeat-y"
}));

const LeftWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "30%",
  [theme.breakpoints.down("md")]: {
    width: "100%"
  }
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  alignSelf: "flex-start",
  display: "flex",
  flexDirection: "column",
  px: "30px",
  marginLeft: "50px",
  height: "100%",
  position: "relative",
  // width: "70%",
  flex: 1,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginLeft: "0",
    marginTop: "50px"
  }
}));

const NovaWrapper = styled(Box)(({ theme }) => ({
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
    width: `calc(100% - 20px)`,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    paddingTop: "30px",
    paddingLeft: "10px",
    paddingRight: "10px"
  }
}));

const AutCommunityEdit = () => {
  const dispatch = useAppDispatch();
  // const desktop = useMediaQuery("(min-width:1024px)");
  // const xs = useMediaQuery("(max-width:360px)");
  const theme = useTheme();
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
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const isNovaMember = true;
  const [withdrawInitiated, setWithdrawInitiated] = useState(false);
  const selectedNetwork = useSelector(SelectedNetwork);
  const holderData = useSelector(HolderData);

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

  // const values = watch();

  const beforeEdit = () => {
    // if (!isActive || !isConnected) {
    //   dispatch(setProviderIsOpen(true));
    // }
  };

  const beforeWithdraw = () => {
    setWithdrawInitiated(true);
    // if (!isActive || !isConnected) {
    //   dispatch(setProviderIsOpen(true));
    // }
  };

  const onWithdraw = async () => {
    setWithdrawInitiated(false);
    const result = await dispatch(withdraw(params.communityAddress));
    if (result.meta.requestStatus === "fulfilled") {
      navigate(-1);
    }
  };

  // useEffect(() => {
  //   if (!withdrawInitiated || !isActive || !isConnected) {
  //     return;
  //   }
  //   onWithdraw();
  // }, [isActive, isConnected, withdrawInitiated]);

  // useEffect(() => {
  //   if (!editInitiated || !isActive || !isConnected) {
  //     return;
  //   }
  //   onEditCommitment(values);
  // }, [isActive, isConnected, editInitiated]);
  const { openCommitment } = useSelector((state: any) => state.ui);
  const { openWithdraw } = useSelector((state: any) => state.ui);

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
  }

  function goToProfile() {
    navigate({
      pathname: `/${holderData.name}`,
      search: ``
    });
  }

  const handleClose = () => {
    dispatch(setOpenCommitment(false));
  };

  const handleWithdrawClose = () => {
    dispatch(setOpenWithdraw(false));
  };

  const openWithdrawConfirmation = () => {
    dispatch(setOpenWithdraw(true));
  };

  const openCommitmentModal = () => {
    dispatch(setOpenCommitment(true));
  };

  const nextPeriod = new Date("3/31/2024");
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  const communityRep: number = 80;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  const userRep: number = 40;

  return (
    <>
      <AutChangeCommitmentDialog
        open={openCommitment}
        nova={selectedCommunity}
        hideCloseBtn={false}
        title="Change Commitment Level"
        onClose={handleClose}
      />
      <AutConfirmDialog
        open={openWithdraw}
        hideCloseBtn={false}
        title="Are you sure you want to withdraw from this community?"
        onClose={handleWithdrawClose}
        onSubmit={onWithdraw}
      />
      <AutContainer>
        <AutToolBar></AutToolBar>
        <PerfectScrollbar
          style={{
            top: "84px",
            height: "calc(100% - 84px)",
            display: "flex",
            flexDirection: "column",
            width: "100%"
          }}
        >
          <NovaWrapper>
            <ErrorDialog
              handleClose={handleDialogClose}
              open={status === ResultState.Failed}
              message={errorMessage || "An error has occurred."}
            />
            <LoadingDialog
              handleClose={handleDialogClose}
              open={status === ResultState.Loading}
              message="Your change is in progress..."
            />
            {selectedCommunity && (
              <>
                <LeftWrapper>
                  <Stack
                    sx={{
                      position: "relative"
                    }}
                  >
                    <Avatar
                      sx={{
                        height: {
                          xs: "150px",
                          md: "160px",
                          xxl: "160px"
                        },
                        borderRadius: "0",
                        width: {
                          xs: "150px",
                          md: "160px",
                          xxl: "160px"
                        }
                      }}
                      aria-label="avatar"
                      src={ipfsCIDToHttpUrl(selectedCommunity?.image as string)}
                    />
                    {/* <AutOsButton
                      startIcon={<ArrowBackIcon />}
                      color="offWhite"
                      variant="outlined"
                      size="small"
                      onClick={() => goToProfile()}
                      sx={{
                        position: {
                          sm: "absolute"
                        },
                        right: {
                          sm: "0"
                        },
                        "&.MuiButton-root": {
                          background: "transparent",
                          border: "1px solid #A7B1C4"
                        }
                      }}
                    >
                      <Typography
                        fontWeight="700"
                        fontSize="16px"
                        lineHeight="26px"
                      >
                        Profile
                      </Typography>
                    </AutOsButton> */}
                    <Stack
                      sx={{
                        mt: 2
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start"
                          }}
                        >
                          <Typography
                            color="offWhite.main"
                            textAlign="left"
                            lineHeight={1}
                            variant="h2"
                          >
                            {selectedCommunity.name}
                          </Typography>
                        </div>

                        <Stack
                          sx={{
                            mt: 2
                          }}
                          direction="row"
                          alignItems="center"
                        >
                          <CopyAddress
                            address={selectedCommunity?.properties?.address}
                          />
                          {selectedNetwork?.name && (
                            <Tooltip
                              title={`Explore in ${selectedNetwork?.name}`}
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
                      </div>
                    </Stack>

                    <Box
                      sx={{
                        mt: 2
                      }}
                    >
                      <Box sx={{ padding: "16.5px 0px" }}>
                        <Typography
                          color="offWhite.main"
                          textAlign="left"
                          variant="body"
                        >
                          {selectedCommunity?.description || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        mt: 2
                      }}
                    >
                      <IconContainer>
                        {selectedCommunity?.properties.socials.map(
                          (social, index) => {
                            const AutIcon =
                              socialIcons[Object.keys(socialIcons)[index]];

                            return (
                              <Link
                                key={`social-icon-${index}`}
                                {...(!!social.link && {
                                  component: "a",
                                  href: social.link,
                                  target: "_blank",
                                  sx: {
                                    svg: {
                                      color: theme.palette.offWhite.main
                                    }
                                  }
                                })}
                                {...((!social.link ||
                                  social.link ===
                                    socialUrls[social.type].prefix) && {
                                  sx: {
                                    // display: "none",
                                    svg: {
                                      color: theme.palette.divider
                                    }
                                  },
                                  component: "button",
                                  disabled: true
                                })}
                              >
                                <SvgIcon
                                  sx={{
                                    height: {
                                      xs: "25px",
                                      xxl: "30px"
                                    },
                                    width: {
                                      xs: "25px",
                                      xxl: "30px"
                                    },
                                    mr: {
                                      xs: "10px",
                                      xxl: "15px"
                                    }
                                  }}
                                  key={`socials.${index}.icon`}
                                  component={AutIcon}
                                />
                              </Link>
                            );
                          }
                        )}
                      </IconContainer>
                    </Box>
                  </Stack>
                  {canUpdateProfile && (
                    <Stack
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: theme.spacing(3),
                        mt: 2
                      }}
                    >
                      <AutOsButton
                        onClick={openCommitmentModal}
                        type="button"
                        color="primary"
                        variant="outlined"
                        sx={{
                          width: "230px",
                          "&.MuiButton-root": {
                            background: "transparent",
                            border: "1px solid #A7B1C4"
                          }
                        }}
                      >
                        <Typography
                          fontWeight="700"
                          fontSize="16px"
                          lineHeight="26px"
                        >
                          Change Commitment
                        </Typography>
                      </AutOsButton>

                      <Box>
                        <Badge
                          badgeContent={
                            <Tooltip title="You've just joined friend. You'll be able to Withdraw from this Nova from the start of the 2nd period ahead">
                              {/* @ts-ignore */}
                              <HelpOutlineIcon color="offWhite" />
                            </Tooltip>
                          }
                        >
                          <AutOsButton
                            onClick={openWithdrawConfirmation}
                            type="button"
                            color="primary"
                            variant="outlined"
                            disabled
                            sx={{
                              width: "230px",
                              "&.MuiButton-root": {
                                background: "transparent",
                                border: "1px solid #D92D20",
                                ":hover": {
                                  background: "#D92D20"
                                }
                              }
                            }}
                          >
                            <Typography
                              fontWeight="700"
                              fontSize="16px"
                              lineHeight="26px"
                            >
                              Withdraw from Nova
                            </Typography>
                          </AutOsButton>
                        </Badge>
                      </Box>
                    </Stack>
                  )}
                </LeftWrapper>
                <RightWrapper>
                  <Box>
                    <AutOsButton
                      startIcon={<ArrowBackIcon />}
                      color="offWhite"
                      variant="outlined"
                      size="small"
                      onClick={() => goToProfile()}
                      sx={{
                        // position: {
                        //   sm: "absolute"
                        // },
                        // right: {
                        //   sm: "0"
                        // },
                        mb: 2,
                        "&.MuiButton-root": {
                          background: "transparent",
                          border: "1px solid #A7B1C4"
                        }
                      }}
                    >
                      <Typography
                        fontWeight="700"
                        fontSize="16px"
                        lineHeight="26px"
                      >
                        Profile
                      </Typography>
                    </AutOsButton>
                  </Box>
                  {canUpdateProfile && isNovaMember && (
                    <Box
                      sx={{
                        mb: 4,
                        display: "flex",
                        alignItems: "center",
                        flexDirection: {
                          xs: "column",
                          md: "row"
                        }
                      }}
                    >
                      <Box
                        sx={{
                          border: "1px solid",
                          borderColor: "#576176",
                          width: "100%",
                          flexDirection: {
                            xs: "column",
                            md: "row"
                          }
                        }}
                      >
                        <NovaTopWrapper
                          sx={{
                            flexDirection: "column"
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%"
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                width: "100%",

                                flexDirection: {
                                  xs: "column"
                                },
                                justifyContent: {
                                  xs: "space-between",
                                  md: "space-between"
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  width: "100%",
                                  justifyContent: "space-between"
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center"
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    fontSize={{
                                      xs: "16px",
                                      md: "24px"
                                    }}
                                    color="offWhite.main"
                                  >
                                    Current Period Contribution
                                  </Typography>
                                  {userRep < communityRep ? (
                                    <SvgIcon
                                      sx={{
                                        fill: "transparent",
                                        ml: theme.spacing(1)
                                      }}
                                      component={ArrowDownIcon}
                                    />
                                  ) : (
                                    <SvgIcon
                                      sx={{
                                        fill: "transparent",
                                        ml: theme.spacing(1)
                                      }}
                                      component={CheckmarkIcon}
                                    />
                                  )}
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end"
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="offWhite.dark"
                                  >
                                    period ends in
                                  </Typography>
                                  <Countdown
                                    date={nextPeriod}
                                    renderer={AutCountdown}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "flex-end",
                              paddingTop: theme.spacing(3)
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                display: "flex"
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-end"
                                }}
                              >
                                <Typography
                                  sx={{
                                    "&.MuiTypography-root": {
                                      fontSize: "48px",
                                      letterSpacing: "-1px"
                                    }
                                  }}
                                  lineHeight="48px"
                                  color="offWhite.main"
                                >
                                  {userRep}
                                </Typography>
                                <Typography
                                  lineHeight="48px"
                                  color="offWhite.dark"
                                  letterSpacing="-1px"
                                  sx={{
                                    "&.MuiTypography-root": {
                                      fontSize: "48px",
                                      letterSpacing: "0.33px"
                                    }
                                  }}
                                >
                                  /
                                </Typography>
                                <Typography
                                  sx={{
                                    "&.MuiTypography-root": {
                                      fontSize: "24px",
                                      letterSpacing: "-1px"
                                    }
                                  }}
                                  color="offWhite.dark"
                                >
                                  {communityRep}
                                </Typography>
                              </Box>

                              {userRep < communityRep && (
                                <Box
                                  sx={{
                                    width: "100%",
                                    ml: theme.spacing(3),
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "start",
                                    flexDirection: "column"
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: "100%",
                                      mb: theme.spacing(1)
                                    }}
                                  >
                                    <LinearProgress
                                      sx={{
                                        borderRadius: "100px",
                                        backgroundColor:
                                          theme.palette.offWhite.dark,
                                        boxShadow:
                                          "0px 16px 80px 0px #2E90FA, 0px 16px 64px 0px rgba(20, 200, 236, 0.64), 0px 8px 32px 0px rgba(20, 200, 236, 0.32), 0px 16px 80px 0px #2E90FA, 0px 16px 64px 0px rgba(20, 200, 236, 0.64), 0px 8px 32px 0px rgba(20, 200, 236, 0.32)",
                                        "& .MuiLinearProgress-bar": {
                                          // backgroundColor:
                                          //   theme.palette.primary.main
                                          backgroundColor: "#14ECEC"
                                        }
                                      }}
                                      variant="determinate"
                                      value={(userRep / communityRep) * 100}
                                    />
                                  </Box>
                                  <Typography
                                    variant="subtitle2"
                                    color="offWhite.main"
                                    sx={{
                                      zIndex: 5
                                    }}
                                  >
                                    Points to maintain current Reputation 🙌
                                  </Typography>
                                </Box>
                              )}
                              {userRep === communityRep && (
                                <Box
                                  sx={{
                                    width: "100%",
                                    ml: theme.spacing(3),

                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    flexDirection: "row"
                                  }}
                                >
                                  <Box
                                    sx={{
                                      borderRadius: "100px",
                                      backgroundColor: "#14ECEC",
                                      height: "30px",
                                      width: "30px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      mr: theme.spacing(1),

                                      boxShadow:
                                        "0px 16px 80px 0px #2E90FA, 0px 16px 64px 0px rgba(20, 200, 236, 0.64), 0px 8px 32px 0px rgba(20, 200, 236, 0.32), 0px 16px 80px 0px #2E90FA, 0px 16px 64px 0px rgba(20, 200, 236, 0.64), 0px 8px 32px 0px rgba(20, 200, 236, 0.32)"
                                    }}
                                  >
                                    <SvgIcon
                                      viewBox="0 0 16 16"
                                      height={16}
                                      width={16}
                                      sx={{
                                        fill: "transparent"
                                      }}
                                      component={Check}
                                    />
                                  </Box>
                                  <Typography
                                    variant="subtitle2"
                                    color="offWhite.main"
                                    sx={{
                                      zIndex: 5
                                    }}
                                  >
                                    You’ve secured current Reputation! Now boost
                                    it up 💪
                                  </Typography>
                                </Box>
                              )}
                              {userRep > communityRep && (
                                <Box
                                  sx={{
                                    width: "100%",
                                    ml: theme.spacing(3),

                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    flexDirection: "row"
                                  }}
                                >
                                  <Box
                                    sx={{
                                      borderRadius: "100px",
                                      backgroundColor: "#14ECEC",
                                      height: "30px",
                                      width: "30px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      mr: theme.spacing(1),

                                      boxShadow:
                                        "0px 16px 80px 0px #2E90FA, 0px 16px 64px 0px rgba(20, 200, 236, 0.64), 0px 8px 32px 0px rgba(20, 200, 236, 0.32), 0px 16px 80px 0px #2E90FA, 0px 16px 64px 0px rgba(20, 200, 236, 0.64), 0px 8px 32px 0px rgba(20, 200, 236, 0.32)"
                                    }}
                                  >
                                    <SvgIcon
                                      viewBox="0 0 16 16"
                                      height={16}
                                      width={16}
                                      sx={{
                                        fill: "transparent"
                                      }}
                                      component={Check}
                                    />
                                  </Box>
                                  <Typography
                                    variant="subtitle2"
                                    color="offWhite.main"
                                    sx={{
                                      zIndex: 5
                                    }}
                                  >
                                    Great! Keep it up, more points means higher
                                    Reputation next period 🤘
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </NovaTopWrapper>
                        <NovaBottomWrapper>
                          <PropertiesWrapper
                            sx={{
                              borderRight: {
                                xs: "0",
                                md: "1px solid"
                              },
                              borderBottom: {
                                xs: "1px solid",
                                md: "0"
                              },
                              borderRightColor: {
                                xs: "transparent",
                                md: "inherit"
                              },
                              borderBottomColor: {
                                xs: "inherit",
                                md: "transparent"
                              }
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="offWhite.main"
                              fontWeight="normal"
                            >
                              {/* TODO: Revert */}
                              {/* {
                                selectedCommunity?.properties?.userData
                                  ?.roleName
                              } */}
                              {"Contributor"}
                            </Typography>
                            <SubtitleWithInfo
                              title="role"
                              description="This is your role"
                            ></SubtitleWithInfo>
                          </PropertiesWrapper>
                          <PropertiesWrapper
                            sx={{
                              borderRight: {
                                xs: "0",
                                md: "1px solid"
                              },
                              borderBottom: {
                                xs: "1px solid",
                                md: "0"
                              },
                              borderRightColor: {
                                xs: "transparent",
                                md: "inherit"
                              },
                              borderBottomColor: {
                                xs: "inherit",
                                md: "transparent"
                              }
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="offWhite.main"
                              fontWeight="normal"
                            >
                              {`${selectedCommunity?.properties.userData.commitment}/10 - ${selectedCommunity?.properties.userData.commitmentDescription}`}
                            </Typography>
                            <SubtitleWithInfo
                              title="commitment"
                              description="This is your commitment"
                            ></SubtitleWithInfo>
                          </PropertiesWrapper>
                          <PropertiesWrapper sx={{}}>
                            <Typography
                              variant="subtitle2"
                              color="offWhite.main"
                              fontWeight="normal"
                            >
                              1.0
                            </Typography>
                            <SubtitleWithInfo
                              title="local rep"
                              description="This is your local reputation."
                            ></SubtitleWithInfo>
                          </PropertiesWrapper>
                        </NovaBottomWrapper>
                      </Box>
                    </Box>
                  )}
                  <AutNovaTabs isNovaMember={isNovaMember}></AutNovaTabs>
                </RightWrapper>
              </>
            )}
          </NovaWrapper>
        </PerfectScrollbar>
      </AutContainer>
    </>
  );
};

export default AutCommunityEdit;
