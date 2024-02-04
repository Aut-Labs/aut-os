import { memo, useEffect, useLayoutEffect, useRef } from "react";
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
import { NetworkConfig } from "../network.config";
import AutSDK from "@aut-labs/sdk";
import { useLocation, useNavigate } from "react-router-dom";
import { EnvMode, environment } from "@api/environment";
import { MultiSigner } from "@aut-labs/sdk/dist/models/models";
import {
  Connector,
  ConnectorAlreadyConnectedError,
  useAccount,
  useConnect
} from "wagmi";
import { walletClientToSigner } from "../ethers";

function Web3DautConnect({
  setLoading
}: {
  setLoading: (loading: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const abort = useRef<AbortController>();
  const navigate = useNavigate();
  const location = useLocation();

  const networks = useSelector(NetworksConfig);
  const { isConnected, connector } = useAccount();
  const { connectAsync, connectors } = useConnect();

  const initialiseSDK = async (
    network: NetworkConfig,
    multiSigner: MultiSigner
  ) => {
    const sdk = AutSDK.getInstance();
    return sdk.init(multiSigner, {
      novaRegistryAddress: network.contracts.novaRegistryAddress,
      autIDAddress: network.contracts.autIDAddress,
      daoExpanderRegistryAddress: network.contracts.daoExpanderRegistryAddress
    });
  };

  useEffect(() => {
    if (isConnected && connector?.getProvider) {
      const start = async () => {
        const provider = (await connector.getProvider()) as any;
        const multiSigner: MultiSigner = {
          signer: provider,
          readOnlySigner: provider
        };
        const [network] = networks.filter((d) => !d.disabled);
        const itemsToUpdate = {
          sdkInitialized: true,
          selectedNetwork: network
        };
        await initialiseSDK(network, multiSigner);
        await dispatch(updateWalletProviderState(itemsToUpdate));
      };
      start();
    }
  }, [isConnected, connector?.getProvider]);

  const onAutInit = async () => {
    const [, username] = location.pathname.split("/");
    if (username) {
      setLoading(true);
      abort.current = new AbortController();
      const result = await dispatch(
        fetchHolder({
          signal: abort.current.signal,
          autName: username
          // network: params.get("network")
        })
      );
      if (result.meta.requestStatus === "fulfilled") {
        if ((result.payload as AutID[])?.length == 1) {
          const [profile] = result.payload as AutID[];
          // params.set("network", profile.properties.network);
        }
        const connetectedAlready = localStorage.getItem("aut-data");
        if (!connetectedAlready) {
          setLoading(false);
        }
        navigate({
          pathname: location.pathname
          // search: `?${params.toString()}`
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
    if (abort.current) {
      abort.current.abort();
    }

    const profile = JSON.parse(JSON.stringify(detail));
    const autID = await _parseAutId(profile);

    if (autID.properties.network) {
      let chainId = null;

      try {
        chainId = JSON.parse(localStorage.getItem("wagmi.store")).state.chainId;
      } catch (error) {
        // no chain id
      }

      const [network] = networks.filter((d) => !d.disabled);
      if (chainId) {
        let selectedConnector: Connector = null;

        for (const c of connectors) {
          const cChainId = await c.getChainId();
          if (cChainId === chainId) {
            selectedConnector = c;
            break;
          }
        }

        if (selectedConnector && !isConnected) {
          try {
            const client = await connectAsync({
              connector: selectedConnector
            });

            client["transport"] = client["provider"];
            const temp_signer = walletClientToSigner(client);
            await initialiseSDK(network, temp_signer as any);
          } catch (err) {
            if (err instanceof ConnectorAlreadyConnectedError) {
              const provider = (await selectedConnector.getProvider()) as any;
              const multiSigner: MultiSigner = {
                signer: provider,
                readOnlySigner: provider
              };
              await initialiseSDK(network, multiSigner);
            }
          }
        }
      }

      const itemsToUpdate = {
        sdkInitialized: true,
        selectedNetwork: network
      };
      await dispatch(updateWalletProviderState(itemsToUpdate));

      navigate({
        pathname: `/${autID.name}`
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
      setLoading(false);
    }
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

    navigate({
      pathname: `/${autID.name}`
    });
  };

  useEffect(() => {
    window.addEventListener("aut_profile", onAutMenuProfile);
    window.addEventListener("aut-Init", onAutInit);
    window.addEventListener("aut-onConnected", onAutLogin);
    window.addEventListener("aut-onDisconnected", onDisconnected);

    const config = {
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
        // allowed-role-id={3}
        menu-items='[{"name":"Profile","actionType":"event_emit","eventName":"aut_profile"}]'
        flow-config='{"mode" : "signin", "customCongratsMessage": ""}'
        // nova-address="0x532e0f05aa02e36622c2fd39471360b494f3f361"
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
