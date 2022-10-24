import { ResultState } from '@store/result-status';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AutID } from '@api/aut.model';
import { fetchAutID, fetchHolderData } from '@api/holder.api';
import { ErrorParser } from '@utils/error-parser';
import { NetworkConfig } from '@api/ProviderFactory/network.config';
import axios from 'axios';

export const fetchSearchResults = createAsyncThunk('fetch-search-results', async (data: any, thunkAPI) => {
  const { username, signal } = data;
  try {
    const source = axios.CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    const result = [];
    const state = thunkAPI.getState() as any;
    const networks: NetworkConfig[] = state.walletProvider.networksConfig;

    for (const network of networks) {
      const holderData = await fetchHolderData(username, network.network.toLowerCase(), source);
      if (holderData) {
        const member = await fetchAutID(holderData, network.network.toLowerCase());
        if (member) {
          result.push(member);
        }
      }
    }
    if ((signal as AbortSignal).aborted) {
      throw new Error('Aborted');
    }
    return result;
  } catch (error) {
    const message = ErrorParser(error);
    throw new Error(message);
  }
});

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
  errorMessage: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    resetSearchState: () => initialState,
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
  },
});

export const { resetSearchState } = searchSlice.actions;

export const SearchResult = (state) => state.search.searchResult as AutID[];
export const SearchStatus = (state) => state.search.status as ResultState;
export const NoSearchResults = (state) => state.search.noResults as boolean;

export const UpdateErrorMessage = (state) => state.search.errorMessage as string;

export default searchSlice.reducer;
