import { ResultState } from "@store/result-status";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { AutID } from "@api/aut.model";
import {
  editCommitment,
  fetchHolder,
  updateProfile,
  withdraw
} from "@api/holder.api";
import { CommitmentMessages } from "@utils/misc";

export interface HolderState {
  profiles: AutID[];
  fetchStatus: ResultState;
  status: ResultState;
  errorMessage: string;
  selectedProfileAddress: string;
  selectedProfileNetwork: string;
}

const initialState: HolderState = {
  profiles: [],
  fetchStatus: ResultState.Idle,
  status: ResultState.Idle,
  errorMessage: "",
  selectedProfileAddress: null,
  selectedProfileNetwork: null
};

export const holderSlice = createSlice({
  name: "holder",
  initialState,
  reducers: {
    resetHolderState: () => initialState,
    updateHolderState: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolder.pending, (state) => {
        state.fetchStatus = ResultState.Loading;
      })
      .addCase(fetchHolder.fulfilled, (state, action) => {
        state.profiles = action.payload;
        if (state.profiles.length === 1) {
          state.selectedProfileAddress = state.profiles[0].properties.address;
          state.selectedProfileNetwork =
            state.profiles[0].properties?.network?.toLowerCase();
        }
        state.fetchStatus = ResultState.Success;
      })
      .addCase(fetchHolder.rejected, (state, action) => {
        if (action?.payload !== "Aborted") {
          state.fetchStatus = ResultState.Failed;
        }
      })

      // editCommitment
      .addCase(editCommitment.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(editCommitment.fulfilled, (state, action) => {
        const { communityAddress, commitment } = action.payload;
        state.status = ResultState.Idle;
        state.profiles = state.profiles.map((autID) => {
          autID.properties.communities = autID.properties.communities.map(
            (c) => {
              if (c.properties.address === communityAddress) {
                c.properties.userData.commitment = `${commitment}`;
                c.properties.userData.commitmentDescription =
                  CommitmentMessages(+commitment);
              }
              return c;
            }
          );
          return autID;
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
        state.profiles = state.profiles.map((autID) => {
          autID.properties.communities = autID.properties.communities.filter(
            (c) => {
              return c.properties.address !== action.payload;
            }
          );
          return autID;
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
        state.profiles = state.profiles.map((autID) => {
          if (autID.properties.address === action.payload.properties.address) {
            return action.payload;
          }
          return autID;
        });
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      });
  }
});

export const { updateHolderState } = holderSlice.actions;

export const SelectedProfileAddress = (state) =>
  state.holder.selectedProfileAddress as string;
export const SelectedProfileNetwork = (state) =>
  state.holder.selectedProfileNetwork as string;

export const AutIDProfiles = (state) => state.holder.profiles as AutID[];

export const HolderData = createSelector(
  AutIDProfiles,
  SelectedProfileAddress,
  SelectedProfileNetwork,
  (profiles, address, network) => {
    return profiles.find(
      (item) =>
        item.properties.address === address &&
        item.properties.network?.toLowerCase() === network?.toLowerCase()
    );
  }
);

export const HolderStatus = (state) => state.holder.fetchStatus as ResultState;

export const UpdateStatus = (state) => state.holder.status as ResultState;
export const UpdateErrorMessage = (state) =>
  state.holder.errorMessage as string;
export const SelectedCommunity = (communityAddress) =>
  createSelector(HolderData, (autId) => {
    return autId?.properties?.communities.find(
      (item) => item?.properties?.address === communityAddress
    );
  });

export default holderSlice.reducer;
