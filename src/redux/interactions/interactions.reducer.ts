import { ResultState } from "@store/result-status";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createLink = createAsyncThunk(
  "interaction/create",
  async (interaction, { dispatch, getState, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return { status: "Success!", interaction };
    } catch (error) {
      return rejectWithValue({ status: "Error!", error: error.message });
    }
  }
);

export interface InteractionState {
  status: ResultState;
  errorMessage: string;
  interaction: any;
  hasCommonInteractions: boolean;
}

const initialState: InteractionState = {
  status: ResultState.Idle,
  errorMessage: "",
  interaction: null,
  hasCommonInteractions: false
};

export const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    resetInteractionState: () => initialState,
    updateInteractionState: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
    setHasCommonInteractions(state, action) {
      state.hasCommonInteractions = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLink.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(createLink.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      });
  }
});

export const { setHasCommonInteractions, updateInteractionState } =
  interactionSlice.actions;

export const InteractionStatus = (state) =>
  state.interaction.status as ResultState;
export const InteractionForAction = (state) => state.interaction.interaction;
export const CommonInteractions = (state) =>
  state.interaction.hasCommonInteractions as boolean;
export const InteractionErrorMessage = (state) =>
  state.interaction.errorMessage as string;

export default interactionSlice.reducer;
