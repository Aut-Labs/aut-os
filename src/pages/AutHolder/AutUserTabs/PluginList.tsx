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
import { memo } from "react";
import { useSelector } from "react-redux";
import { HolderData } from "@store/holder/holder.reducer";
import { CanUpdateProfile } from "@auth/auth.reducer";
import { AutOsButton } from "@components/AutButton";
import PluginBlur from "@assets/autos/plugin-blur.png";
import OverflowTooltip from "@components/OverflowTooltip";

const NetworkListItem = memo(
  ({
    plugin,
    holderReputation,
    holderXp,
    canUpdateProfile
  }: {
    plugin: any;
    holderReputation: number;
    holderXp: number;
    canUpdateProfile: boolean;
  }) => {
    const theme = useTheme();
    return (
      <Box
        sx={{
          display: "flex",
          border: "1px solid",
          borderColor: "#576176",
          minWidth: "240px",
          padding: theme.spacing(3)
        }}
      >
        <Box
          sx={{
            height: "100%",
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
              }
            }}
          >
            <Avatar
              sx={{
                bgcolor: "purple",
                width: {
                  xs: "72px",
                  xxl: "72px"
                },
                height: {
                  xs: "72px",
                  xxl: "72px"
                },
                borderRadius: "0"
              }}
              aria-label="nova-avatar"
              src={ipfsCIDToHttpUrl(plugin.image as string)}
            />
            <Box
              sx={{
                marginLeft: theme.spacing(3),
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Typography variant="subtitle2" color="offWhite.main">
                {plugin.title}
              </Typography>
              <Typography variant="caption" color="offWhite.dark">
                {plugin.type}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: theme.spacing(3)
            }}
          >
            <Typography variant="caption" color="offWhite.main">
              {plugin.description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              marginTop: theme.spacing(3)
            }}
          >
            <AutOsButton
              type="button"
              disabled={holderXp < plugin.xp}
              color="primary"
              variant="outlined"
            >
              <Typography fontWeight="700" fontSize="16px" lineHeight="26px">
                Activate
              </Typography>
              {holderXp < plugin.xp && (
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
              )}
            </AutOsButton>
            {holderXp < plugin.xp && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  ml: theme.spacing(2)
                }}
              >
                <Typography
                  fontWeight="400"
                  fontSize="16px"
                  color="offWhite.main"
                >
                  Unlock at
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end"
                  }}
                >
                  <Typography
                    fontFamily="FractulAltBold"
                    fontSize="24px !important"
                    lineHeight="24px"
                    color="offWhite.main"
                  >
                    {plugin.xp}
                  </Typography>
                  <Typography fontSize="18px !important" color="offWhite.main">
                    REP
                  </Typography>
                </Box>
              </Box>
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
    canUpdateProfile
  }: {
    plugin: any;
    holderReputation: number;
    canUpdateProfile: boolean;
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
                title={`Unlock at ${plugin.xp} REP`}
                sx={{}}
              >
                <Box>
                  <AutOsButton
                    type="button"
                    disabled={holderReputation < plugin.reputation}
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
                disabled={holderReputation < plugin.reputation}
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
