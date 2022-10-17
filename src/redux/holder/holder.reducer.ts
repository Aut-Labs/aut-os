import { ResultState } from '@store/result-status';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { AutID } from '@api/aut.model';
import { editCommitment, fetchHolderData, updateProfile, withdraw } from '@api/holder.api';
import { ErrorParser } from '@utils/error-parser';
import { CommitmentMessages } from '@components/AutSlider';

export const fetchHolder = createAsyncThunk('fetch-holder', async (data: any) => {
  const { autName, network } = data;
  try {
    return await fetchHolderData(autName, network);
  } catch (error) {
    const message = ErrorParser(error);
    throw new Error(message);
  }
});

export interface HolderState {
  autID: AutID;
  fetchStatus: ResultState;
  status: ResultState;
  errorMessage: string;
}

const initialState: HolderState = {
  autID: null,
  fetchStatus: ResultState.Idle,
  status: ResultState.Idle,
  errorMessage: '',
};

export const holderSlice = createSlice({
  name: 'holder',
  initialState,
  reducers: {
    resetHolderState: () => initialState,
    updateHolderState: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolder.pending, (state) => {
        state.fetchStatus = ResultState.Loading;
      })
      .addCase(fetchHolder.fulfilled, (state, action) => {
        state.autID = action.payload;
        state.fetchStatus = ResultState.Success;
      })
      .addCase(fetchHolder.rejected, (state) => {
        state.fetchStatus = ResultState.Failed;
      })

      // editCommitment
      .addCase(editCommitment.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(editCommitment.fulfilled, (state, action) => {
        const { communityAddress, commitment } = action.payload;
        state.status = ResultState.Idle;
        state.autID.properties.communities = state.autID.properties.communities.map((c) => {
          if (c.properties.address === communityAddress) {
            c.properties.userData.commitment = commitment;
            c.properties.userData.commitmentDescription = CommitmentMessages(+commitment);
          }
          return c;
        });
      })
      .addCase(editCommitment.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      })

      // withdraw
      .addCase(withdraw.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
        state.autID.properties.communities = state.autID.properties.communities.filter((c) => {
          return c.properties.address !== action.payload;
        });
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      })
      // update
      .addCase(updateProfile.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
        state.autID = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { updateHolderState } = holderSlice.actions;

export const HolderData = (state) => state.holder.autID as AutID;
export const HolderStatus = (state) => state.holder.fetchStatus as ResultState;

export const UpdateStatus = (state) => state.holder.status as ResultState;
export const UpdateErrorMessage = (state) => state.holder.errorMessage as string;
export const SelectedCommunity = (communityAddress) =>
  createSelector(HolderData, (autId) => {
    return autId.properties.communities.find((item) => item.properties.address === communityAddress);
  });

export default holderSlice.reducer;
