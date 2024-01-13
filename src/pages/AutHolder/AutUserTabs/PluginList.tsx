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
  Tooltip
} from "@mui/material";
import { memo, useState } from "react";
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
  PluginErrorMessage,
  PluginStatus,
  updatePluginState
} from "@store/plugins/plugins.reducer";
import SuccessDialog from "@components/Dialog/SuccessPopup";

const PluginListItem = memo(
  ({
    plugin,
    holderReputation,
    canUpdateProfile,
    openDialog
  }: {
    plugin: any;
    holderReputation: number;
    canUpdateProfile: boolean;
    openDialog: any;
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
                    onClick={openDialog}
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
                onClick={openDialog}
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
  const dispatch = useAppDispatch();
  const status = useSelector(PluginStatus);
  const errorMessage = useSelector(PluginErrorMessage);
  const [successMessage, setSuccessMessage] = useState("");

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

  const mockedHolderData = {
    ...holderData,
    holderReputation: 99
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
            md: "1fr 1fr 1fr"
          },
          gap: theme.spacing(2)
        }}
      >
        {plugins?.map((plugin, index) => (
          <PluginListItem
            canUpdateProfile={canUpdateProfile}
            openDialog={() => openDialog(plugin)}
            key={`nova-row-${index}`}
            plugin={plugin}
            holderReputation={mockedHolderData.holderReputation}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PluginList;
