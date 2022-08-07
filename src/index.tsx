import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import store from '@store/store';
import { swEnvVariables, environment } from '@api/environment';
import { ensureVariablesExist } from 'sw-web-shared';
import Web3AutProvider from '@api/ProviderFactory/components/Web3Provider';
import { Buffer } from 'buffer';
import { SwTheme } from './theme';
import reportWebVitals from './reportWebVitals';
import App from './App';

// @ts-ignore
window.Buffer = Buffer;

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={SwTheme}>
      <Provider store={store}>
        <BrowserRouter>
          <Web3AutProvider>
            <App />
          </Web3AutProvider>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById('root')
);

ensureVariablesExist(environment, swEnvVariables);
reportWebVitals(null);
