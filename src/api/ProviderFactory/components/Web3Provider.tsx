import { NetworkConnectors } from '@store/WalletProvider/WalletProvider';
import { Web3ReactProvider } from '@web3-react/core';
import { useSelector } from 'react-redux';

export default function Web3AutProvider({ children }) {
  const connectors = useSelector(NetworkConnectors);
  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>;
}
