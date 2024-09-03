import { combineReducers } from "redux";
import uiSliceReducer from "./ui-reducer";
import autReducer from "./aut/aut.reducer";
import walletProvideReducer from "./WalletProvider/WalletProvider";
import pluginsReducer from "./plugins/plugins.reducer";
import interactionsReducer from "./interactions/interactions.reducer";

export const reducers = combineReducers({
  ui: uiSliceReducer,
  aut: autReducer,
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
