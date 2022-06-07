import { ResultState } from '@store/result-status';
import { createSlice } from '@reduxjs/toolkit';
import { fetchHolder } from '@api/holder.api';

export interface Community {
  communityAddress: string;
  communityName: string;
  role: number;
  commitment: number;
}

export interface Holder {
  holderName?: string;
  holderProfilePic?: string;
  holderRepScore?: number;
  communities?: Community[];
}

export interface HolderState {
  holder: Holder;
  status: ResultState;
}

const initialState: HolderState = {
  holder: null,
  status: ResultState.Idle,
};

export const holderSlice = createSlice({
  name: 'holder',
  initialState,
  reducers: {
    resetHolderState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // get community
      .addCase(fetchHolder.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(fetchHolder.fulfilled, (state, action) => {
        console.log(action.payload);
        state.holder = action.payload;
        state.status = ResultState.Idle;
      })
      .addCase(fetchHolder.rejected, (state) => {
        state.status = ResultState.Failed;
      });
  },
});

export const HolderData = (state) => state.holder as Holder;

export default holderSlice.reducer;
