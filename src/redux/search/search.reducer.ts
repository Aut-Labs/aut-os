import { ResultState } from "@store/result-status";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AutID } from "@api/aut.model";
import { fetchAutID, fetchSearchResults } from "@api/holder.api";
import { ErrorParser } from "@utils/error-parser";
import { NetworkConfig } from "@api/ProviderFactory/network.config";
import axios from "axios";

export interface HolderState {
  searchResult: AutID[];
  noResults: boolean;
  status: ResultState;
  errorMessage: string;
}

const initialState: HolderState = {
  searchResult: [],
  noResults: false,
  status: ResultState.Idle,
  errorMessage: ""
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearchState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.searchResult = action.payload;
        state.noResults = !action.payload.length;
        state.status = ResultState.Success;
      })
      .addCase(fetchSearchResults.rejected, (state) => {
        state.status = ResultState.Success;
        state.noResults = true;
        state.searchResult = [];
      });
  }
});

export const { resetSearchState } = searchSlice.actions;

export const SearchResult = (state) => state.search.searchResult as AutID[];
export const SearchStatus = (state) => state.search.status as ResultState;
export const NoSearchResults = (state) => state.search.noResults as boolean;

export const UpdateErrorMessage = (state) =>
  state.search.errorMessage as string;

export default searchSlice.reducer;
