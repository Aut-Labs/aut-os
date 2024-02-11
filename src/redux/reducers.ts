import { combineReducers } from "redux";
import authSliceReducer from "../auth/auth.reducer";
import uiSliceReducer from "./ui-reducer";
import holderReducer from "./holder/holder.reducer";
import walletProvideReducer from "./WalletProvider/WalletProvider";
import pluginsReducer from "./plugins/plugins.reducer";
import interactionsReducer from "./interactions/interactions.reducer";

export const reducers = combineReducers({
  auth: authSliceReducer,
  ui: uiSliceReducer,
  holder: holderReducer,
  plugin: pluginsReducer,
  interaction: interactionsReducer,
  walletProvider: walletProvideReducer
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }
  return reducers(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
