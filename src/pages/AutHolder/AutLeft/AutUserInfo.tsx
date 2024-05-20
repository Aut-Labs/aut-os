/* eslint-disable max-len */
/* eslint-disable no-constant-condition */
import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";

import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import { ReactComponent as CalendarCheckIcon } from "@assets/autos/calendar-check.svg";

import {
  Avatar,
  Box,
  IconButton,
  Link,
  Stack,
  styled,
  SvgIcon,
  Tooltip,
  Typography
} from "@mui/material";
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  HolderData,
  HolderStatus,
  UpdateErrorMessage,
  updateHolderState,
  UpdateStatus
} from "@store/holder/holder.reducer";
import { CanUpdateProfile } from "@auth/auth.reducer";
import { ResultState } from "@store/result-status";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  BlockExplorerUrl,
  SelectedNetwork
} from "@store/WalletProvider/WalletProvider";
import { EditContentElements } from "@components/EditContentElements";
import CopyAddress from "@components/CopyAddress";
import { socialUrls } from "@api/social.model";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@store/store.model";
import { AutOsButton } from "@components/AutButton";
import { parseTimestamp } from "@utils/date-format";
import AutUserTabs from "../AutUserTabs/AutUserTabs";
import { SubtitleWithInfo } from "@components/SubtitleWithInfoIcon";
import { IsEditingProfile, setOpenEditProfile } from "@store/ui-reducer";
import { AutEditProfileDialog } from "@components/AutEditProfileDialog";
import AutBadge3DSceneDialog from "./3DBadge";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import AutBadge2DDialog from "./2DBadge";
// import VisibilityIcon from "@mui/icons-material/Visibility";

export const IconContainer = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "25px",
  height: "40px",

  [theme.breakpoints.down("md")]: {
    height: "35px",
    minHeight: "20px"
  }
}));

const FollowWrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "150px",
  justifyContent: "center"
}));

export const socialIcons = {
  discord: DiscordIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  lensfrens: LensfrensIcon
};
const { FormWrapper } = EditContentElements;

const AutUserInfo = () => {
  const holderData = useSelector(HolderData);
  const holderStatus = useSelector(HolderStatus);
  const { connections } = useSelector((state: any) => state.ui);
  const blockExplorer = useSelector(BlockExplorerUrl);
  const selectedNetwork = useSelector(SelectedNetwork);
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const [view3DModel, setView3DModel] = useState(false);
  const [viewCard, setViewCard] = useState(false);
  const dispatch = useAppDispatch();
  const status = useSelector(UpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);
  const isEditingProfile = useSelector(IsEditingProfile);
  const parsedTimeStamp = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit"
    }).format(parseTimestamp(holderData?.properties?.timestamp));
  }, [holderData]);

  const { handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      avatar: holderData?.properties?.avatar,
      // eslint-disable-next-line max-len
      bio:
        holderData?.properties?.bio ||
        "ĀutID are a new standard for self-sovereign Identities that do not depend from the provider, therefore, they are universal. They are individual NFT IDs."
    }
  });

  // const theme = useTheme();

  const beforeEdit = () => {
    // if (!isConnected) {
    //   dispatch(setProviderIsOpen(true));
    // }
  };

  const handleDialogClose = () => {
    dispatch(
      updateHolderState({
        status: ResultState.Idle
      })
    );
    dispatch(setOpenEditProfile(false));
  };

  const handleClose = () => {
    dispatch(setOpenEditProfile(false));
  };

  const openEditProfileModal = () => {
    dispatch(setOpenEditProfile(true));
  };

  return (
    <>
      <AutEditProfileDialog
        open={isEditingProfile}
        hideCloseBtn={false}
        title="Edit Profile"
        onClose={handleClose}
      />

      {holderData.image && typeof holderData.image == "string" && (
        <AutBadge3DSceneDialog
          open={view3DModel}
          onClose={() => setView3DModel(false)}
          url={ipfsCIDToHttpUrl(holderData.image)}
        />
      )}

      <AutBadge2DDialog
        open={viewCard}
        onClose={() => setViewCard(false)}
        url={ipfsCIDToHttpUrl(holderData?.image as string)}
      />
      <FormWrapper autoComplete="off" onSubmit={handleSubmit(beforeEdit)}>
        <ErrorDialog
          handleClose={handleDialogClose}
          open={status === ResultState.Failed}
          message={errorMessage}
        />
        <LoadingDialog
          handleClose={handleDialogClose}
          open={status === ResultState.Loading}
          message="Editing profile..."
        />

        {holderStatus === ResultState.Success ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row"
              },
              flex: "1",
              gap: {
                xs: "10px",
                md: "30px",
                xxl: "40px"
              }
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "100%",
                  md: "30%"
                },
                padding: "24px",
                borderRadius: "72px",
                background: "rgba(240, 245, 255, 0.01)",
                backdropFilter: "blur(12px)",
                height: "fit-content"
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Stack>
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
                        width: {
                          xs: "150px",
                          md: "160px",
                          xxl: "160px"
                        },
                        borderRadius: "50%"
                      }}
                      aria-label="avatar"
                      src={ipfsCIDToHttpUrl(
                        holderData?.properties?.thumbnailAvatar as string
                      )}
                    />
                    {holderData?.image &&
                      typeof holderData.image == "string" && (
                        <Box
                          onClick={() => setView3DModel(true)}
                          sx={{
                            position: "absolute",
                            cursor: "pointer",
                            bottom: "-20px",
                            left: "100px",
                            transform: "rotate(7deg)",
                            height: {
                              xs: "130px",
                              md: "140px",
                              xxl: "140px"
                            }
                          }}
                        >
                          <img
                            style={{
                              height: "100%",
                              width: "100%"
                            }}
                            aria-label="card"
                            src={ipfsCIDToHttpUrl(holderData?.image as string)}
                          />
                        </Box>
                      )}
                  </Stack>

                  <Stack
                    sx={{
                      marginTop: 3
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
                          {holderData.name}{" "}
                          {/* <Tooltip title="View you 3D NFT Badge">
                            <IconButton
                              sx={{ p: 0, ml: 1 }}
                              color="primary"
                              type="button"
                              onClick={() => setView3DModel(true)}
                            >
                              <ViewInArIcon
                                sx={{ cursor: "pointer", fontSize: "30px" }}
                              />
                            </IconButton>
                          </Tooltip> */}
                        </Typography>
                      </div>

                      <Stack
                        sx={{
                          marginTop: 3
                        }}
                        direction="row"
                        alignItems="center"
                      >
                        <CopyAddress
                          address={holderData?.properties?.address}
                        />
                        {selectedNetwork?.name && (
                          <Tooltip
                            title={`Explore in ${selectedNetwork?.name}`}
                          >
                            <IconButton
                              sx={{ p: 0, ml: 1 }}
                              href={`${blockExplorer}/address/${holderData?.properties?.address}`}
                              target="_blank"
                              color="offWhite"
                            >
                              <OpenInNewIcon
                                sx={{ cursor: "pointer", width: "20px" }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canUpdateProfile && (
                          <AutOsButton
                            onClick={openEditProfileModal}
                            type="button"
                            color="primary"
                            variant="outlined"
                            sx={{
                              ml: 3
                            }}
                          >
                            <Typography
                              fontWeight="700"
                              fontSize="16px"
                              lineHeight="26px"
                            >
                              Edit Profile
                            </Typography>
                          </AutOsButton>
                        )}
                      </Stack>
                    </div>
                  </Stack>

                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      alignContent: "flex-start",
                      marginTop: 3
                    }}
                  >
                    <FollowWrapper>
                      {/* TODO: Provide correct reputation from holderData and implement color rules */}
                      <Typography
                        variant="subtitle1"
                        color="offWhite.main"
                        fontSize="24px"
                        fontWeight="bold"
                      >
                        100
                      </Typography>
                      <SubtitleWithInfo
                        title="reputation"
                        description={
                          canUpdateProfile
                            ? "This is your reputation"
                            : `This is ${holderData?.name}'s reputation`
                        }
                      ></SubtitleWithInfo>
                    </FollowWrapper>
                    <FollowWrapper>
                      {/* TODO: Provide correct number of connections from holderData */}

                      <Typography
                        variant="subtitle1"
                        fontSize="24px"
                        color="offWhite.main"
                        fontWeight="bold"
                      >
                        {connections}
                      </Typography>
                      <SubtitleWithInfo
                        title="connections"
                        description={null}
                      ></SubtitleWithInfo>
                    </FollowWrapper>
                    {/* <FollowWrapper>
                      <Typography
                        variant="subtitle1"
                        fontSize="24px"
                        color="offWhite.main"
                        fontWeight="bold"
                        position="relative"
                      >
                        200
                        <Tooltip title="View Interactions">
                          <IconButton
                            sx={{
                              ml: 1,
                              position: "absolute"
                            }}
                            color="offWhite"
                            size="small"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <SubtitleWithInfo
                        title="interactions"
                        description=""
                      ></SubtitleWithInfo>
                    </FollowWrapper> */}
                  </Stack>

                  <Box
                    sx={{
                      marginTop: 2
                    }}
                  >
                    <Box sx={{ padding: "16.5px 0px" }}>
                      <Typography
                        color="offWhite.main"
                        textAlign="left"
                        variant="body"
                      >
                        {holderData?.properties?.bio || "No bio yet..."}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      marginTop: 2
                    }}
                  >
                    <IconContainer>
                      {holderData?.properties.socials.map((social, index) => {
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
                                  color: (theme) => theme.palette.offWhite.main
                                }
                              }
                            })}
                            {...((!social.link ||
                              social.link ===
                                socialUrls[social.type].prefix) && {
                              sx: {
                                display: "none",
                                svg: {
                                  color: (theme) => theme.palette.divider
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
                      })}
                    </IconContainer>
                  </Box>
                  <Box
                    sx={{
                      marginTop: 2,
                      display: "flex"
                    }}
                  >
                    <SvgIcon
                      sx={{
                        height: {
                          xs: "20px",
                          xxl: "20px"
                        },
                        width: {
                          xs: "20px",
                          xxl: "20px"
                        },
                        fill: "transparent"
                      }}
                      key={"joined-on"}
                      component={CalendarCheckIcon}
                    />
                    <Typography
                      color="offWhite.main"
                      textAlign="left"
                      variant="caption"
                    >
                      {`Joined ${parsedTimeStamp}`}
                    </Typography>
                  </Box>
                </Stack>
                {/* <Box
                sx={{
                  height: "300px",
                  width: "300px",
                  border: "2px solid white",
                  borderRadius: "16px",
                  ml: 4
                }}
              >
                <Box
                  sx={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-evenly"
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="white"
                    textAlign="center"
                  >
                    Your Connection
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >

                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      mt: 4
                    }}
                  >
                    <Typography
                      variant="body"
                      color="white"
                      textAlign="center"
                      sx={{ mb: 2 }}
                    >
                      Get embed code here Get embed code here Get embed code
                      here Get embed code here
                    </Typography>
                    <Box sx={{ alignSelf: "center" }}>
                      <AutButtonVariant>Get Code</AutButtonVariant>
                    </Box>
                  </Box>
                </Box>
              </Box> */}
              </Box>
            </Box>

            {/* <Box>
            <Typography color="white" textAlign="left" variant="h3">
              {canUpdateProfile ? "Your Hubs" : "Hubs"}
            </Typography>
          </Box> */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  md: "70%"
                }
              }}
            >
              {/* TODO: Revert hardcoded community name and description */}
              <AutUserTabs novas={holderData.properties.communities} />
              {/* <CommunitiesTable
              communities={holderData.properties.communities}
              isLoading={false}
            /> */}
            </Box>
          </Box>
        ) : !selectedNetwork ? (
          <Typography
            variant="h3"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              mb: "10px",
              color: "white",
              position: "absolute",
              transform: "translate(-50%, -50%)",
              left: "50%",
              top: "50%"
            }}
          >
            Oops, something went wrong getting this AutID. Refresh the page to
            try again.
          </Typography>
        ) : (
          <Typography
            variant="h3"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              mb: "10px",
              color: "white",
              position: "absolute",
              transform: "translate(-50%, -50%)",
              left: "50%",
              top: "50%"
            }}
          >
            This āutID hasn't been claimed yet.
          </Typography>
        )}
      </FormWrapper>
    </>
  );
};

export default memo(AutUserInfo);
