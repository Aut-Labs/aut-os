import { useAppDispatch } from "@store/store.model";
import {
  ConnectorTypes,
  NetworksConfig,
  NetworkSelectorIsOpen,
  SelectedNetworkConfig,
  SelectedWalletType,
  setNetwork,
  setProviderIsOpen,
  setSigner
} from "@store/WalletProvider/WalletProvider";
import { pxToRem } from "@utils/text-size";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { styled, Typography } from "@mui/material";
import { ReactComponent as AutLogo } from "@assets/aut/logo.svg";
import AutLoading from "@components/AutLoading";
import DialogWrapper from "@components/Dialog/DialogWrapper";
import type { Connector } from "@web3-react/types";
import ConnectorBtn from "./ConnectorBtn";
import { NetworkSelectors } from "./NetworkSelectors";
import { EnableAndChangeNetwork } from "../web3.network";

const Title = styled(Typography)({
  mt: pxToRem(25),
  letterSpacing: "3px",
  fontSize: pxToRem(20),
  fontWeight: "500",
  color: "white",
  textTransform: "uppercase"
});

const Subtitle = styled(Typography)({
  mt: pxToRem(25),
  letterSpacing: "1.25px",
  fontSize: pxToRem(16),
  textAlign: "center",
  color: "white",
  textTransform: "uppercase"
});

const DialogInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1
});

const Web3NetworkProvider = ({ fullScreen = false }: any) => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector(NetworkSelectorIsOpen);
  const wallet = useSelector(SelectedWalletType);
  const networks = useSelector(NetworksConfig);
  const networkConfig = useSelector(SelectedNetworkConfig);
  const { isActive, chainId, provider } = useWeb3React();

  const [connector, setConnector] = useState<Connector>(null);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const [connectedEagerly, setConnectEagerly] = useState(false);

  const switchNetwork = async (c: Connector, chainId: number) => {
    if (!c) {
      return;
    }
    setSwitchingNetwork(true);
    await c.deactivate();
    await c.activate(chainId);
    const config = networks.find(
      (n) => n.chainId?.toString() === chainId?.toString()
    );
    try {
      await EnableAndChangeNetwork(c.provider, config);
      await dispatch(setNetwork(config.network?.toLowerCase()));
    } catch (error) {
      // console.log(error);
    }
    setSwitchingNetwork(false);
  };

  const changeConnector = async (c: Connector) => {
    // @ts-ignore
    const foundChainId = Number(c?.provider?.chainId);
    const index = networks
      .map((n) => n.chainId?.toString())
      .indexOf(foundChainId?.toString());
    const chainAllowed = index !== -1;
    if (chainAllowed) {
      const config = networks.find(
        (n) => n.chainId?.toString() === foundChainId?.toString()
      );
      dispatch(setNetwork(config.network?.toLowerCase()));
      setConnectEagerly(true);
    }
    setConnector(c);
  };

  useEffect(() => {
    const previousChainId = connectedEagerly
      ? chainId
      : provider?._network?.chainId;

    const currentChainId = chainId;
    const index = networks
      .map((n) => n.chainId?.toString())
      .indexOf(currentChainId?.toString());

    const chainAllowed = index !== -1;
    const hasNetworkConfig = !!networkConfig;
    const isSameNetwork = previousChainId === chainId;
    const shouldSelectCorrectNetwork = !chainAllowed && !!chainId;

    if (switchingNetwork || !provider || !chainId || !isActive) {
      const shouldActivateConnector =
        !isActive && chainAllowed && previousChainId && chainId;
      if (shouldActivateConnector) {
        console.warn("Activating network...");
        connector.activate(chainId);
      } else if (shouldSelectCorrectNetwork && !isOpen) {
        console.warn("Opening popup...");
        dispatch(setProviderIsOpen(true));
      }
      return;
    }

    const shouldUpdateSigner = chainAllowed && isActive && isSameNetwork;
    const shouldSwitchNetwork =
      isActive &&
      chainAllowed &&
      hasNetworkConfig &&
      previousChainId &&
      currentChainId &&
      !isSameNetwork;

    console.log("connectedEagerly: ", connectedEagerly);
    console.log("isSameNetwork: ", isSameNetwork);
    console.log("isActive: ", isActive);
    console.log("currentChainId: ", currentChainId);
    console.log("previousChainId: ", previousChainId);
    console.log("chainAllowed:", chainAllowed);
    console.log("hasNetworkConfig:", hasNetworkConfig);
    console.log("shouldUpdateSigner:", shouldUpdateSigner);
    console.log("shouldSwitchNetwork:", shouldSwitchNetwork);
    console.log("shouldSelectCorrectNetwork:", shouldSelectCorrectNetwork);

    if (shouldSelectCorrectNetwork && !isOpen) {
      console.warn("Opening popup...");
      dispatch(setProviderIsOpen(true));
    }

    if (shouldUpdateSigner) {
      console.warn("Updating signer...");
      dispatch(setProviderIsOpen(false));
      dispatch(setSigner(provider.getSigner()));
    }

    if (shouldSwitchNetwork) {
      console.warn("Switching network...");
      switchNetwork(connector, chainId);
    }

    if (connectedEagerly) {
      setConnectEagerly(false);
    }
  }, [
    chainId,
    provider,
    switchingNetwork,
    isActive,
    networkConfig,
    connectedEagerly
  ]);

  return (
    <DialogWrapper open={isOpen} fullScreen={fullScreen}>
      <>
        <AutLogo width="80" height="80" />

        {networkConfig && provider?._network?.chainId !== chainId ? (
          <>
            <Title>Waiting for confirmation</Title>
            <div style={{ position: "relative", flex: 1 }}>
              <AutLoading />
            </div>
          </>
        ) : (
          <>
            {!wallet && <Title>Connect your wallet</Title>}
            {wallet && (
              <>
                <Title>Change Network</Title>
                <Subtitle>
                  You will need to switch your wallet’s network.
                </Subtitle>
              </>
            )}
            <DialogInnerContent>
              {!wallet && (
                <>
                  <ConnectorBtn
                    setConnector={changeConnector}
                    connectorType={ConnectorTypes.Metamask}
                  />
                  <ConnectorBtn
                    setConnector={changeConnector}
                    connectorType={ConnectorTypes.WalletConnect}
                  />
                </>
              )}

              {wallet && (
                <NetworkSelectors
                  networks={networks}
                  onSelect={async (foundChainId: number) => {
                    switchNetwork(connector, foundChainId);
                  }}
                />
              )}
            </DialogInnerContent>
          </>
        )}
      </>
    </DialogWrapper>
  );
};

export default Web3NetworkProvider;
