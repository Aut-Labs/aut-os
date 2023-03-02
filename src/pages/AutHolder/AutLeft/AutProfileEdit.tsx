import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";
import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import AFileUpload from "@components/Fields/AutFileUpload";
import {
  Box,
  styled,
  SvgIcon,
  Typography,
  useMediaQuery,
  InputAdornment,
  useTheme,
  Button,
  CardHeader,
  CardContent,
  Card
} from "@mui/material";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  HolderData,
  UpdateErrorMessage,
  updateHolderState,
  UpdateStatus
} from "@store/holder/holder.reducer";
import { useAppDispatch } from "@store/store.model";
import { updateProfile } from "@api/holder.api";
import { AutID } from "@api/aut.model";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { ResultState } from "@store/result-status";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { base64toFile, toBase64 } from "@utils/to-base-64";
import {
  IsConnected,
  setProviderIsOpen
} from "@store/WalletProvider/WalletProvider";
import { useEffect, useState } from "react";
import { EditContentElements } from "@components/EditContentElements";
import { AutTextField } from "@theme/field-text-styles";
import { socialUrls } from "@api/social.model";
import { useNavigate } from "react-router-dom";
import { useEthers } from "@usedapp/core";

const socialIcons = {
  // eth: EthIcon,
  discord: DiscordIcon,
  github: GitHubIcon,
  telegram: TelegramIcon,
  twitter: TwitterIcon,
  lensfrens: LensfrensIcon
};

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

const MiddleWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: "1",
  justifyContent: "flex-start",
  flexDirection: "column",
  width: "100%",
  alignItems: "flex-start"
}));

const LeftWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  maxWidth: "600px",
  paddingTop: "30px",
  justifyContent: "flex-start",
  alignItems: "flex-start"
}));

const ImageUpload = styled("div")(({ theme }) => ({
  width: "150px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  textAlign: "center",
  [theme.breakpoints.down("md")]: {
    width: "100px"
  }
}));

const { FieldWrapper, FormWrapper, BottomWrapper, TopWrapper } =
  EditContentElements;

const AutProfileEdit = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const holderData = useSelector(HolderData);
  const status = useSelector(UpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);
  const isConnected = useSelector(IsConnected);
  const [editInitiated, setEditInitiated] = useState(false);
  const { active: isActive } = useEthers();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      image: holderData?.properties?.avatar,
      socials: (holderData?.properties?.socials || []).map((social) => {
        return {
          ...social,
          link: (social.link as string).replace(
            socialUrls[social.type].prefix,
            ""
          )
        };
      })
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "socials"
  });

  const values = watch();

  const beforeEdit = () => {
    setEditInitiated(true);
    if (!isActive || !isConnected) {
      dispatch(setProviderIsOpen(true));
    }
  };

  const onEditProfile = (data: typeof values) => {
    dispatch(
      updateProfile({
        ...holderData,
        properties: {
          ...holderData.properties,
          socials: data.socials,
          avatar: data.image
        }
      } as AutID)
    );
  };

  const handleDialogClose = () => {
    dispatch(
      updateHolderState({
        status: ResultState.Idle
      })
    );
  };

  useEffect(() => {
    if (!editInitiated || !isActive || !isConnected) {
      return;
    }
    onEditProfile(values);
  }, [isActive, isConnected, editInitiated]);

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

      <MiddleWrapper>
        <Box
          sx={{
            paddingBottom: {
              xs: "30px",
              md: "50px"
            },
            display: "flex"
          }}
        >
          <AutCard
            sx={{ bgcolor: "transparent", border: "none", boxShadow: "none" }}
          >
            <CardHeader
              avatar={
                <ImageUpload>
                  <Controller
                    name="image"
                    rules={{
                      required: true,
                      validate: {
                        fileSize: (v) => {
                          if (isDirty && v) {
                            const file = base64toFile(v, "pic");
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
                          <AFileUpload
                            color="offWhite"
                            initialPreviewUrl={ipfsCIDToHttpUrl(
                              holderData?.properties?.avatar as string
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
                </ImageUpload>
              }
              sx={{ alignSelf: "flex-start" }}
            ></CardHeader>
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
                height: {
                  xs: "100px",
                  md: "150px"
                },
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
                    {holderData?.name}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </AutCard>
        </Box>

        <Typography variant="h3" color="white" textAlign="left">
          Edit your profile
        </Typography>
        <LeftWrapper>
          {/* <FieldWrapper>
            <SvgIcon
              sx={{
                height: pxToRem(34),
                width: pxToRem(31),
                mr: "20px"
              }}
              component={PersonIcon}
            />
            <div
              style={{
                padding: "0",
                height: pxToRem(50),
                display: "flex",
                minWidth: "0",
                margin: "0",
                border: "0",
                verticalAlign: "top",
                width: "80%"
              }}
            >
              <Typography
                fontSize={"20px"}
                sx={{
                  padding: "0 14px",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center"
                }}
                color="background.paper"
                textAlign="left"
              >
                {holderData?.name}
              </Typography>
            </div>
          </FieldWrapper> */}
          {fields.map((_, index) => {
            const AutIcon = socialIcons[Object.keys(socialIcons)[index]];
            const { prefix, hidePrefix, placeholder } =
              socialUrls[Object.keys(socialUrls)[index]];

            return (
              <FieldWrapper key={`socials.${index}`}>
                <SvgIcon
                  sx={{
                    color: "offWhite.main",
                    // height: {
                    //   xs: "34px"
                    // },
                    // width: {
                    //   xs: "34px"
                    // },
                    mt: "10px",
                    mr: "20px"
                  }}
                  key={`socials.${index}.icon`}
                  component={AutIcon}
                />
                <Controller
                  key={`socials.${index}.link`}
                  name={`socials.${index}.link`}
                  control={control}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <>
                        <AutTextField
                          variant="standard"
                          color="offWhite"
                          placeholder={placeholder}
                          id={name}
                          name={name}
                          value={value}
                          autoFocus={index === 0}
                          onChange={onChange}
                          sx={{
                            width: "100%",
                            mb: "15px"
                          }}
                          InputProps={{
                            startAdornment: !hidePrefix && (
                              <InputAdornment position="start">
                                <p
                                  style={{
                                    color: "white"
                                  }}
                                >
                                  {prefix}
                                </p>
                              </InputAdornment>
                            )
                          }}
                        />
                      </>
                    );
                  }}
                />
              </FieldWrapper>
            );
          })}
        </LeftWrapper>
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
    </FormWrapper>
  );
};

export default AutProfileEdit;
