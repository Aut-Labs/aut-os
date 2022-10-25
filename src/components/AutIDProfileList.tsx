import { AutID } from '@api/aut.model';
import { ipfsCIDToHttpUrl } from '@api/storage.api';
import { Avatar, Typography, SvgIcon, styled } from '@mui/material';
import { pxToRem } from '@utils/text-size';
import { ReactComponent as RedirectIcon } from '@assets/RedirectIcon.svg';
import DialogWrapper from './Dialog/DialogWrapper';

const UserRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  height: pxToRem(80),
  width: '100%',
  cursor: 'pointer',
  borderBottom: '1px solid white',
  borderTop: '1px solid white',

  '&:not(:first-of-type)': {
    borderBottom: '1px solid white',
    borderTop: 'none',
  },

  '&:hover': {
    backgroundColor: 'rgba(67, 158, 221, 0.15)',
  },

  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'row',
    height: pxToRem(80),
    width: '100%',
    cursor: 'pointer',
    borderBottom: '1px solid white',
    borderTop: '1px solid white',
  },
}));

export const AutIDProfileList = ({ profiles, onSelect }: { profiles: AutID[]; onSelect: (profile: AutID) => void }) => {
  return (
    <>
      {profiles.map((user: AutID, index) => {
        return (
          <UserRow key={`result-${index}`} onClick={() => onSelect(user)}>
            <Avatar
              sx={{
                bgcolor: 'background.default',
                height: pxToRem(78),
                width: pxToRem(78),
                borderRadius: 0,
              }}
              aria-label="avatar"
              src={ipfsCIDToHttpUrl(user?.properties?.avatar as string)}
            />
            <div style={{ display: 'flex', flex: '1' }}>
              <div style={{ width: '33%', justifyContent: 'center', alignItems: 'center', height: '100%', display: 'flex' }}>
                <Typography
                  sx={{
                    display: 'flex',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '3px',
                    height: '100%',
                    color: 'white',
                    ml: pxToRem(20),
                  }}
                  variant="h6"
                >
                  {user?.name}
                </Typography>
              </div>
              <div style={{ width: '33%', justifyContent: 'center', alignItems: 'center', height: '100%', display: 'flex' }}>
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'white',
                    ml: pxToRem(20),
                    padding: '5px',
                    borderRadius: '3px',
                    backgroundColor: 'rgba(67, 158, 221, 0.3)',
                  }}
                  variant="h6"
                >
                  {user?.properties?.network}
                </Typography>
              </div>
              <div style={{ width: '33%', display: 'flex', alignContent: 'center', alignSelf: 'center' }}>
                <SvgIcon
                  sx={{
                    height: pxToRem(34),
                    width: '100%',
                    mt: pxToRem(10),
                    ml: pxToRem(20),
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  key="redirect-icon"
                  component={RedirectIcon}
                />
              </div>
            </div>
          </UserRow>
        );
      })}
    </>
  );
};

const SelectAutIDProfileDialog = ({ open, profiles, onSelect, fullScreen = false }: any) => {
  return (
    <DialogWrapper open={open} fullScreen={fullScreen}>
      <div
        className="sw-join-dialog-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AutIDProfileList profiles={profiles} onSelect={onSelect} />
      </div>
    </DialogWrapper>
  );
};

export default SelectAutIDProfileDialog;
