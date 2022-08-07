import { useAppDispatch } from '@store/store.model';
import {
  NetworkSelectorIsOpen,
  SelectedNetworkConfig,
  SelectedWalletType,
  setProviderIsOpen,
  setSigner,
} from '@store/WalletProvider/WalletProvider';
import { pxToRem } from '@utils/text-size';
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { styled, Typography } from '@mui/material';
import { ReactComponent as AutLogo } from '@assets/aut/logo.svg';
import AutLoading from '@components/AutLoading';
import DialogWrapper from '@components/Dialog/DialogWrapper';
import ConnectorBtn, { ConnectorTypes } from './ConnectorBtn';

const Title = styled(Typography)({
  mt: pxToRem(25),
  letterSpacing: '3px',
  fontSize: pxToRem(20),
  fontWeight: '500',
  color: 'white',
  textTransform: 'uppercase',
});

const Subtitle = styled(Typography)({
  mt: pxToRem(25),
  letterSpacing: '1.25px',
  fontSize: pxToRem(16),
  textAlign: 'center',
  color: 'white',
  textTransform: 'uppercase',
});

const DialogInnerContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

const Web3NetworkProvider = ({ fullScreen = false, network = null, lastChainId = null }: any) => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector(NetworkSelectorIsOpen);
  const wallet = useSelector(SelectedWalletType);
  const networkConfig = useSelector(SelectedNetworkConfig);
  const { isActive, chainId, provider } = useWeb3React();

  useEffect(() => {
    if (isActive && lastChainId && lastChainId === chainId) {
      dispatch(setSigner(provider.getSigner()));
      dispatch(setProviderIsOpen(false));
    }
  }, [chainId, lastChainId, provider]);

  return (
    <DialogWrapper open={false} fullScreen={fullScreen}>
      <>
        <AutLogo width="80" height="80" />

        {networkConfig && lastChainId !== chainId ? (
          <>
            <Title>Waiting for confirmation</Title>
            <div style={{ position: 'relative', flex: 1 }}>
              <AutLoading />
            </div>
          </>
        ) : (
          <>
            {!wallet && <Title>Connect your wallet</Title>}
            {wallet && (
              <>
                <Title>You Must Change Networks</Title>
                <Subtitle>We’ve detected that you need to switch your wallet’s network from goerli.</Subtitle>
              </>
            )}
            <DialogInnerContent>
              {!wallet && (
                <>
                  <ConnectorBtn connectorType={ConnectorTypes.Metamask} />
                  <ConnectorBtn connectorType={ConnectorTypes.WalletConnect} />
                </>
              )}

              {/* {wallet && (
                <NetworkSelectors
                  onSelect={async (foundChainId: number, networkName: string) => {
                    setLastChainId(foundChainId);
                    await connector.activate();
                    const config = getNetworkVariables(networkName);
                    await EnableAndChangeNetwork(connector.provider, config);
                    dispatch(setNetwork(networkName));
                  }}
                />
              )} */}
            </DialogInnerContent>
          </>
        )}
      </>
    </DialogWrapper>
  );
};

export default Web3NetworkProvider;
