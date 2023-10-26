/* eslint-disable no-constant-condition */
import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";

import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Stack,
  styled,
  SvgIcon,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { useState } from "react";
import PencilEdit from "@assets/PencilEditicon";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HolderData,
  HolderStatus,
  UpdateErrorMessage,
  updateHolderState,
  UpdateStatus
} from "@store/holder/holder.reducer";
import { CanUpdateProfile, IsConnected } from "@auth/auth.reducer";
import { ResultState } from "@store/result-status";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  BlockExplorerUrl,
  SelectedNetworkConfig,
  setProviderIsOpen
} from "@store/WalletProvider/WalletProvider";
import { EditContentElements } from "@components/EditContentElements";
import CommunitiesTable from "./CommunitiesTable";
import CopyAddress from "@components/CopyAddress";
import { socialUrls } from "@api/social.model";
import { base64toFile, toBase64 } from "@utils/to-base-64";
import AFileUpload from "@components/Fields/AutFileUpload";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch } from "@store/store.model";
import { useEthers } from "@usedapp/core";
import { updateProfile } from "@api/holder.api";
import { AutID } from "@aut-labs/sdk";
import { AutButtonVariant } from "@components/AutButton";
import { AutTextField } from "@theme/field-text-styles";

const IconContainer = styled("div")(({ theme }) => ({
  paddingTop: "15px",
  display: "flex",
  minHeight: "25px",
  height: "40px",

  [theme.breakpoints.down("md")]: {
    height: "35px",
    minHeight: "20px"
  }
}));

const AutCard = styled(Card)(({ theme }) => ({
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

const ImageUpload = styled("div")(({ theme }) => ({
  width: "150px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  textAlign: "center",
  [theme.breakpoints.down("xxl")]: {
    width: "150px"
  }
}));

const FollowWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "50%",
  justifyContent: "center"
}));

const EditIcon = styled("div")(({ theme }) => ({
  height: "30px",
  width: "30px",
  cursor: "pointer",
  paddingLeft: "10px",
  display: "flex",
  alignSelf: "flex-end",
  marginBottom: "5px",

  [theme.breakpoints.down("md")]: {
    height: "18px",
    width: "18px"
  }
}));

const { FieldWrapper, FormWrapper, BottomWrapper, TopWrapper, ContentWrapper } =
  EditContentElements;

const AutUserInfo = () => {
  const holderData = useSelector(HolderData);
  const holderStatus = useSelector(HolderStatus);
  const blockExplorer = useSelector(BlockExplorerUrl);
  const selectedNetwork = useSelector(SelectedNetworkConfig);
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const [isActiveIndex, setIsActiveIndex] = useState(null);
  const [inlineEditing, setInlineEditing] = useState(false);
  const [editInitiated, setEditInitiated] = useState(false);
  const dispatch = useAppDispatch();
  const status = useSelector(UpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);
  const isConnected = useSelector(IsConnected);
  const { active: isActive } = useEthers();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      avatar: holderData?.properties?.avatar,
      // eslint-disable-next-line max-len
      bio: "ĀutID are a new standard for self-sovereign Identities that do not depend from the provider, therefore, they are universal. They are individual NFT IDs."
    }
  });

  const values = watch();

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const socialIcons = {
    discord: DiscordIcon,
    github: GitHubIcon,
    twitter: TwitterIcon,
    telegram: TelegramIcon,
    lensfrens: LensfrensIcon
  };

  const onEditInfo = () => {
    setInlineEditing(!inlineEditing);
    return null;
  };
  const onEditSocials = () => {
    navigate({
      pathname: "edit-profile",
      search: location.search
    });
  };

  function clickRow(index, address: string) {
    if (CanUpdateProfile) {
      if (isActiveIndex === index) {
        setIsActiveIndex(null);
      } else {
        setIsActiveIndex(index);
      }
      navigate({
        pathname: `edit-community/${address}`,
        search: location.search
      });
    }
  }

  const beforeEdit = () => {
    setEditInitiated(true);
    if (!isActive || !isConnected) {
      dispatch(setProviderIsOpen(true));
    }
  };

  const onEditProfile = async (data: typeof values) => {
    await dispatch(
      updateProfile({
        ...holderData,
        // bio: data.bio,
        properties: {
          ...holderData?.properties,
          avatar: data.avatar
        }
      })
    );
    setEditInitiated(false);
  };

  const handleDialogClose = () => {
    dispatch(
      updateHolderState({
        status: ResultState.Idle
      })
    );
  };

  const selectedNetworkConfig = useSelector(SelectedNetworkConfig);

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
        message="Editing profile..."
      />

      {holderStatus === ResultState.Success ? (
        <Box
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flex: "1"
          }}
        >
          <Box
            sx={{
              paddingBottom: {
                xs: 3,
                md: 4,
                xxl: 6
              }
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Stack sx={{ width: "60%" }}>
                <AutCard
                  sx={{
                    border: "none",
                    display: "flex",
                    boxShadow: "none",
                    alignItems: "flex-start",
                    bgcolor: "transparent"
                  }}
                >
                  {inlineEditing ? (
                    <CardHeader
                      avatar={
                        <ImageUpload>
                          <Controller
                            name="avatar"
                            rules={{
                              validate: {
                                fileSize: (v) => {
                                  if (isDirty && v) {
                                    const file = base64toFile(v, "pic");
                                    if (!file) {
                                      return true;
                                    }
                                    return file.size < 8388608;
                                  }
                                }
                              }
                            }}
                            control={control}
                            render={({ field: { onChange } }) => {
                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "150px",
                                    width: "150px"
                                  }}
                                >
                                  <AFileUpload
                                    color="offWhite"
                                    // initialPreviewUrl={ipfsCIDToHttpUrl(
                                    //   holderData?.properties?.avatar as string
                                    // )}

                                    fileChange={async (file) => {
                                      if (file) {
                                        onChange(await toBase64(file));
                                      } else {
                                        onChange(null);
                                      }
                                    }}
                                    // errors={errors}
                                  />
                                </div>
                              );
                            }}
                          />
                        </ImageUpload>
                      }
                      sx={{ alignSelf: "flex-start" }}
                    ></CardHeader>
                  ) : (
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{
                            bgcolor: "background.default",
                            height: {
                              xs: "150px",
                              xxl: "150px"
                            },
                            width: {
                              xs: "150px",
                              xxl: "150px"
                            },
                            borderRadius: 0
                          }}
                          aria-label="avatar"
                          src={ipfsCIDToHttpUrl(
                            holderData?.properties?.avatar as string
                          )}
                        />
                      }
                    />
                  )}
                  <CardContent
                    sx={{
                      ml: {
                        xs: "0",
                        sm: "30px"
                      },
                      mr: {
                        xs: "0",
                        sm: "30px"
                      },
                      alignSelf: "center",
                      // height: {
                      //   xs: "100px",
                      //   md: "150px"
                      // },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          marginBottom: "5px"
                        }}
                      >
                        <Typography
                          color="white"
                          textAlign="left"
                          lineHeight={1}
                          variant="h3"
                        >
                          {holderData.name}
                        </Typography>
                        {canUpdateProfile && (
                          <Tooltip title="Edit profile">
                            <EditIcon onClick={onEditInfo}>
                              <PencilEdit />
                            </EditIcon>
                          </Tooltip>
                        )}
                      </div>

                      <Stack direction="row" alignItems="center">
                        <CopyAddress
                          address={holderData?.properties?.address}
                        />
                        {selectedNetworkConfig?.name && (
                          <Tooltip
                            title={`Explore in ${selectedNetworkConfig?.name}`}
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
                      </Stack>

                      {/* <ExternalUrl
                    href={`${blockExplorer}/address/${holderData?.properties?.address}`}
                    target="_blank"
                  >
                    <Typography
                      variant="subtitle2"
                      color="white"
                      fontWeight="normal"
                    >
                      {trimAddress(holderData.properties.address)}
                    </Typography>
                  </ExternalUrl> */}

                      {/* {holderData.properties.ethDomain && (
                    <Typography
                      variant="subtitle2"
                      color="white"
                      textAlign="left"
                      sx={{
                        textDecoration: "underline",
                        wordBreak: "break-all"
                      }}
                    >
                      {holderData.properties.ethDomain}
                    </Typography>
                  )} */}
                    </div>

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
                                  color: theme.palette.offWhite.main
                                }
                              }
                            })}
                            {...((!social.link ||
                              social.link ===
                                socialUrls[social.type].prefix) && {
                              sx: {
                                display: "none",
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
                      })}
                    </IconContainer>
                    {inlineEditing ? (
                      <Box sx={{ height: "40px", mt: 1 }}>
                        <AutButtonVariant onClick={onEditSocials}>
                          Add Socials
                        </AutButtonVariant>
                      </Box>
                    ) : (
                      <Box sx={{ height: "40px", mt: 1 }}></Box>
                    )}
                  </CardContent>
                </AutCard>
                <Box
                  sx={{
                    paddingBottom: {
                      xs: 3,
                      md: 4,
                      xxl: 6
                    }
                  }}
                >
                  <Typography
                    color="white"
                    textAlign="left"
                    variant="h3"
                    sx={{ my: 2 }}
                  >
                    {canUpdateProfile ? "Your Bio" : "Bio"}
                  </Typography>
                  {inlineEditing ? (
                    <Controller
                      key="bio"
                      name="bio"
                      control={control}
                      render={({ field: { name, value, onChange } }) => {
                        return (
                          <>
                            <AutTextField
                              variant="outlined"
                              color="offWhite"
                              multiline
                              id={name}
                              name={name}
                              value={value}
                              onChange={onChange}
                              sx={{
                                width: "100%",
                                mb: "15px",
                                mr: "15px"
                              }}
                            />
                          </>
                        );
                      }}
                    />
                  ) : (
                    <Box sx={{ padding: "16.5px 0px" }}>
                      <Typography color="white" textAlign="left" variant="body">
                        {holderData?.description ||
                          // eslint-disable-next-line max-len
                          "Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here Your bio here "}
                      </Typography>
                    </Box>
                  )}
                  {inlineEditing ? (
                    <Box
                      sx={{
                        width: "100%",
                        alignItems: "flex-end",
                        display: "flex",
                        justifyContent: "flex-end"
                      }}
                    >
                      <AutButtonVariant onClick={onEditProfile}>
                        Save
                      </AutButtonVariant>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
              </Stack>
              <Box
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
                    <FollowWrapper>
                      <Typography
                        variant="subtitle1"
                        color="white"
                        fontWeight="bold"
                      >
                        200
                      </Typography>
                      <Typography variant="caption" color="white">
                        Followers
                      </Typography>
                    </FollowWrapper>
                    <FollowWrapper>
                      <Typography
                        variant="subtitle1"
                        color="white"
                        fontWeight="bold"
                      >
                        200
                      </Typography>
                      <Typography variant="caption" color="white">
                        Following
                      </Typography>
                    </FollowWrapper>
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
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography color="white" textAlign="left" variant="h3">
              {canUpdateProfile ? "Your Novæ" : "Novæ"}
            </Typography>
          </Box>
          <CommunitiesTable
            communities={holderData.properties.communities}
            isLoading={false}
          />
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
          Oops, it looks like we don't support this network yet.
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
  );
};

export default AutUserInfo;
