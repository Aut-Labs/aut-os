import { fetchHolder } from '@api/holder.api';
import { Box, Typography } from '@mui/material';
import { HolderData } from '@store/holder/holder.reducer';
import { RootState } from '@store/reducers';
import { useAppDispatch } from '@store/store.model';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './Holder.scss';

const Holder = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const holderData = useSelector(HolderData);

  const { holderAddress } = useParams<any>();

  useEffect(() => {
    const promise = dispatch(fetchHolder(holderAddress));
    return () => promise.abort();
  }, []);

  const handleCommunityClick = (communityAddress) => {
    console.log(communityAddress);
    history.push(`community/${communityAddress}`);
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        m: '24px',
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
        alt="Holder Profile Pic."
        src={holderData.holderProfilePic}
      />
      <Typography color="primary" variant="h1">
        {holderData.holderName}
      </Typography>
      <Typography color="primary" variant="h2">
        {holderData.holderRepScore}
      </Typography>
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
        <Typography color="primary" variant="h1" sx={{ my: '24px' }}>
          Communities
        </Typography>
        <Box sx={{ border: 1, borderColor: 'primary' }}>
          {holderData.communities &&
            holderData.communities.map((c, i) => {
              return (
                <Box
                  key={i}
                  sx={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}
                  onClick={() => handleCommunityClick(c.communityAddress)}
                >
                  <Typography color="primary" variant="h3">
                    {c.communityName}
                  </Typography>
                  <Typography color="primary" variant="h3" sx={{ mx: '14px' }}>
                    ACTIVE
                  </Typography>
                </Box>
              );
            })}
        </Box>
      </Box>
    </Box>
  );
};

export default Holder;
