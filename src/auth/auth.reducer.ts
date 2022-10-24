import { AutID } from '@api/aut.model';
import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  isAutheticated: boolean;
  userAddress: string;
}

const initialState: AuthState = {
  isAutheticated: false,
  userAddress: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action) {
      const { isAuthenticated } = action.payload;
      state.isAutheticated = isAuthenticated;
    },
    setUserAddress(state, action) {
      state.userAddress = action.payload;
    },
    resetAuthState: () => initialState,
  },
});

export const { setAuthenticated, setUserAddress, resetAuthState } = authSlice.actions;

export const IsAuthenticated = (state) => state.auth.isAutheticated as boolean;

export default authSlice.reducer;
