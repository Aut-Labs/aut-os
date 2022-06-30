import { styled, useTheme } from '@mui/material';
import AutLeft from './AutLeft/Left';
import AutTunnelRight from './AutRight/Right';

const AutContainer = styled('div')(() => ({
  display: 'flex',
  height: '100%',
  backgroundColor: '#000000',
}));

const AutHolder = (props) => {
  return (
    <AutContainer>
      <AutLeft {...props} />
      <AutTunnelRight />
    </AutContainer>
  );
};

export default AutHolder;
