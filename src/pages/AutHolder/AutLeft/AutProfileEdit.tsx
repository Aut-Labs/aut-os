import { ReactComponent as PersonIcon } from "@assets/PersonIcon.svg";
import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";
import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import { AutTextField } from "@components/Fields/AutFields";
import AFileUpload from "@components/Fields/AutFileUpload";
import {
  Box,
  styled,
  SvgIcon,
  Typography,
  useMediaQuery,
  InputAdornment,
  useTheme
} from "@mui/material";
import { pxToRem } from "@utils/text-size";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { AutButton } from "@components/AutButton";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HolderData,
  UpdateErrorMessage,
  updateHolderState,
  UpdateStatus
} from "@store/holder/holder.reducer";
import { useAppDispatch } from "@store/store.model";
import { updateProfile } from "@api/holder.api";
import { AutID, socialUrls } from "@api/aut.model";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { ResultState } from "@store/result-status";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { base64toFile, toBase64 } from "@utils/to-base-64";
import {
  IsConnected,
  setProviderIsOpen
} from "@store/WalletProvider/WalletProvider";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { EditContentElements } from "@components/EditContentElements";

const socialIcons = {
  // eth: EthIcon,
  discord: DiscordIcon,
  github: GitHubIcon,
  telegram: TelegramIcon,
  twitter: TwitterIcon,
  lensfrens: LensfrensIcon
};

const MiddleWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: "1",
  justifyContent: "flex-start",
  flexDirection: "row",
  width: "100%",
  alignItems: "flex-start",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column-reverse",
    justifyContent: "flex-end"
  }
}));

const LeftWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "70%",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  [theme.breakpoints.down("lg")]: {
    width: "100%"
  }
}));

const RightWrapper = styled("div")(({ theme }) => ({
  width: "30%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  alignSelf: "flex-start",
  [theme.breakpoints.down("lg")]: {
    justifyContent: "center",
    alignItems: "center",
    justifyItems: "center",
    alignContent: "center",
    width: "100%",
    marginBottom: pxToRem(30)
  }
}));

const ImageUpload = styled("div")(() => ({
  width: pxToRem(160),
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  textAlign: "center"
}));

const { FieldWrapper, FormWrapper, BottomWrapper, TopWrapper } =
  EditContentElements;

const AutProfileEdit = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const holderData = useSelector(HolderData);
  const status = useSelector(UpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);
  const isConnected = useSelector(IsConnected);
  const [editInitiated, setEditInitiated] = useState(false);
  const { isActive } = useWeb3React();

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
      <TopWrapper>
        <Typography
          fontSize={pxToRem(40)}
          textTransform="uppercase"
          color="background.paper"
          textAlign="left"
        >
          Edit your profile
        </Typography>
      </TopWrapper>
      <MiddleWrapper>
        <LeftWrapper>
          <FieldWrapper>
            <SvgIcon
              sx={{
                height: pxToRem(34),
                width: pxToRem(31),
                mr: pxToRem(20)
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
                fontSize={pxToRem(20)}
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
          </FieldWrapper>
          {fields.map((_, index) => {
            const AutIcon = socialIcons[Object.keys(socialIcons)[index]];
            const { prefix, hidePrefix, placeholder } =
              socialUrls[Object.keys(socialUrls)[index]];

            return (
              <FieldWrapper key={`socials.${index}`}>
                <SvgIcon
                  sx={{
                    height: pxToRem(34),
                    width: pxToRem(34),
                    mt: pxToRem(10),
                    mr: pxToRem(20)
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
                          placeholder={placeholder}
                          focused
                          id={name}
                          name={name}
                          value={value}
                          width="80%"
                          autoFocus={index === 0}
                          onChange={onChange}
                          sx={{
                            mb: pxToRem(45)
                          }}
                          InputProps={{
                            startAdornment: !hidePrefix && (
                              <InputAdornment position="start">
                                <p
                                  style={{
                                    color: "white",
                                    marginRight: "-5px"
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
        <RightWrapper>
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
                      name="image"
                      errors={errors}
                    />
                  </div>
                );
              }}
            />
          </ImageUpload>
        </RightWrapper>
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
          sx={{
            width: desktop ? pxToRem(250) : pxToRem(150),
            height: pxToRem(50),
            marginLeft: pxToRem(50)
          }}
          type="submit"
          color="primary"
          variant="outlined"
          disabled={!isDirty || !isValid}
        >
          Save
        </AutButton>
      </BottomWrapper>
    </FormWrapper>
  );
};

export default AutProfileEdit;
