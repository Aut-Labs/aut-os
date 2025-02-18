import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  SvgIcon,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import DiscordIcon from "@assets/SocialIcons/DiscordIcon.svg?react";
import GitHubIcon from "@assets/SocialIcons/GitHubIcon.svg?react";
import TwitterIcon from "@assets/SocialIcons/TwitterIcon.svg?react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { AutOsButton } from "./AutButton";
import CloseIcon from "@assets/autos/close-icon.svg?react";
import SocialCheckIcon from "@assets/autos/social-check.svg?react";

import { useAppDispatch } from "@store/store.model";
import { updateProfile } from "@api/data.api";
import { AutTextField } from "@theme/field-text-styles";
import { ipfsCIDToHttpUrl } from "@utils/ipfs";
import { base64toFile, toBase64 } from "@utils/to-base-64";
import AutOsFileUpload from "./Fields/AutOsFileUpload";
import { useOAuth, useOAuthSocials } from "@components/OAuth";
import { SelectedAutID } from "@store/aut/aut.reducer";
import { useSelector } from "react-redux";
import { AutOSAutID } from "@api/models/aut.model";

export interface EditDialogProps {
  title: string;
  description?: JSX.Element;
  open?: boolean;
  onClose?: () => void;
  hideCloseBtn?: boolean;
}

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "620px",
    height: "720px",
    border: "none",
    position: "relative",
    flexDirection: "column-reverse",
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

const SocialWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  width: "100%",
  alignItems: "flex-start",
  marginTop: theme.spacing(2)
}));

const SocialFieldWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  minWidth: "240px",
  height: "48px",
  border: "1.5px solid #576176 !important",
  borderRadius: "6px",
  background: "#2F3746",
  justifyContent: "space-between",
  alignItems: "center"
}));

const TextFieldWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column"
}));

const StyledTextField = styled(AutTextField)(({ theme }) => ({
  width: "100%",
  ".MuiInputBase-input": {
    fontSize: "16px",
    color: theme.palette.offWhite.main,
    "&::placeholder": {
      color: theme.palette.offWhite.main,
      opacity: 0.5
    },
    "&.Mui-disabled": {
      color: "#7C879D",
      textFillColor: "#7C879D"
    }
  },
  ".MuiInputBase-root": {
    caretColor: theme.palette.primary.main,
    fieldset: {
      border: "1.5px solid #576176 !important",
      borderRadius: "6px"
    },
    borderRadius: "6px",
    background: "#2F3746"
  },
  ".MuiInputLabel-root": {
    color: "#7C879D"
  }
}));

const FormWrapper = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  [theme.breakpoints.down("md")]: {
    width: `100%`
  },
  [theme.breakpoints.down("sm")]: {
    width: `100%`
  }
}));

export enum SocialLinkPrefixes {
  Discord = "https://discord.com/users/",
  X = "https://twitter.com/",
  GitHub = "https://github.com/"
}

function AutEditProfileDialog(props: EditDialogProps) {
  const { getAuthGithub, getAuthX, getAuthDiscord, authenticating } =
    useOAuthSocials();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useAppDispatch();
  const autID = useSelector(SelectedAutID);

  const socialIcons = {
    discord: DiscordIcon,
    github: GitHubIcon,
    twitter: TwitterIcon
  };

  const filteredSocials = autID?.properties?.socials.filter(
    (social) => social.type !== "telegram" && social.type !== "lensfrens"
  );

  function displaySocialUsername(value, field) {
    let prefix = "";

    switch (field.type) {
      case "discord":
        prefix = SocialLinkPrefixes.Discord;
        break;
      case "twitter":
        prefix = SocialLinkPrefixes.X;
        break;
      case "github":
        prefix = SocialLinkPrefixes.GitHub;
        break;
      default:
        return "";
    }

    return value.replace(prefix, "");
  }

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    setValue
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: autID.name,
      email: autID.properties.email,
      bio: autID.properties.bio,
      avatar: autID?.properties?.avatar,
      socials: filteredSocials
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "socials"
  });

  const beforeEdit = () => {
    // if (!isActive || !isConnected) {
    //   dispatch(setProviderIsOpen(true));
    // }
  };

  const onEditProfile = async (data: any) => {
    // const updatedSocials = data.socials.map((social) => {
    //   if (social.type === "discord") {
    //     return { link: "", type: "discord" };
    //   }
    //   return social;
    // });
    // // eslint-disable-next-line no-debugger
    await dispatch(
      updateProfile({
        ...autID,
        properties: {
          ...autID.properties,
          socials: data.socials,
          bio: data.bio,
          email: data.email,
          avatar: data.avatar
        }
      } as AutOSAutID)
    );
  };

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
          padding: "20px 30px"
        }}
      >
        <PerfectScrollbar
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            width: "100%"
          }}
        >
          <FormWrapper autoComplete="off" onSubmit={handleSubmit(beforeEdit)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Typography
                variant="caption"
                color="offWhite.main"
                mb={theme.spacing(1)}
              >
                Profile Photo
              </Typography>
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
                        flexDirection: "column"
                      }}
                    >
                      <AutOsFileUpload
                        color="offWhite"
                        initialPreviewUrl={ipfsCIDToHttpUrl(
                          autID?.properties?.avatar as string
                        )}
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
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: theme.spacing(2)
              }}
            >
              <TextFieldWrapper>
                <Typography
                  variant="caption"
                  color="offWhite.main"
                  mb={theme.spacing(1)}
                >
                  Name
                </Typography>
                <Controller
                  name="name"
                  control={control}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <>
                        <StyledTextField
                          color="offWhite"
                          name={name}
                          value={value}
                          onChange={onChange}
                          disabled
                          sx={{
                            height: "48px"
                          }}
                        />
                      </>
                    );
                  }}
                />
              </TextFieldWrapper>
              <TextFieldWrapper>
                <Typography
                  variant="caption"
                  color="offWhite.main"
                  mb={theme.spacing(1)}
                >
                  E-mail address
                </Typography>
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <>
                        <StyledTextField
                          color="offWhite"
                          name={name}
                          value={value}
                          onChange={onChange}
                          sx={{
                            height: "48px"
                          }}
                        />
                      </>
                    );
                  }}
                />
              </TextFieldWrapper>
              <TextFieldWrapper>
                <Typography
                  variant="caption"
                  color="offWhite.main"
                  mb={theme.spacing(1)}
                >
                  Bio
                </Typography>
                <Controller
                  name="bio"
                  control={control}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <>
                        <StyledTextField
                          color="offWhite"
                          rows="3"
                          multiline
                          name={name}
                          value={value}
                          onChange={onChange}
                        />
                      </>
                    );
                  }}
                />
              </TextFieldWrapper>
            </Box>
            <SocialWrapper>
              <Box
                sx={{
                  display: "grid",
                  gridGap: "20px",
                  width: "100%",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr"
                  }
                }}
              >
                {fields.map((field, index) => {
                  const AutIcon = socialIcons[Object.keys(socialIcons)[index]];
                  const social = Object.keys(socialIcons)[index];

                  return (
                    <Box key={`socials.${index}`}>
                      <Controller
                        key={`socials.${index}.link`}
                        name={`socials.${index}.link`}
                        control={control}
                        render={({ field: { name, value, onChange } }) => {
                          return (
                            <SocialFieldWrapper
                              onClick={() => {
                                if (field.type === "discord") {
                                  getAuthDiscord(
                                    async (data) => {
                                      const { access_token } = data;
                                      const response = await fetch(
                                        "https://discord.com/api/v10/users/@me",
                                        {
                                          headers: {
                                            Authorization: `Bearer ${access_token}`
                                          }
                                        }
                                      );
                                      const responseData =
                                        await response.json();
                                      const { username, id } = responseData;
                                      onChange(username);
                                      const fullLink = `${SocialLinkPrefixes.Discord}${username}`;
                                      setValue(
                                        `socials.${index}.link`,
                                        fullLink
                                      );
                                      setValue(`socials.${index}.metadata`, {
                                        userId: id,
                                        username
                                      });
                                    },
                                    () => {
                                      // setLoading(false);
                                    }
                                  );
                                }
                                if (field.type === "twitter") {
                                  getAuthX(
                                    async (data) => {
                                      const { access_token } = data;
                                      const response = await fetch(
                                        "https://api.twitter.com/1.1/account/verify_credentials.json",
                                        {
                                          headers: {
                                            Authorization: `Bearer ${access_token}`
                                          }
                                        }
                                      );
                                      const responseData =
                                        await response.json();
                                      const username = responseData.screen_name;
                                      onChange(username);
                                      const fullLink = `${SocialLinkPrefixes.X}${username}`;
                                      setValue(
                                        `socials.${index}.link`,
                                        fullLink
                                      );
                                    },
                                    () => {
                                      // setLoading(false);
                                    }
                                  );
                                }
                                if (field.type === "github") {
                                  getAuthGithub(
                                    async (data) => {
                                      const { access_token } = data;
                                      const response = await fetch(
                                        "https://api.github.com/user",
                                        {
                                          headers: {
                                            Authorization: `Bearer ${access_token}`
                                          }
                                        }
                                      );
                                      const responseData =
                                        await response.json();
                                      const username = responseData.login;
                                      onChange(username);
                                      const fullLink = `${SocialLinkPrefixes.GitHub}${username}`;
                                      setValue(
                                        `socials.${index}.link`,
                                        fullLink
                                      );
                                    },
                                    () => {
                                      // setLoading(false);
                                    }
                                  );
                                }
                              }}
                              sx={{ cursor: "pointer" }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <SvgIcon
                                  sx={{
                                    color: value
                                      ? theme.palette.offWhite.main
                                      : "#576176",
                                    ml: theme.spacing(2),
                                    mt: "5px"
                                  }}
                                  key={`socials.${index}.icon`}
                                  component={AutIcon}
                                />
                                <Box>
                                  <Typography
                                    fontSize="16px"
                                    color={
                                      value
                                        ? theme.palette.offWhite.main
                                        : "#576176"
                                    }
                                    sx={{
                                      ml: theme.spacing(1)
                                    }}
                                  >
                                    {value
                                      ? displaySocialUsername(value, field)
                                      : "connect"}
                                  </Typography>
                                  {value && (
                                    <Typography
                                      fontSize="12px"
                                      color="offWhite.dark"
                                      sx={{
                                        ml: theme.spacing(1),
                                        "&.MuiTypography-root": {
                                          fontSize: "12px"
                                        }
                                      }}
                                    >
                                      {social}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>

                              {value && (
                                <SvgIcon
                                  sx={{
                                    mr: theme.spacing(2)
                                  }}
                                  key={`socials.${index}.checkmark`}
                                  component={SocialCheckIcon}
                                ></SvgIcon>
                              )}
                            </SocialFieldWrapper>
                          );
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </SocialWrapper>
          </FormWrapper>
        </PerfectScrollbar>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          width: "100%",
          padding: "0px 30px",
          mt: {
            xs: "64px",
            md: "0"
          }
        }}
      >
        <Box
          sx={{
            width: {
              xs: "17%",
              md: "33%"
            }
          }}
        >
          <SvgIcon
            onClick={props.onClose}
            sx={{
              fill: "transparent",
              height: "30px",
              width: "30px",
              cursor: "pointer"
            }}
            component={CloseIcon}
          />
        </Box>

        <Box
          sx={{
            width: {
              xs: "50%",
              md: "33%"
            },
            justifyContent: "center",
            display: "flex"
          }}
        >
          <Typography
            variant="subtitle1"
            fontSize={{
              xs: "14px",
              md: "20px"
            }}
            color="offWhite.main"
            fontWeight="bold"
          >
            Edit Profile
          </Typography>
        </Box>
        <Box
          sx={{
            width: "33%",
            justifyContent: "flex-end",
            display: "flex"
          }}
        >
          <AutOsButton
            onClick={handleSubmit(onEditProfile)}
            type="button"
            color="primary"
            variant="outlined"
            sx={{
              width: "100px"
            }}
          >
            <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
              Update
            </Typography>
          </AutOsButton>
        </Box>
      </DialogActions>
    </AutStyledDialog>
  );
}

export default AutEditProfileDialog;
