import { AutButton } from '@components/AutButton';
import { pxToRem } from '@utils/text-size';
import { NetworkConfig } from '../network.config';

export const NetworkSelectors = ({ onSelect, networks }) => {
  return (
    <>
      {networks.map((network: NetworkConfig, index: number) => {
        return (
          <AutButton
            key={`key-${index}`}
            onClick={() => {
              onSelect(network.chainId, network.network.trim());
            }}
            sx={{
              width: pxToRem(310),
              height: pxToRem(55),
              marginBottom: pxToRem(30),
              fontSize: pxToRem(16),
              textTransform: 'inherit',
              letterSpacing: 0,
              '&.MuiButton-root': {
                letterSpacing: '0px',
              },
            }}
            type="button"
            color="primary"
            variant="outlined"
          >
            Switch to {network.name}
          </AutButton>
        );
      })}
    </>
  );
};
