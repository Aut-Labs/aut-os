/* eslint-disable jsx-a11y/no-static-element-interactions */

import { ReactComponent as DiscordIcon } from '@assets/SocialIcons/DiscordIcon.svg';

import { ReactComponent as GitHubIcon } from '@assets/SocialIcons/GitHubIcon.svg';
import { ReactComponent as LeafIcon } from '@assets/SocialIcons/LeafIcon.svg';
import { ReactComponent as TelegramIcon } from '@assets/SocialIcons/TelegramIcon.svg';
import { ReactComponent as TwitterIcon } from '@assets/SocialIcons/TwitterIcon.svg';
import { Avatar, Box, Card, CardContent, CardHeader, styled, SvgIcon, Typography } from '@mui/material';
import { pxToRem } from '@utils/text-size';
import { useState } from 'react';
import PencilEdit from '@assets/PencilEditicon';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HolderData, HolderStatus } from '@store/holder/holder.reducer';
import { IsAuthenticated } from '@auth/auth.reducer';
import { ResultState } from '@store/result-status';

const AutTable = styled('table')(({ theme }) => ({
  width: '100%',

  tr: {
    '&:not(:first-of-type)': {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(67, 158, 221, 0.3)',
      },

      '&.isActive': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },

  td: {
    padding: pxToRem(20),
    height: pxToRem(32),

    '&:not(:first-of-type)': {
      paddingLeft: pxToRem(50),
    },
    borderBottom: '1px solid white',
  },

  th: {
    height: pxToRem(32),
    padding: pxToRem(20),
    '&:not(:first-of-type)': {
      paddingLeft: pxToRem(50),
    },
    borderBottom: '1px solid white',
  },
}));
const IconContainer = styled('div')(({ theme }) => ({
  paddingTop: pxToRem(40),
  display: 'flex',
}));

const AutIcon = styled('div')(({ theme }) => ({
  '&:not(:first-of-type)': {
    paddingLeft: pxToRem(20),
  },
}));

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

const AutUserInfo = ({ match }) => {
  const holderData = useSelector(HolderData);
  const holderStaus = useSelector(HolderStatus);
  const isAuthenticated = useSelector(IsAuthenticated);
  const [isActiveIndex, setIsActiveIndex] = useState(null);
  const history = useHistory();

  const onEdit = () => {
    history.push(`${match.url}/edit-profile`);
  };
  function clickRow(index, address: string) {
    if (isAuthenticated) {
      if (isActiveIndex === index) {
        setIsActiveIndex(null);
      } else {
        setIsActiveIndex(index);
      }
      history.push(`${match.url}/edit-community/${address}`);
    }
  }
  return (
    <>
      <Box>
        {holderStaus === ResultState.Success ? (
          <>
            <Box sx={{ paddingLeft: pxToRem(100), paddingRight: pxToRem(100), paddingTop: pxToRem(150) }}>
              <AutCard sx={{ bgcolor: 'background.default', border: 'none' }}>
                <CardHeader
                  avatar={
                    <Avatar
                      src={holderData.image as string}
                      sx={{ bgcolor: 'background.default', width: 150, height: 150, borderRadius: 0 }}
                      aria-label="recipe"
                    />
                  }
                />
                <CardContent sx={{ ml: pxToRem(30), mr: pxToRem(30), alignSelf: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontSize={pxToRem(50)} color="background.paper" textAlign="left">
                      {holderData.name}
                    </Typography>

                    {isAuthenticated && (
                      <div style={{ padding: pxToRem(20), cursor: 'pointer' }} onClick={onEdit}>
                        <PencilEdit height={pxToRem(24)} width={pxToRem(24)} />
                      </div>
                    )}
                  </div>

                  <Typography
                    variant="h2"
                    color="background.paper"
                    textAlign="left"
                    sx={{ textDecoration: 'underline', wordBreak: 'break-all' }}
                  >
                    {holderData.properties.address}
                  </Typography>
                  <IconContainer>
                    <SvgIcon
                      sx={{
                        height: pxToRem(34),
                        width: pxToRem(31),
                        mr: pxToRem(20),
                      }}
                      component={DiscordIcon}
                    />
                    <SvgIcon
                      sx={{
                        height: pxToRem(34),
                        width: pxToRem(31),
                        mr: pxToRem(20),
                      }}
                      component={GitHubIcon}
                    />
                    <SvgIcon
                      sx={{
                        height: pxToRem(34),
                        width: pxToRem(31),
                        mr: pxToRem(20),
                      }}
                      component={TwitterIcon}
                    />
                    <SvgIcon
                      sx={{
                        height: pxToRem(34),
                        width: pxToRem(31),
                        mr: pxToRem(20),
                      }}
                      component={TelegramIcon}
                    />
                    <SvgIcon
                      sx={{
                        height: pxToRem(34),
                        width: pxToRem(31),
                        mr: pxToRem(20),
                      }}
                      component={LeafIcon}
                    />
                  </IconContainer>
                </CardContent>
              </AutCard>
            </Box>
            <Box sx={{ paddingLeft: pxToRem(100), paddingRight: pxToRem(100), paddingTop: pxToRem(100) }}>
              <Typography fontSize={pxToRem(47)} textTransform="uppercase" color="background.paper" textAlign="left">
                Communities
              </Typography>
            </Box>
            <Box sx={{ paddingLeft: pxToRem(100), paddingRight: pxToRem(100), paddingTop: pxToRem(50), paddingBottom: pxToRem(100) }}>
              <AutTable aria-label="table" cellSpacing="0">
                <tbody>
                  <tr>
                    <th>
                      <Typography variant="subtitle2" color="background.paper" textAlign="left" fontWeight="bold">
                        Community Name
                      </Typography>
                    </th>
                    <th>
                      <Typography variant="subtitle2" color="background.paper" textAlign="left" fontWeight="bold">
                        Role
                      </Typography>
                    </th>
                    <th>
                      <Typography variant="subtitle2" color="background.paper" textAlign="left" fontWeight="bold">
                        Commitment
                      </Typography>
                    </th>
                  </tr>
                  {holderData.properties.communities.map(({ name, properties }, index) => (
                    <tr
                      key={`row-key-${index}`}
                      className={isActiveIndex === index ? 'isActive' : ''}
                      onClick={() => clickRow(index, properties.address)}
                    >
                      <td>
                        <Typography variant="h2" color="background.paper" sx={{ pb: '5px' }}>
                          {name}
                        </Typography>
                        <Typography variant="h5" color="background.paper">
                          {properties.address}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="h2" color="background.paper">
                          {properties?.userData?.roleName}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="h2" color="background.paper" sx={{ pb: '5px' }}>
                          {`${properties.userData.commitment}/10`}
                        </Typography>
                        <Typography variant="h5" color="background.paper">
                          {properties.userData.commitmentDescription}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </AutTable>
            </Box>
          </>
        ) : (
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: '10px',
              fontSize: pxToRem(50),
              color: 'white',
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%',
            }}
          >
            This āutID hasn't been claimed yet
          </Typography>
        )}
      </Box>
    </>
  );
};

export default AutUserInfo;
