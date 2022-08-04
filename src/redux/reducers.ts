import { combineReducers } from 'redux';
import authSliceReducer from '../auth/auth.reducer';
import uiSliceReducer from './ui-reducer';
import holderReducer from './holder/holder.reducer';
import searchReducer from './search/search.reducer';

export const reducers = combineReducers({
  auth: authSliceReducer,
  ui: uiSliceReducer,
  holder: holderReducer,
  search: searchReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined;
  }
  return reducers(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
