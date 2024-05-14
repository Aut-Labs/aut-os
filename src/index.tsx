import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import store from "@store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { swEnvVariables, environment } from "@api/environment";
import { WagmiProvider } from "wagmi";
// import markerSDK from "@marker.io/browser";
// import SentryRRWeb from "@sentry/rrweb";
// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/tracing";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ensureVariablesExist } from "@utils/env";
import AutTheme from "./theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@store/graphql";
import { wagmiConfig } from "@aut-labs/connector";

// markerSDK.loadWidget({
//   destination: `${process.env.REACT_APP_MARKER}`,
//   reporter: {
//     email: "frontend@aut.id",
//     fullName: "My ĀutID"
//   }
// });

// Sentry.init({
//   dsn: `https://8f91c8136aa64eb294261b7dc8e09929@o1432500.ingest.sentry.io/${process.env.REACT_APP_SENTRY}`,
//   integrations: [new BrowserTracing(), new SentryRRWeb({})],
//   tracesSampleRate: 1.0,
//   enabled: false
// });

const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={AutTheme}>
            <CssBaseline />
            <Provider store={store}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </Provider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ApolloProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

ensureVariablesExist(environment, swEnvVariables);
reportWebVitals(null);
