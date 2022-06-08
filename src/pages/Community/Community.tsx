import { Box, Button, Slider, Typography } from '@mui/material';
import { HolderData } from '@store/holder/holder.reducer';
import { RootState } from '@store/store.model';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './Community.scss';

const Community = () => {
  const { communityAddress } = useParams<any>();
  const communityData = useSelector((state: RootState) => {
    if (state && state.holder && state.holder.holder && state.holder.holder.communities) {
      return state.holder.holder.communities.find((x) => x.communityAddress === communityAddress);
    }
    return null;
  });
  const [commitment, setCommitment] = useState(communityData.commitment);

  useEffect(() => {
    console.log(communityData);
    console.log(commitment);
  }, [commitment]);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { commitment: communityData.commitment },
  });

  const isNotEqualToCurrent = async (commitment: number) => {
    return commitment !== communityData.commitment;
  };

  const handleCommitmentChange = (event: any, newValue: number | number[]) => {
    setValue('commitment', newValue as number, { shouldValidate: true });
    setCommitment(newValue as number);
    console.log(newValue as number);
  };

  const handleUpdateCommitmentClick = () => {
    console.log('Update!!');
  };

  const handleWithdrawClick = () => {
    console.log('Withdraw!');
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {console.log(commitment)}
      {communityData && commitment && (
        <>
          <Box
            component="img"
            sx={{
              height: 233,
              width: 350,
              maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 350, md: 250 },
            }}
            alt="Community Pic."
            src="https://media.istockphoto.com/photos/spaghetti-alla-puttanesca-italian-pasta-dish-with-tomatoes-black-picture-id1325172440?b=1&k=20&m=1325172440&s=170667a&w=0&h=WS2gPeU01_yzJYsiaHBhOSfrHVKMn-kBxzgsz61a2p8="
          />
          <Typography color="primary" variant="h1">
            {communityData.communityName}
          </Typography>
          <Typography color="primary" variant="h2">
            Role: {communityData.role}
          </Typography>
          <Box
            sx={{
              my: '48px',
              width: '75%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              border: 1,
              borderColor: 'primary',
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Controller
                rules={{ validate: { isNotEqualToCurrent } }}
                name="commitment"
                control={control}
                render={({ field, fieldState, formState }) => (
                  <Slider valueLabelDisplay="on" value={commitment} onChange={handleCommitmentChange} />
                )}
              />
              <Button
                sx={{
                  flex: 1,
                  mx: '14px',
                }}
                disabled={!isValid}
                onClick={() => handleUpdateCommitmentClick}
              >
                Update
              </Button>
            </Box>

            <Button
              sx={{
                flex: 1,
                mx: '14px',
              }}
              onClick={() => handleWithdrawClick}
            >
              Withdraw
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Community;
