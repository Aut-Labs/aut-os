import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch } from "@store/store.model";
import { ResultState } from "@store/result-status";
import { updateHolderState } from "@store/holder/holder.reducer";
import { resetAuthState, setConnectedUserInfo } from "@auth/auth.reducer";
import { fetchHolder, fetchHolderEthEns } from "@api/holder.api";
import { AutID } from "@api/aut.model";
import { Init } from "@aut-labs/d-aut";
import { useSelector } from "react-redux";
import {
  NetworksConfig,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import { debounce } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { EnvMode, environment } from "@api/environment";
import { useConnect } from "wagmi";
import AutSDK from "@aut-labs/sdk";
import { MultiSigner } from "@aut-labs/sdk/dist/models/models";
import { NetworkConfig } from "./network.config";
import { useAutConnector } from "@aut-labs/connector";
import axios from "axios";
import { extractDomain } from "@utils/helpers";

function Web3DautConnect({
  setLoading
}: {
  setLoading: (loading: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const networks = useSelector(NetworksConfig);
  const dAutInitialized = useRef<boolean>(false);
  const { connectors } = useConnect();
  const {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    setStateChangeCallback,
    multiSigner,
    multiSignerId,
    chainId,
    status,
    address
  } = useAutConnector();

  const onAutInit = async () => {
    const [, username] = location.pathname.split("/");
    if (username) {
      setLoading(true);
      const result = await dispatch(
        fetchHolder({
          autName: username
        })
      );
      if (result.meta.requestStatus === "fulfilled") {
        if ((result.payload as AutID[])?.length == 1) {
          const [profile] = result.payload as AutID[];
        }
        const connetectedAlready = localStorage.getItem("aut-data");
        if (!connetectedAlready) {
          setLoading(false);
        }
        navigate({
          pathname: location.pathname
        });
      }
    } else {
      const connetectedAlready = localStorage.getItem("aut-data");
      if (!connetectedAlready) {
        setLoading(false);
      }
      navigate({
        pathname: `/`
      });
    }
  };

  const _parseAutId = async (profile: any): Promise<AutID> => {
    const autID = new AutID(profile);
    autID.properties.communities = autID.properties.communities.filter((c) => {
      return c.properties.userData?.isActive;
    });
    autID.properties.network =
      profile.properties.network?.network?.toLowerCase();

    const ethDomain = await fetchHolderEthEns(autID.properties.address);
    autID.properties.ethDomain = ethDomain;

    return autID;
  };

  const onAutLogin = async ({ detail }: any) => {
    const profile = JSON.parse(JSON.stringify(detail));
    const autID = await _parseAutId(profile);

    if (autID.properties.network) {
      // navigate({
      //   pathname: `/${autID.name}`
      // });
      await dispatch(
        setConnectedUserInfo({
          connectedAddress: autID.properties.address,
          connectedNetwork: autID.properties.network?.toLowerCase()
        })
      );

      const [, username] = location.pathname.split("/");

      if (username === autID.name) {
        await dispatch(
          updateHolderState({
            profiles: [autID],
            selectedProfileAddress: autID.properties.address,
            selectedProfileNetwork: autID.properties.network?.toLowerCase(),
            fetchStatus: ResultState.Success,
            status: ResultState.Idle
          })
        );
      }

      setLoading(false);
    }
  };

  const onDisconnected = () => {
    localStorage.removeItem("interactions-api-jwt");
    const [, username] = window.location.pathname.split("/");
    const params = new URLSearchParams(window.location.search);
    if (username) {
      navigate({
        pathname: `/${username}`
      });
    } else {
      params.delete("network");
      navigate({
        pathname: `/`
      });
    }
    dispatch(resetAuthState());
  };

  const onAutMenuProfile = async () => {
    const profile = JSON.parse(localStorage.getItem("aut-data"));
    const autID = await _parseAutId(profile);

    await dispatch(
      updateHolderState({
        profiles: [autID],
        selectedProfileAddress: autID.properties.address,
        selectedProfileNetwork: autID.properties.network?.toLowerCase(),
        fetchStatus: ResultState.Success,
        status: ResultState.Idle
      })
    );

    console.log("autID: ", autID);

    navigate({
      pathname: `/${autID.name}`
    });
  };

  const initialiseSDK = async (
    network: NetworkConfig,
    multiSigner: MultiSigner
  ) => {
    const sdk = await AutSDK.getInstance(false);
    const itemsToUpdate = {
      selectedNetwork: network
    };
    await dispatch(updateWalletProviderState(itemsToUpdate));
    await sdk.init(multiSigner, {
      novaRegistryAddress: network.contracts.novaRegistryAddress,
      autIDAddress: network.contracts.autIDAddress,
      daoExpanderRegistryAddress: network.contracts.daoExpanderRegistryAddress
    });
  };

  useEffect(() => {
    if (multiSignerId) {
      let network = networks.find((d) => d.chainId === chainId);
      if (!network) {
        network = networks.filter((d) => !d.disabled)[0];
      }
      initialiseSDK(network, multiSigner);
    }
  }, [multiSignerId]);

  async function connectInterceptor(c) {
    const newState = await connect(c);

    if (environment.interactionsApiUrl == "NOT_SET") {
      return newState;
    }

    const { signer } = newState.multiSigner ?? multiSigner;
    const message = {
      timestamp: Math.floor(Date.now() / 1000), // Subtract one hour (3600 seconds)
      signer: newState.address,
      domain: extractDomain(environment.interactionsApiUrl)
    };
    const signature = await signer.signMessage(JSON.stringify(message));

    const response = await axios.post(
      `${environment.interactionsApiUrl}/auth/token`,
      { message, signature }
    );
    const data = await response.data;
    localStorage.setItem("interactions-api-jwt", data.token);

    return newState;
  }

  useEffect(() => {
    if (!dAutInitialized.current && multiSignerId) {
      window.addEventListener("aut_profile", onAutMenuProfile);
      window.addEventListener("aut-Init", onAutInit);
      window.addEventListener("aut-onConnected", onAutLogin);
      window.addEventListener("aut-onDisconnected", onDisconnected);
      dAutInitialized.current = true;
      const btnConfig = {
        metaMask: true,
        walletConnect: true,
        coinbaseWalletSDK: true,
        web3auth: true
      };

      const allowedConnectors = Object.keys(btnConfig)
        .filter((connector) => btnConfig[connector])
        .map((connector) => connectors.find((c) => c.id === connector));

      const config = {
        defaultText: "Connect Wallet",
        textAlignment: "right",
        menuTextAlignment: "left",
        theme: {
          color: "offWhite",
          type: "main"
        },
        size: {
          width: 240,
          height: 50,
          padding: 3
        }
      };
      Init({
        config,
        envConfig: {
          REACT_APP_API_URL: environment.apiUrl,
          REACT_APP_GRAPH_API_URL: environment.graphApiUrl,
          REACT_APP_IPFS_API_KEY: environment.ipfsApiKey,
          REACT_APP_IPFS_API_SECRET: environment.ipfsApiSecret,
          REACT_APP_IPFS_GATEWAY_URL: environment.ipfsGatewayUrl
        },
        connector: {
          connect: connectInterceptor,
          disconnect,
          setStateChangeCallback,
          connectors: allowedConnectors,
          networks,
          state: {
            multiSignerId,
            multiSigner,
            isConnected,
            isConnecting,
            status,
            address
          }
        }
      });
    }

    return () => {
      window.removeEventListener("aut_profile", onAutMenuProfile);
      window.removeEventListener("aut-Init", onAutInit);
      window.removeEventListener("aut-onConnected", onAutLogin);
      window.removeEventListener("aut-onDisconnected", onAutLogin);
    };
  }, [dAutInitialized, multiSignerId]);

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
        flow-config='{"mode" : "signin", "customCongratsMessage": ""}'
        // flow-config='{"mode" : "signup", "customCongratsMessage": ""}'
        // nova-address="0xf6d380e137a7953c3ce1380de12246088db67dc0"
        ipfs-gateway={environment.ipfsGatewayUrl}
      />
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
