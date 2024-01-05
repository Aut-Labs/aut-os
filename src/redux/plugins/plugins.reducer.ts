import { ResultState } from "@store/result-status";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const activatePlugin = createAsyncThunk(
  "plugin/activate",
  async (pluginName, { dispatch, getState, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return { status: "Success!", pluginName };
    } catch (error) {
      return rejectWithValue({ status: "Error!", error: error.message });
    }
  }
);

export interface PluginState {
  plugins: any[];
  status: ResultState;
  fetchStatus: ResultState;
  errorMessage: string;
}

const initialState: PluginState = {
  plugins: [],
  status: ResultState.Idle,
  fetchStatus: ResultState.Idle,
  errorMessage: ""
};

export const pluginSlice = createSlice({
  name: "plugin",
  initialState,
  reducers: {
    resetPluginState: () => initialState,
    updatePluginState: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(activatePlugin.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(activatePlugin.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      });
  }
});

export const { updatePluginState } = pluginSlice.actions;

export const AutPlugins = (state) => state.plugin.plugins as any[];
export const PluginStatus = (state) => state.plugin.status as ResultState;
export const PluginErrorMessage = (state) =>
  state.plugin.errorMessage as string;

export default pluginSlice.reducer;
