import { Box, Button, Slider, Typography } from '@mui/material';
import { HolderData } from '@store/holder/holder.reducer';
import { RootState } from '@store/store.model';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './Community.scss';

const Community = () => {
  const { communityAddress } = useParams<any>();
  const communityData = useSelector((state: RootState) => {
    return state.holder.holder.communities.find((x) => x.communityAddress === communityAddress);
  });
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { commitment: communityData.commitment },
  });

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
      <Box sx={{ display: 'flex', flexDirection: 'row', border: 1, borderColor: 'primary' }}>
        <Slider
          sx={{ maxWidth: '166px', border: 2, borderRadius: 0, borderColor: '#000000', p: '10px' }}
          defaultValue={communityData.commitment}
          step={1}
          min={1}
          max={10}
          value={communityData.commitment}
        />
        <Button onClick={() => handleWithdrawClick}>Withdraw</Button>
      </Box>
    </Box>
  );
};

export default Community;
