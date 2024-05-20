import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { ReactComponent as KeyIcon } from "@assets/autos/lock-keyhole.svg";

import {
  Box,
  Paper,
  styled,
  Avatar,
  Typography,
  useTheme,
  SvgIcon,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HolderData } from "@store/holder/holder.reducer";
import { CanUpdateProfile } from "@auth/auth.reducer";
import { AutOsButton } from "@components/AutButton";
import PluginBlur from "@assets/autos/plugin-blur.png";
import OverflowTooltip from "@components/OverflowTooltip";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { ResultState } from "@store/result-status";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { useAppDispatch } from "@store/store.model";
import {
  AddedPlugins,
  PluginErrorMessage,
  PluginForAction,
  PluginStatus,
  addPlugin,
  updatePluginState
} from "@store/plugins/plugins.reducer";
import SuccessDialog from "@components/Dialog/SuccessPopup";

const PluginListItemNew = memo(
  ({
    plugin,
    holderReputation,
    canUpdateProfile,
    activate
  }: {
    plugin: any;
    holderReputation: number;
    canUpdateProfile: boolean;
    activate: any;
  }) => {
    const addedPlugins = useSelector(AddedPlugins);
    const status = useSelector(PluginStatus);
    const chosenPluginForAction = useSelector(PluginForAction);

    const isSamePlugin = useMemo(() => {
      const _id = chosenPluginForAction?.id;
      const id = plugin.id;

      return _id === id;
    }, [chosenPluginForAction, plugin]);

    const isLoading = useMemo(() => {
      return status === ResultState.Loading && isSamePlugin;
    }, [status, isSamePlugin]);

    const isActive = useMemo(() => {
      return addedPlugins.some(({ plugin: p }) => {
        const _id = p?.id;
        const id = plugin?.id;
        return _id === id;
      });
    }, [plugin, addedPlugins]);

    const isIdle = useMemo(() => {
      return !isLoading && !isActive;
    }, [status, isLoading, isActive]);
    const theme = useTheme();
    return (
      <Box
        sx={{
          display: "flex",
          border: "1px solid",
          borderColor: "#576176",
          minWidth: "170px",
          boxShadow: 3,
          borderRadius: "8.5px",
          padding: theme.spacing(3)
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "row"
              },
              justifyContent: {
                xs: "flex-start"
              },
              alignItems: "center"
            }}
          >
            {/* <Avatar
              sx={{
                width: {
                  xs: "40px",
                  md: "50px"
                },
                height: {
                  xs: "40px",
                  md: "50px"
                },
                borderRadius: "0"
              }}
              aria-label="hub-avatar"
              src={plugin.icon}
            /> */}
            <SvgIcon
              sx={{
                width: {
                  xs: "40px",
                  md: "50px"
                },
                height: {
                  xs: "40px",
                  md: "50px"
                },
                cursor: "pointer",
                background: "transparent",
                fill: "white"
              }}
              component={plugin.icon}
            />
            <Box
              sx={{
                marginLeft: {
                  xs: theme.spacing(3),
                  sm: theme.spacing(1),
                  md: theme.spacing(2),
                  xxl: theme.spacing(3)
                },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Typography variant="subtitle2" color="offWhite.main">
                {plugin.title}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: theme.spacing(3),
              justifyContent: "center",
              display: "flex"
            }}
          >
            {/* <Typography
              variant="caption"
              color="offWhite.main"
              textAlign="center"
            >
              {plugin.description}
            </Typography> */}

            <OverflowTooltip
              typography={{
                maxWidth: "240px",
                fontSize: "12px",
                fontWeight: "400",
                letterSpacing: "0.66px"
              }}
              maxLine={6}
              text={plugin?.description}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: theme.spacing(3)
            }}
          >
            {isActive ? (
              <AutOsButton
                type="button"
                disabled={true}
                sx={{
                  "&.MuiButton-root": {
                    background: "#4caf50",
                    "&.Mui-disabled": {
                      color: "white",
                      opacity: "1"
                    }
                  }
                }}
                variant="outlined"
              >
                <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
                  Activated
                </Typography>
              </AutOsButton>
            ) : (
              <>
                {holderReputation < plugin.reputation ? (
                  <Tooltip
                    disableHoverListener={false}
                    title={`Unlock at ${plugin.reputation} REP`}
                  >
                    <Box>
                      <AutOsButton
                        type="button"
                        disabled={true}
                        onClick={activate}
                        sx={{
                          "&.MuiButton-root": {
                            background: "#576176",
                            "&.Mui-disabled": {
                              color: "#818CA2",
                              opacity: "1"
                            }
                          }
                        }}
                        variant="outlined"
                      >
                        <Typography
                          fontWeight="700"
                          fontSize="16px"
                          lineHeight="26px"
                        >
                          Activate
                        </Typography>
                        <SvgIcon
                          sx={{
                            height: {
                              xs: "16px"
                            },
                            width: {
                              xs: "16px"
                            },

                            fill: "transparent"
                          }}
                          viewBox="0 0 16 16"
                          key={`activate-lock`}
                          component={KeyIcon}
                        />
                      </AutOsButton>
                    </Box>
                  </Tooltip>
                ) : (
                  <AutOsButton
                    type="button"
                    disabled={holderReputation < plugin.reputation}
                    onClick={activate}
                    sx={{
                      "&.MuiButton-root": {
                        background: "#576176",
                        "&.Mui-disabled": {
                          color: "#818CA2",
                          opacity: "1"
                        }
                      }
                    }}
                    variant="outlined"
                  >
                    <Typography
                      fontWeight="700"
                      fontSize="16px"
                      lineHeight="26px"
                    >
                      Activate
                    </Typography>
                  </AutOsButton>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
);
const PluginListItem = memo(
  ({
    plugin,
    holderReputation,
    canUpdateProfile,
    activate
  }: {
    plugin: any;
    holderReputation: number;
    canUpdateProfile: boolean;
    activate: any;
  }) => {
    const theme = useTheme();
    return (
      <Box
        sx={{
          display: "flex",
          minWidth: {
            xs: "240px",
            md: "280px"
          },
          height: "280px",
          padding: theme.spacing(3),
          background: `url(${PluginBlur}) lightgray 30% / cover no-repeat`
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              height: "50%"
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "row"
                },
                justifyContent: {
                  xs: "flex-start"
                }
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <Typography variant="subtitle2" color="offWhite.main">
                  {plugin.title}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                marginTop: theme.spacing(1)
              }}
            >
              <OverflowTooltip
                typography={{
                  maxWidth: "240px",
                  fontSize: "12px",
                  fontWeight: "400",
                  letterSpacing: "0.66px"
                }}
                maxLine={2}
                text={plugin?.description}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              height: "50%",
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            {holderReputation < plugin.reputation ? (
              <Tooltip
                disableHoverListener={false}
                title={`Unlock at ${plugin.reputation} REP`}
                sx={{}}
              >
                <Box>
                  <AutOsButton
                    type="button"
                    disabled={true}
                    onClick={activate}
                    color="primary"
                    variant="outlined"
                  >
                    <Typography
                      fontWeight="700"
                      fontSize="16px"
                      lineHeight="26px"
                    >
                      Activate
                    </Typography>
                    <SvgIcon
                      sx={{
                        height: {
                          xs: "16px"
                        },
                        width: {
                          xs: "16px"
                        },

                        fill: "transparent"
                      }}
                      viewBox="0 0 16 16"
                      key={`activate-lock`}
                      component={KeyIcon}
                    />
                  </AutOsButton>
                </Box>
              </Tooltip>
            ) : (
              <AutOsButton
                type="button"
                // disabled={holderReputation < plugin.reputation}
                disabled={true}
                onClick={activate}
                color="primary"
                variant="outlined"
              >
                <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
                  Activate
                </Typography>
              </AutOsButton>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
);

interface TableParamsParams {
  isLoading: boolean;
  plugins: any[];
}

const PluginList = ({ isLoading = false, plugins = [] }: TableParamsParams) => {
  const theme = useTheme();
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const holderData = useSelector(HolderData);
  //TODO: Replace when reputation is part of holder data;
  const holderReputation = 0;
  const dispatch = useAppDispatch();
  const status = useSelector(PluginStatus);
  const errorMessage = useSelector(PluginErrorMessage);
  const [successMessage, setSuccessMessage] = useState("");
  const [activateSuccess, setActivateSuccess] = useState(null);

  const handleDialogClose = () => {
    dispatch(
      updatePluginState({
        status: ResultState.Idle
      })
    );
  };

  const openDialog = (plugin) => {
    dispatch(
      updatePluginState({
        status: ResultState.Loading
      })
    );
    setTimeout(() => {
      setSuccessMessage(
        `The plugin ${plugin?.title} has been successfully activated!`
      );
      dispatch(
        updatePluginState({
          status: ResultState.Success
        })
      );
    }, 2000);
  };

  const activatePlugin = (plugin) => {
    dispatch(
      updatePluginState({
        plugin,
        status: ResultState.Loading
      })
    );
    setTimeout(() => {
      setActivateSuccess(true);
      dispatch(
        updatePluginState({
          status: ResultState.Idle,
          interaction: null
        })
      );
      dispatch(
        addPlugin({
          plugin
        })
      );
      setSuccessMessage(
        `The plugin ${plugin?.title} has been successfully activated!`
      );
      // if (interaction?.protocol === "Ethereum") {

      // } else {
      //   if (interaction?.protocol === "Ethereum") {
      //     setVerifySuccess(false);
      //     dispatch(
      //       updateInteractionState({
      //         interaction: null,
      //         status: ResultState.Failed,
      //         errorMessage:
      //           "Sorry, it seems like you have not completed this interaction yet!"
      //       })
      //     );
      //   }
      // }
    }, 2000);
  };

  return (
    <Box
      sx={{
        minWidth: {
          sm: "100%"
        },
        width: {
          xs: "100%",
          sm: "unset"
        },
        backgroundColor: "transparent",
        border: "none"
      }}
      component={Paper}
    >
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message={errorMessage}
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Loading}
        message="Activating plugin..."
      />
      <SuccessDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Success}
        message={successMessage}
        subtitle="Congratulations!"
      />
      <Box sx={{ display: "flex", my: theme.spacing(3) }}>
        <Typography color="offWhite.main" variant="h3">
          Plugins
        </Typography>
        <Typography
          color="offWhite.dark"
          variant="h3"
          fontWeight="normal"
          sx={{
            ml: theme.spacing(1)
          }}
        >{`(${plugins.length})`}</Typography>
      </Box>
      <Box
        className="swiper-no-swiping"
        sx={{
          minWidth: {
            xs: "unset",
            md: "700px"
          },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
            xxl: "1fr 1fr 1fr 1fr"
          },
          gap: theme.spacing(2)
        }}
      >
        {plugins?.map((plugin, index) => (
          <PluginListItemNew
            canUpdateProfile={canUpdateProfile}
            activate={() => activatePlugin(plugin)}
            key={`hub-row-${index}`}
            plugin={plugin}
            holderReputation={holderReputation}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PluginList;
