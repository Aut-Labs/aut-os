import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useAppDispatch } from "@store/store.model";
import { ResultState } from "@store/result-status";
import { HolderData, updateHolderState } from "@store/holder/holder.reducer";
import { resetAuthState, setConnectedUserInfo } from "@auth/auth.reducer";
import { fetchHolder, fetchHolderEthEns } from "@api/holder.api";
import { AutID } from "@api/aut.model";
import { Init } from "@aut-labs/d-aut";
import { useSelector } from "react-redux";
import {
  NetworkWalletConnectors,
  NetworksConfig,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { Typography, debounce, styled } from "@mui/material";
import AutLoading from "@components/AutLoading";
import DialogWrapper from "@components/Dialog/DialogWrapper";
import { NetworkConfig } from "../network.config";
import { NetworkSelectors } from "./NetworkSelectors";
import AppTitle from "@components/AppTitle";
import AutSDK from "@aut-labs/sdk";
import { useConnector, useEthers, Connector, Config } from "@usedapp/core";
import { ethers } from "ethers";
import { useLocation, useNavigate } from "react-router-dom";
import { IAutButtonConfig } from "@aut-labs/d-aut/build/components/AutButtonMenu/AutMenuUtils";
import { EnvMode, environment } from "@api/environment";

const DialogInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gridGap: "30px"
});

function Web3DautConnect({
  setLoading,
  config
}: {
  setLoading: (loading: boolean) => void;
  config: Config;
}) {
  const dispatch = useAppDispatch();
  const abort = useRef<AbortController>();
  const networks = useSelector(NetworksConfig);
  const holderData = useSelector(HolderData);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [dAutConnected, setDAutConnected] = useState(false);
  const [loadingNetwork, setIsLoadingNetwork] = useState(false);
  const { connector, activate } = useConnector();
  const navigate = useNavigate();
  const location = useLocation();
  const { activateBrowserWallet, switchNetwork, chainId } = useEthers();

  const openForSelectNetwork = useMemo(() => {
    return dAutConnected && currentChainId && currentChainId != chainId;
  }, [chainId, dAutConnected, currentChainId]);

  const initialiseSDK = async (
    network: NetworkConfig,
    signer: ethers.providers.JsonRpcSigner
  ) => {
    const sdk = AutSDK.getInstance();
    return sdk.init(signer, {
      novaRegistryAddress: network.contracts.novaRegistryAddress,
      autIDAddress: network.contracts.autIDAddress,
      daoExpanderRegistryAddress: network.contracts.daoExpanderRegistryAddress
    });
  };

  const activateNetwork = async (
    network: NetworkConfig,
    conn: Connector,
    wallet?: string
  ) => {
    setIsLoadingNetwork(true);
    try {
      await activate(conn);
      await switchNetwork(+network.chainId);
    } catch (error) {
      console.error(error, "error");
    }
    const signer = conn?.provider?.getSigner();
    const itemsToUpdate = {
      sdkInitialized: true,
      selectedWalletType: wallet,
      selectedNetwork: network.network,
      signer
    };
    if (!wallet) {
      delete itemsToUpdate.selectedWalletType;
    }
    await dispatch(updateWalletProviderState(itemsToUpdate));
    await initialiseSDK(network, signer as ethers.providers.JsonRpcSigner);
    setCurrentChainId(+network.chainId);
    setIsLoadingNetwork(false);
  };

  // const onAutInit = async () => {
  //   const connetectedAlready = sessionStorage.getItem("aut-data");
  //   if (!connetectedAlready) {
  //     setLoading(false);
  //   }
  // };

  const onAutInit = async () => {
    const [, username] = location.pathname.split("/");
    const params = new URLSearchParams(location.search);
    if (username) {
      setLoading(true);
      abort.current = new AbortController();
      const result = await dispatch(
        fetchHolder({
          signal: abort.current.signal,
          autName: username,
          network: params.get("network")
        })
      );
      if (result.meta.requestStatus === "fulfilled") {
        if ((result.payload as AutID[])?.length == 1) {
          const [profile] = result.payload as AutID[];
          params.set("network", profile.properties.network);
        }
        const connetectedAlready = sessionStorage.getItem("aut-data");
        if (!connetectedAlready) {
          setLoading(false);
        }
        navigate({
          pathname: location.pathname,
          search: `?${params.toString()}`
        });
      }
    } else {
      params.delete("network");
      const connetectedAlready = sessionStorage.getItem("aut-data");
      if (!connetectedAlready) {
        setLoading(false);
      }
      navigate({
        pathname: `/`,
        search: `?${params.toString()}`
      });
    }
  };

  const onAutLogin = async ({ detail }: any) => {
    if (abort.current) {
      abort.current.abort();
    }

    const profile = JSON.parse(JSON.stringify(detail));
    const autID = new AutID(profile);
    autID.properties.communities = autID.properties.communities.filter((c) => {
      return c.properties.userData?.isActive;
    });
    autID.properties.address = profile.address;
    autID.properties.network = profile.network?.toLowerCase();

    const network = networks.find(
      (n) =>
        n.network?.toLowerCase() === autID?.properties?.network?.toLowerCase()
    );

    if (network && !network?.disabled) {
      const connector = config.connectors[profile.provider];
      activateBrowserWallet({ type: profile.provider });
      await activateNetwork(network, connector, profile.provider);
    }

    autID.properties.address = profile.address;
    autID.properties.network = profile.network?.toLowerCase();
    const ethDomain = await fetchHolderEthEns(autID.properties.address);
    autID.properties.ethDomain = ethDomain;

    const params = new URLSearchParams(window.location.search);
    params.set("network", autID.properties.network?.toLowerCase());
    navigate({
      pathname: `/${autID.name}`,
      search: `?${params.toString()}`
    });
    await dispatch(
      setConnectedUserInfo({
        connectedAddress: autID.properties.address,
        connectedNetwork: autID.properties.network?.toLowerCase()
      })
    );
    await dispatch(
      updateHolderState({
        profiles: [autID],
        selectedProfileAddress: autID.properties.address,
        selectedProfileNetwork: autID.properties.network?.toLowerCase(),
        fetchStatus: ResultState.Success,
        status: ResultState.Idle
      })
    );
    setDAutConnected(true);
    setLoading(false);
  };

  const onDisconnected = () => {
    const [, username] = window.location.pathname.split("/");
    const params = new URLSearchParams(window.location.search);
    if (username) {
      navigate({
        pathname: `/${username}`,
        search: `?${params.toString()}`
      });
    } else {
      params.delete("network");
      navigate({
        pathname: `/`,
        search: `?${params.toString()}`
      });
    }
    dispatch(resetAuthState());
  };

  const onAutMenuProfile = () => {
    const profile = JSON.parse(sessionStorage.getItem("aut-data"));
    const params = new URLSearchParams(window.location.search);
    navigate({
      pathname: `/${profile.name}`,
      search: `?${params.toString()}`
    });
  };

  useEffect(() => {
    window.addEventListener("aut_profile", onAutMenuProfile);
    window.addEventListener("aut-Init", onAutInit);
    window.addEventListener("aut-onConnected", onAutLogin);
    window.addEventListener("aut-onDisconnected", onDisconnected);

    const config: IAutButtonConfig = {
      defaultText: "Connect Wallet",
      textAlignment: "right",
      menuTextAlignment: "left",
      theme: {
        color: "offWhite",
        // color: 'nightBlack',
        // color: colors.amber['500'],
        // color: '#7b1fa2',
        type: "main"
      },
      // size: "default" // large & extraLarge or see below
      size: {
        width: 240,
        height: 50,
        padding: 3
      }
    };

    Init({
      config
    });

    return () => {
      window.removeEventListener("aut_profile", onAutMenuProfile);
      window.removeEventListener("aut-Init", onAutInit);
      window.removeEventListener("aut-onConnected", onAutLogin);
      window.removeEventListener("aut-onDisconnected", onAutLogin);
      if (abort.current) {
        abort.current.abort();
      }
    };
  }, []);

  return (
    <>
      <d-aut
        style={{
          display: "none",
          position: "absolute",
          zIndex: 99999
        }}
        use-dev={environment.env == EnvMode.Development}
        id="d-aut"
        menu-items='[{"name":"Profile","actionType":"event_emit","eventName":"aut_profile"}]'
        flow-config='{"mode" : "dashboard", "customCongratsMessage": ""}'
        ipfs-gateway="https://ipfs.nftstorage.link/ipfs"
      />
      <DialogWrapper open={openForSelectNetwork}>
        <>
          <AppTitle
            mb={{
              xs: "16px",
              lg: "24px",
              xxl: "32px"
            }}
            variant="h2"
          />
          {loadingNetwork && (
            <div style={{ position: "relative", flex: 1 }}>
              <AutLoading />
            </div>
          )}
          {!loadingNetwork && (
            <>
              <>
                <Typography
                  mb={{
                    xs: "8px"
                  }}
                  color="white"
                  variant="subtitle1"
                >
                  Change Network
                </Typography>

                <Typography color="white" variant="body">
                  You will need to switch your wallet’s network.
                </Typography>
              </>
              <DialogInnerContent>
                <NetworkSelectors
                  networks={networks}
                  onSelect={async (network: NetworkConfig) => {
                    activateNetwork(network, connector.connector);
                  }}
                />
              </DialogInnerContent>
            </>
          )}
        </>
      </DialogWrapper>
    </>
  );
}

export const DautPlaceholder = memo(() => {
  const ref = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    let dautEl: HTMLElement = document.querySelector("#d-aut");
    dautEl.style.display = "none";
    dautEl.style.left = "0";
    dautEl.style.top = "0";
    const updateDautPosition = () => {
      if (!dautEl) {
        dautEl = document.querySelector("#d-aut");
      }
      if (!dautEl || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      dautEl.style.left = `${rect.left}px`;
      dautEl.style.top = `${rect.top}px`;
      dautEl.style.display = "inherit";
    };
    const debounceFn = debounce(updateDautPosition, 10);
    window.addEventListener("resize", debounceFn);
    debounceFn();
    return () => {
      window.removeEventListener("resize", debounceFn);
      dautEl.style.display = "none";
    };
  }, [ref.current]);

  return (
    <div
      ref={ref}
      style={{
        width: "244px",
        height: "55px",
        position: "relative",
        zIndex: -1
      }}
      className="web-component-placeholder"
    />
  );
});

export default Web3DautConnect;
