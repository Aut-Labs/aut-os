import { Avatar, Box, Button, Card, CardContent, CardHeader, styled, Typography, useMediaQuery } from '@mui/material';
import { pxToRem } from '@utils/text-size';
import { Controller, useForm } from 'react-hook-form';
import { AutButton } from '@components/AutButton';
import { useHistory, useParams } from 'react-router-dom';
import { AutSlider } from '@components/AutSlider';
import { useSelector } from 'react-redux';
import { SelectedCommunity, UpdateErrorMessage, updateHolderState, UpdateStatus } from '@store/holder/holder.reducer';
import { useAppDispatch } from '@store/store.model';
import { ResultState } from '@store/result-status';
import { useEffect } from 'react';
import { editCommitment, withdraw } from '@api/holder.api';
import ErrorDialog from '@components/Dialog/ErrorPopup';
import LoadingDialog from '@components/Dialog/LoadingPopup';
import { ipfsCIDToHttpUrl } from '@api/storage.api';
import { trimAddress } from '@utils/trim-address';

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

const ExternalUrl = styled('a')(({ theme }) => ({
  color: 'white',
  fontSize: pxToRem(14),
  marginBottom: pxToRem(10),
}));

const BottomWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  padding: pxToRem(50),
  marginBottom: pxToRem(50),
  marginTop: pxToRem(50),
  alignItems: "'center',",
  justifyContent: 'center',
  display: 'flex',
  '@media(max-width: 1024px)': {
    alignContent: 'center',
    justifyContent: 'center',
    padding: pxToRem(30),
  },
}));

const AutCommunityEdit = () => {
  const dispatch = useAppDispatch();
  const desktop = useMediaQuery('(min-width:1024px)');
  const xs = useMediaQuery('(max-width:360px)');
  const params = useParams<{ network: string; holderAddress: string; communityAddress: string }>();
  const selectedCommunity = useSelector(SelectedCommunity(params.communityAddress));
  const history = useHistory();
  const status = useSelector(UpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);

  const linkSource =
    params.network === 'mumbai'
      ? 'https://mumbai.polygonscan.com/address/'
      : params.network === 'goerli'
      ? 'https://goerli.etherscan.io/'
      : null;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      commitment: selectedCommunity?.properties?.commitment,
    },
  });

  const values = watch();

  const onSubmit = async (data) => {
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

  const onWithdraw = async () => {
    const result = await dispatch(withdraw(params.communityAddress));
    if (result.meta.requestStatus === 'fulfilled') {
      history.goBack();
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ErrorDialog handleClose={handleDialogClose} open={status === ResultState.Failed} message={errorMessage} />
      <LoadingDialog handleClose={handleDialogClose} open={status === ResultState.Loading} message="Editing community..." />
      {selectedCommunity && (
        <>
          <Box
            sx={{
              paddingLeft: desktop ? pxToRem(100) : !xs ? pxToRem(50) : pxToRem(30),
              paddingRight: desktop ? pxToRem(100) : !xs ? pxToRem(50) : pxToRem(30),
              paddingTop: desktop ? pxToRem(150) : !xs ? pxToRem(100) : pxToRem(30),
            }}
          >
            <Typography fontSize={pxToRem(40)} textTransform="uppercase" color="background.paper" textAlign="left">
              Edit your community
            </Typography>
          </Box>

          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            style={{
              paddingLeft: desktop ? pxToRem(100) : !xs ? pxToRem(50) : pxToRem(30),
              paddingRight: desktop ? pxToRem(100) : !xs ? pxToRem(50) : pxToRem(30),
              paddingTop: desktop ? pxToRem(150) : !xs ? pxToRem(100) : pxToRem(30),
              display: 'flex',
              height: '100%',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              alignItems: desktop ? 'flex start' : 'center',
              alignContent: desktop ? 'flex start' : 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                height: '100%',
                alignItems: 'flex-start',
                width: '100%',
                flex: 1,
              }}
            >
              <AutCard sx={{ bgcolor: 'background.default', border: 'none' }}>
                <CardHeader
                  sx={{ alignSelf: 'flex-start' }}
                  avatar={
                    <Avatar
                      sx={{ bgcolor: 'background.default', width: pxToRem(110), height: pxToRem(110), borderRadius: 0 }}
                      aria-label="community-avatar"
                      src={ipfsCIDToHttpUrl(selectedCommunity.image as string)}
                    />
                  }
                />
                <CardContent
                  sx={{
                    ml: pxToRem(30),
                    mr: pxToRem(30),
                    alignSelf: 'flex-end',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontSize={pxToRem(25)} color="background.paper" textAlign="left">
                      {selectedCommunity?.name}
                    </Typography>
                  </div>
                  <ExternalUrl href={`${linkSource}/${selectedCommunity.properties.address}`} target="_blank">
                    {trimAddress(selectedCommunity.properties.address)}
                  </ExternalUrl>
                  <Typography variant="h2" color="background.paper" textAlign="left" sx={{ textWrap: 'wrap' }}>
                    {selectedCommunity?.properties?.market}
                  </Typography>
                  <Typography variant="h3" color="background.paper" textAlign="left" sx={{ textWrap: 'wrap', pt: pxToRem(30) }}>
                    {selectedCommunity?.description}
                  </Typography>
                  <Button
                    onClick={onWithdraw}
                    color="error"
                    sx={{ textDecoration: 'underline', textTransform: 'none', padding: '0', mt: pxToRem(15), fontSize: pxToRem(16) }}
                  >
                    Withdraw from this community
                  </Button>
                </CardContent>
              </AutCard>
              <div style={{ marginTop: desktop ? pxToRem(100) : !xs ? pxToRem(50) : pxToRem(30), width: '100%' }}>
                <Typography color="background.paper" textAlign="left" sx={{ textWrap: 'wrap', pb: pxToRem(20), fontSize: '20px' }}>
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
          </form>
        </>
      )}
    </Box>
  );
};

export default AutCommunityEdit;
