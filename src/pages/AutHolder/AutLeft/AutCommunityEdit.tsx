import { AutTextField, FormHelperText } from '@components/Fields/AutFields';
import AFileUpload from '@components/Fields/AutFileUpload';
import { Avatar, Box, Card, CardContent, CardHeader, styled, SvgIcon, Typography } from '@mui/material';
import { pxToRem } from '@utils/text-size';
import { Controller, useForm } from 'react-hook-form';
import { SwUploadFile, toBase64 } from 'sw-web-shared';
import { ReactComponent as UploadIcon } from '@assets/upload.svg';
import { AutButton } from '@components/AutButton';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AutSlider } from '@components/AutSlider';
import ErrorDialog from '@components/ErrorPopup';
import LoadingDialog from '@components/LoadingPopup';
import { useSelector } from 'react-redux';
import { UpdateErrorMessage, updateHolderState, UpdateStatus } from '@store/holder/holder.reducer';
import { useAppDispatch } from '@store/store.model';
import { ResultState } from '@store/result-status';
import { useEffect } from 'react';
import { editCommitment } from '@api/holder.api';

const AutCommunityEdit = (props) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const params = useParams<{ communityAddress: string }>();
  const history = useHistory();
  const status = useSelector(UpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);

  const AutCard = styled(Card)(({ theme }) => ({
    '&.MuiCard-root': {
      display: 'flex',
    },

    '.MuiCardHeader-root': {
      padding: '0',
    },

    '.MuiCardContent-root:last-child': {
      padding: '0',
    },
  }));

  const BottomWrapper = styled('div')(({ theme }) => ({
    width: '100%',
    padding: pxToRem(50),
    marginBottom: pxToRem(50),
    alignItems: "'center',",
    justifyContent: 'center',
    display: 'flex',
  }));

  const FormWrapper = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    flex: '1',
  });

  const community = {
    name: 'The Rabit Whole',
    market: 'Art, Events & NFTs',
    description: 'The Rabit Whole is a collective of freelances who bring a creative spirit to everything they create.',
    commitment: 3,
    image: 'https://i.picsum.photos/id/417/150/150.jpg?hmac=yboAtr7dmL8WFVtIjh85ksGN27GFgp2VbyYBdFtiEKs',
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      commitment: community?.commitment,
    },
  });

  const values = watch();

  const onSubmit = async (data) => {
    console.log(values, 'values');
    const result = await dispatch(
      editCommitment({
        communityAddress: params.communityAddress,
        commitment: data.commitment,
      })
    );
    if (result.meta.requestStatus === 'fulfilled') {
      // do somethhing on success
    }
  };

  const handleDialogClose = () => {
    dispatch(
      updateHolderState({
        status: ResultState.Idle,
      })
    );
  };

  useEffect(() => {
    return () => {
      handleDialogClose();
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
      <ErrorDialog handleClose={handleDialogClose} open={status === ResultState.Failed} message={errorMessage} />
      <LoadingDialog handleClose={handleDialogClose} open={status === ResultState.Loading} message="Creating community" />
      <Box sx={{ paddingLeft: pxToRem(100), paddingRight: pxToRem(100), paddingTop: pxToRem(150) }}>
        <Typography fontSize={pxToRem(40)} textTransform="uppercase" color="background.paper" textAlign="left">
          Edit your community
        </Typography>
      </Box>
      <Box
        sx={{
          paddingLeft: pxToRem(100),
          paddingTop: pxToRem(100),
          paddingRight: pxToRem(100),
          width: '100%',
          display: 'flex',
          height: '100%',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          alignItems: 'flex-start',
          flex: '1',
        }}
      >
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', flex: '1' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              height: '100%',
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            <AutCard sx={{ bgcolor: 'background.default', border: 'none' }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'background.default', width: 110, height: 110, borderRadius: 0 }} aria-label="community-avatar">
                    <img alt="Avatar" src="https://i.picsum.photos/id/74/150/150.jpg?hmac=Nkwpn5J-2MQbfrVDIudLW8y8J1K3U01RBQ7QMkLDtG0" />
                  </Avatar>
                }
              />
              <CardContent sx={{ ml: pxToRem(30), mr: pxToRem(30), alignSelf: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography fontSize={pxToRem(25)} color="background.paper" textAlign="left">
                    {community.name}
                  </Typography>
                </div>

                <Typography variant="h2" color="background.paper" textAlign="left" sx={{ textWrap: 'wrap' }}>
                  {community.market}
                </Typography>
                <Typography variant="h3" color="background.paper" textAlign="left" sx={{ textWrap: 'wrap', pt: pxToRem(30) }}>
                  {community.description}
                </Typography>
              </CardContent>
            </AutCard>
            <div style={{ marginTop: pxToRem(100) }}>
              <Typography variant="h2" color="background.paper" textAlign="left" sx={{ textWrap: 'wrap', pb: pxToRem(20) }}>
                My Commitment Level
              </Typography>
              <Controller
                name="commitment"
                key="commitment"
                control={control}
                rules={{ min: 1, required: true }}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <AutSlider
                      value={value}
                      name={name}
                      errors={errors}
                      sliderProps={{
                        defaultValue: 1,
                        step: 1,
                        marks: true,
                        name,
                        value: value || 0,
                        onChange,
                        min: 0,
                        max: 10,
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>
          <BottomWrapper>
            <AutButton
              onClick={() => history.goBack()}
              sx={{
                width: pxToRem(250),
                height: pxToRem(50),
              }}
              type="submit"
              color="primary"
              variant="outlined"
            >
              Cancel
            </AutButton>
            <AutButton
              onClick={handleSubmit(onSubmit)}
              sx={{
                width: pxToRem(250),
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
        </form>
      </Box>
    </Box>
  );
};

export default AutCommunityEdit;
