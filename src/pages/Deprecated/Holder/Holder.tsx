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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {holderData && (
        <>
          <Box
            component="img"
            sx={{
              m: '24px',
              height: '233px',
              width: '350px',
            }}
            alt="Holder Profile Pic."
            src={holderData.holderProfilePic}
          />
          <Typography color="primary" variant="h1">
            {holderData.holderName}
          </Typography>
          <Typography color="primary" variant="h2">
            Rep Score: {holderData.holderRepScore}
          </Typography>
          <Box
            sx={{
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
            <Box
              sx={{
                width: '450px',
                border: 1,
                borderColor: 'primary',
              }}
            >
              {holderData.communities &&
                holderData.communities.map((c, i) => {
                  return (
                    <Box
                      key={i}
                      sx={{
                        height: '45px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                        cursor: 'pointer',
                        border: 1,
                        borderColor: '#000',
                      }}
                      onClick={() => handleCommunityClick(c.address)}
                    >
                      <Box
                        component="img"
                        sx={{
                          height: '45px',
                          width: '45px',
                        }}
                        alt="Community Pic."
                        src={c.picture}
                      />
                      <Typography color="primary" variant="h2">
                        {c.name}
                      </Typography>
                      <Typography color="primary" variant="h2" sx={{ mx: '14px' }}>
                        ACTIVE
                      </Typography>
                    </Box>
                  );
                })}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Holder;
