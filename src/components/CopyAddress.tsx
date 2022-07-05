/* eslint-disable jsx-a11y/no-static-element-interactions */
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip, Typography, IconButton } from '@mui/material';
import { pxToRem } from '@utils/text-size';

export const trimAddress = (address: string) => {
  if (!address) {
    return '';
  }
  const middle = Math.ceil(address.length / 2);
  const left = address.slice(0, middle).substring(0, 6);
  let right = address.slice(middle);
  right = right.substr(right.length - 4);
  return `${left}...${right}`.toUpperCase();
};

export const CopyAddress = ({ address }) => {
  return (
    <CopyToClipboard text={address}>
      <div onClick={(event) => event.stopPropagation()} style={{ width: '100%', color: 'white' }}>
        <Tooltip title="Copy Address">
          <Typography sx={{ color: 'white', fontSize: pxToRem(12) }} component="div">
            {trimAddress(address)}
            <IconButton sx={{ color: 'white', p: 0 }}>
              <ContentCopyIcon sx={{ cursor: 'pointer', width: pxToRem(12), ml: '5px' }} />
            </IconButton>
          </Typography>
        </Tooltip>
      </div>
    </CopyToClipboard>
  );
};

export default CopyAddress;
