import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import store from '@store/store';
import { swEnvVariables, environment, EnvMode } from '@api/environment';
import Web3AutProvider from '@api/ProviderFactory/components/Web3Provider';
import { Buffer } from 'buffer';
import markerSDK from '@marker.io/browser';
import SentryRRWeb from '@sentry/rrweb';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SwTheme } from './theme';
import { ensureVariablesExist } from '@utils/env';

markerSDK.loadWidget({
  destination: `${process.env.REACT_APP_MARKER}`,
  reporter: {
    email: 'frontend@aut.id',
    fullName: 'Aut Holder',
  },
});

Sentry.init({
  dsn: `https://8f91c8136aa64eb294261b7dc8e09929@o1432500.ingest.sentry.io/${process.env.REACT_APP_SENTRY}`,
  integrations: [new BrowserTracing(), new SentryRRWeb({})],
  tracesSampleRate: 1.0,
  enabled: false,
});

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={SwTheme}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StyledEngineProvider>
);

ensureVariablesExist(environment, swEnvVariables);
reportWebVitals(null);
