import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
  SelectedProfileAddress,
  SelectedProfileNetwork
} from "@store/holder/holder.reducer";

export interface AuthState {
  connectedAddress: string;
  connectedNetwork: string;
}

const initialState: AuthState = {
  connectedAddress: null,
  connectedNetwork: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setConnectedUserInfo(state, action) {
      const { connectedAddress, connectedNetwork } = action.payload;
      state.connectedAddress = connectedAddress;
      state.connectedNetwork = connectedNetwork;
    },
    resetAuthState: () => initialState
  }
});

export const { setConnectedUserInfo, resetAuthState } = authSlice.actions;

export const ConnectedAddress = (state) =>
  state.auth.connectedAddress as string;
export const ConnectedNetwork = (state) =>
  state.auth.connectedNetwork as string;
export const IsConnected = createSelector(
  ConnectedAddress,
  ConnectedNetwork,
  (addr, network) => !!addr && !!network
);

export const CanUpdateProfile = createSelector(
  IsConnected,
  ConnectedAddress,
  ConnectedNetwork,
  SelectedProfileAddress,
  SelectedProfileNetwork,
  (
    isConnected,
    connectedAddress,
    connectedNetwork,
    selectedAddress,
    selectedNetwork
  ) => {
    console.log(
      "----------------",
      isConnected,
      connectedAddress,
      connectedNetwork,
      selectedAddress,
      selectedNetwork
    );
    return (
      isConnected &&
      connectedAddress === selectedAddress &&
      connectedNetwork === selectedNetwork
    );
  }
);

export default authSlice.reducer;
