import { useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAppDispatch } from '@store/store.model';
import { ResultState } from '@store/result-status';
import { fetchHolder, updateHolderState } from '@store/holder/holder.reducer';
import { resetAuthState, setAuthenticated } from '@auth/auth.reducer';
import { Init } from '@aut-protocol/d-aut';
import { fetchHolderEthEns } from '@api/holder.api';
import { AutID } from '@api/aut.model';
import { useSelector } from 'react-redux';
import { NetworkWalletConnectors, NetworksConfig, setNetwork } from '@store/WalletProvider/WalletProvider';
import { EnableAndChangeNetwork } from '../web3.network';

function Web3DautConnect({ setLoading }) {
  const dispatch = useAppDispatch();
  const connectors = useSelector(NetworkWalletConnectors);
  const networks = useSelector(NetworksConfig);
  const location = useLocation<any>();
  const history = useHistory();
  const abort = useRef<AbortController>();

  const onAutInit = async () => {
    setLoading(false);
    const [, username] = location.pathname.split('/');
    const params = new URLSearchParams(location.search);
    if (username) {
      abort.current = new AbortController();
      const result = await dispatch(fetchHolder({ signal: abort.current.signal, autName: username, network: params.get('network') }));
      if (result.meta.requestStatus === 'fulfilled') {
        if ((result.payload as AutID[])?.length == 1) {
          const [profile] = result.payload as AutID[];
          params.set('network', profile.properties.network);
        }
        history.push({
          pathname: location.pathname,
          search: `?${params.toString()}`,
        });
      }
    } else {
      params.delete('network');
      history.push({
        pathname: `/`,
        search: `?${params.toString()}`,
      });
    }
  };

  const onAutLogin = async ({ detail }: any) => {
    if (abort.current) {
      abort.current.abort();
    }
    const profile = JSON.parse(JSON.stringify(detail));
    profile.address = '0x55954C2C092f6e973B55C5D2Af28950b3b6D1338';
    profile.provider = 'metamask';
    profile.network = 'goerli';

    const autID = new AutID(profile);
    autID.properties.communities = autID.properties.communities.filter((c) => {
      return c.properties.userData?.isActive;
    });
    autID.properties.address = profile.address;
    autID.properties.network = profile.network;
    const ethDomain = await fetchHolderEthEns(autID.properties.address);
    autID.properties.ethDomain = ethDomain;

    const params = new URLSearchParams(window.location.search);
    params.set('network', autID.properties.network);
    history.push({
      pathname: `/${autID.name}`,
      search: `?${params.toString()}`,
    });

    await dispatch(
      setAuthenticated({
        isAuthenticated: true,
      })
    );
    await dispatch(
      updateHolderState({
        profiles: [autID],
        selectedProfileAddress: autID.properties.address,
        fetchStatus: ResultState.Success,
        status: ResultState.Idle,
      })
    );

    const [connector] = connectors[profile.provider];
    if (connector) {
      const config = networks.find((n) => n.network?.toLowerCase() === profile?.network?.toLowerCase());
      await connector.activate(config.chainId);
      try {
        await EnableAndChangeNetwork(connector.provider, config);
        await dispatch(setNetwork(config.network));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onDisconnected = () => {
    const [, username] = window.location.pathname.split('/');
    const params = new URLSearchParams(window.location.search);
    if (username) {
      history.push({
        pathname: `/${username}`,
        search: `?${params.toString()}`,
      });
    } else {
      params.delete('network');
      history.push({
        pathname: `/`,
        search: `?${params.toString()}`,
      });
    }
    dispatch(resetAuthState());
  };

  useEffect(() => {
    window.addEventListener('aut-Init', onAutInit);
    window.addEventListener('aut-onConnected', onAutLogin);
    window.addEventListener('aut-onDisconnected', onDisconnected);

    Init();

    return () => {
      window.removeEventListener('aut-Init', onAutInit);
      window.removeEventListener('aut-onConnected', onAutLogin);
      window.removeEventListener('aut-onDisconnected', onAutLogin);
      if (abort.current) {
        abort.current.abort();
      }
    };
  }, []);

  return (
    <d-aut
      style={{
        width: '220px',
        height: '50px',
        display: 'none',
        position: 'absolute',
      }}
      id="d-aut"
      button-type="simple"
      network="goerli"
    />
  );
}

export default Web3DautConnect;
