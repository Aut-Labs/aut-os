/* eslint-disable jsx-a11y/no-static-element-interactions */

import { ReactComponent as DiscordIcon } from '@assets/SocialIcons/DiscordIcon.svg';

import { ReactComponent as GitHubIcon } from '@assets/SocialIcons/GitHubIcon.svg';
import { ReactComponent as LeafIcon } from '@assets/SocialIcons/LeafIcon.svg';
import { ReactComponent as TelegramIcon } from '@assets/SocialIcons/TelegramIcon.svg';
import { ReactComponent as TwitterIcon } from '@assets/SocialIcons/TwitterIcon.svg';
import { Avatar, Box, Card, CardContent, CardHeader, styled, SvgIcon, Typography } from '@mui/material';
import { pxToRem } from '@utils/text-size';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import PencilEdit from '@assets/PencilEditicon';
import { useHistory } from 'react-router-dom';
import AutDataTable from './AutDataTable';

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
  //   marginBottom: '-5px',
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

const user = {
  name: 'Eulalie',
  address: '0x4727FC8c25462A73c637CC6b41e4A1116b55D1b8',
};

const communities = [
  {
    name: 'Mordor Troops',
    address: '0xC6E3D973A7c1De85C2C1C9Bbc3767e8Db7D7B0A2',
    role: 'Orc Grunt',
    commitment: 2,
    commitmentDesc: 'Casually Browsing',
  },
  {
    name: 'Wonderland',
    role: 'Mad Hatter',
    address: '0xC6E3D973A7c1De85C2C1C9Bbc3767e8Db7D7B0A2',
    commitment: 3,
    commitmentDesc: 'Casual Commenter',
  },
  {
    name: 'Rivendell',
    role: 'Silver Elf',
    address: '0xC6E3D973A7c1De85C2C1C9Bbc3767e8Db7D7B0A2',
    commitment: 3,
    commitmentDesc: 'Casual Commenter',
  },
  {
    name: 'Hogwarts School of Witchcraft',
    role: 'Caretaker',
    address: '0xC6E3D973A7c1De85C2C1C9Bbc3767e8Db7D7B0A2',
    commitment: 1,
    commitmentDesc: 'Lurking',
  },
];

const AutUserInfo = ({ match }) => {
  const [isActiveIndex, setIsActiveIndex] = useState(null);
  const history = useHistory();
  // - Toolbar

  const onEdit = (data: any) => {
    history.push(`${match.url}/edit-profile`);
  };
  function clickRow(index) {
    if (isActiveIndex === index) {
      setIsActiveIndex(null);
    } else {
      setIsActiveIndex(index);
    }
    history.push(`${match.url}/edit-community`);
  }
  return (
    <>
      <Box>
        <Box sx={{ paddingLeft: pxToRem(100), paddingRight: pxToRem(100), paddingTop: pxToRem(150) }}>
          <AutCard sx={{ bgcolor: 'background.default', border: 'none' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'background.default', width: 150, height: 150, borderRadius: 0 }} aria-label="recipe">
                  <img alt="Avatar" src="https://i.picsum.photos/id/74/150/150.jpg?hmac=Nkwpn5J-2MQbfrVDIudLW8y8J1K3U01RBQ7QMkLDtG0" />
                </Avatar>
              }
            />
            <CardContent sx={{ ml: pxToRem(30), mr: pxToRem(30), alignSelf: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography fontSize={pxToRem(50)} color="background.paper" textAlign="left">
                  {user.name}
                </Typography>
                <div style={{ padding: pxToRem(20), cursor: 'pointer' }} onClick={onEdit}>
                  <PencilEdit height={pxToRem(24)} width={pxToRem(24)} />
                </div>
              </div>

              <Typography
                variant="h2"
                color="background.paper"
                textAlign="left"
                sx={{ textDecoration: 'underline', wordBreak: 'break-all' }}
              >
                {user.address}
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
              {communities.map(({ name, role, address, commitment, commitmentDesc }, index) => (
                <tr key={`row-key-${index}`} className={isActiveIndex === index ? 'isActive' : ''} onClick={() => clickRow(index)}>
                  <td>
                    <Typography variant="h2" color="background.paper" sx={{ pb: '5px' }}>
                      {name}
                    </Typography>
                    <Typography variant="h5" color="background.paper">
                      {address}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="h2" color="background.paper">
                      {role}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="h2" color="background.paper" sx={{ pb: '5px' }}>
                      {`${commitment}/10`}
                    </Typography>
                    <Typography variant="h5" color="background.paper">
                      {commitmentDesc}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </AutTable>
        </Box>
      </Box>
    </>
  );
};

export default AutUserInfo;
