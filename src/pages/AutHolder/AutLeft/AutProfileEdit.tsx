import { ReactComponent as EthIcon } from '@assets/EthIcon.svg';
import { ReactComponent as PersonIcon } from '@assets/PersonIcon.svg';
import { ReactComponent as DiscordIcon } from '@assets/SocialIcons/DiscordIcon.svg';
import { ReactComponent as GitHubIcon } from '@assets/SocialIcons/GitHubIcon.svg';
import { ReactComponent as LensfrensIcon } from '@assets/SocialIcons/LensfrensIcon.svg';
import { ReactComponent as TelegramIcon } from '@assets/SocialIcons/TelegramIcon.svg';
import { ReactComponent as TwitterIcon } from '@assets/SocialIcons/TwitterIcon.svg';
import { AutTextField } from '@components/Fields/AutFields';
import AFileUpload from '@components/Fields/AutFileUpload';
import { Box, styled, SvgIcon, Typography, useMediaQuery, InputAdornment } from '@mui/material';
import { pxToRem } from '@utils/text-size';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { toBase64 } from 'sw-web-shared';
import { AutButton } from '@components/AutButton';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HolderData, UpdateErrorMessage, updateHolderState, UpdateStatus } from '@store/holder/holder.reducer';
import { useAppDispatch } from '@store/store.model';
import { updateProfile } from '@api/holder.api';
import { AutID, socialUrls } from '@api/aut.model';
import ErrorDialog from '@components/Dialog/ErrorPopup';
import LoadingDialog from '@components/Dialog/LoadingPopup';
import { ResultState } from '@store/result-status';
import { ipfsCIDToHttpUrl } from '@api/storage.api';

const socialIcons = {
  // eth: EthIcon,
  discord: DiscordIcon,
  github: GitHubIcon,
  telegram: TelegramIcon,
  twitter: TwitterIcon,
  lensfrens: LensfrensIcon,
};

const ImageUpload = styled('div')(({ theme }) => ({
  width: pxToRem(160),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  textAlign: 'center',
}));

const TopWrapper = styled(Box)(({ theme }) => ({
  paddingLeft: pxToRem(100),
  paddingRight: pxToRem(100),
  paddingTop: pxToRem(150),
  paddingBottom: pxToRem(100),
  '@media(max-width: 1200px)': {
    paddingLeft: pxToRem(50),
    paddingRight: pxToRem(50),
    paddingTop: pxToRem(100),
    paddingBottom: pxToRem(100),
  },
  '@media(max-width: 360px)': {
    paddingLeft: pxToRem(30),
    paddingRight: pxToRem(30),
    paddingTop: pxToRem(30),
    paddingBottom: pxToRem(30),
  },
}));

const MiddleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'flex-start',

  '@media(max-width: 1200px)': {
    flexDirection: 'column-reverse',
    justifyContent: 'flex-end',
  },
}));
const LeftWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '70%',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  '@media(max-width: 1200px)': {
    width: '100%',
  },
}));

const RightWrapper = styled('div')(({ theme }) => ({
  width: '30%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  alignSelf: 'flex-start',
  '@media(max-width: 1200px)': {
    justifyContent: 'center',
    alignItems: 'center',
    justifyItems: 'center',
    alignContent: 'center',
    width: '100%',
    marginBottom: pxToRem(30),
  },
}));

const BottomWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  padding: pxToRem(50),
  marginBottom: pxToRem(50),
  marginTop: pxToRem(50),
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
  display: 'flex',
  '@media(max-width: 1200px)': {
    alignContent: 'center',
    justifyContent: 'center',
    padding: pxToRem(30),
  },
}));

const FormWrapper = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  // height: '100%',
  alignItems: 'flex-start',
  width: '100%',
  paddingLeft: pxToRem(100),
  paddingRight: pxToRem(100),

  '@media(max-width:1200px)': {
    width: '100%',
    paddingLeft: '0',
    paddingRight: '0',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
});

const FieldWrapper = styled('div')({
  flexDirection: 'row',
  marginBottom: pxToRem(20),
  minHeight: pxToRem(70),
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',

  '@media(max-width: 1200px)': {
    justifyContent: 'center',
    alignItems: 'center',
  },

  '@media(max-width: 360px)': {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: pxToRem(30),
  },
});

const AutProfileEdit = (props) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const history = useHistory();
  const desktop = useMediaQuery('(min-width:1200px)');
  const xs = useMediaQuery('(max-width:360px)');
  const holderData = useSelector(HolderData);
  const status = useSelector(UpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      image: holderData?.properties?.avatar,
      socials: (holderData?.properties?.socials || []).map((social) => {
        social.link = (social.link as string).replace(socialUrls[social.type].prefix, '');
        return social;
      }),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'socials',
  });

  const values = watch();

  console.log(values, 'VALUES');

  const onSubmit = (data: typeof values) => {
    dispatch(
      updateProfile({
        ...holderData,
        properties: {
          ...holderData.properties,
          socials: data.socials,
          avatar: data.image,
        },
      } as AutID)
    );
  };

  const handleDialogClose = () => {
    dispatch(
      updateHolderState({
        status: ResultState.Idle,
      })
    );
  };

  return (
    <FormWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <ErrorDialog handleClose={handleDialogClose} open={status === ResultState.Failed} message={errorMessage} />
      <LoadingDialog handleClose={handleDialogClose} open={status === ResultState.Loading} message="Editing community..." />
      <TopWrapper
        sx={{
          paddingLeft: desktop ? pxToRem(100) : !xs ? pxToRem(50) : pxToRem(30),
          paddingRight: desktop ? pxToRem(100) : !xs ? pxToRem(50) : pxToRem(30),
          paddingTop: desktop ? pxToRem(150) : !xs ? pxToRem(100) : pxToRem(30),
          paddingBottom: desktop ? pxToRem(100) : !xs ? pxToRem(100) : pxToRem(30),
        }}
      >
        <Typography fontSize={pxToRem(40)} textTransform="uppercase" color="background.paper" textAlign="left">
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
                mr: pxToRem(20),
              }}
              component={PersonIcon}
            />
            <div
              style={{
                padding: '0',
                height: pxToRem(50),
                display: 'flex',
                minWidth: '0',
                margin: '0',
                border: '0',
                verticalAlign: 'top',
                width: '80%',
              }}
            >
              <Typography
                fontSize={pxToRem(20)}
                sx={{
                  padding: '0 14px',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
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
            const { prefix, hidePrefix, placeholder } = socialUrls[Object.keys(socialUrls)[index]];

            return (
              <FieldWrapper key={`socials.${index}`}>
                <SvgIcon
                  sx={{
                    height: pxToRem(34),
                    width: pxToRem(34),
                    mt: pxToRem(10),
                    mr: pxToRem(20),
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
                            mb: pxToRem(45),
                          }}
                          InputProps={{
                            startAdornment: !hidePrefix && (
                              <InputAdornment position="start">
                                <p style={{ color: 'white', marginRight: '-5px' }}>{prefix}</p>
                              </InputAdornment>
                            ),
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
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <AFileUpload
                      initialPreviewUrl={ipfsCIDToHttpUrl(holderData?.properties?.avatar as string)}
                      fileChange={async (file) => {
                        if (file) {
                          onChange(await toBase64(file));
                        } else {
                          onChange(null);
                        }
                      }}
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
            height: pxToRem(50),
          }}
          type="button"
          color="primary"
          variant="outlined"
        >
          Cancel
        </AutButton>
        <AutButton
          onClick={handleSubmit(onSubmit)}
          sx={{
            width: desktop ? pxToRem(250) : pxToRem(150),
            height: pxToRem(50),
            marginLeft: pxToRem(50),
          }}
          type="submit"
          color="primary"
          variant="outlined"
        >
          Save
        </AutButton>
      </BottomWrapper>
    </FormWrapper>
  );
};

export default AutProfileEdit;
