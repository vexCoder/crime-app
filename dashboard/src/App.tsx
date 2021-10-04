import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "./providers/Apollo";
import Router from "./Router";
import { ToastProvider } from "./providers/Toast";
import { LocalStorageProvider } from "./providers/LocalStorage";
import { LocationProvider } from "./providers/Location";

const App = (
  <ChakraProvider>
    <LocalStorageProvider>
      <ToastProvider>
        <ApolloProvider>
          <LocationProvider>
            <React.StrictMode>
              <Router />
            </React.StrictMode>
          </LocationProvider>
        </ApolloProvider>
      </ToastProvider>
    </LocalStorageProvider>
  </ChakraProvider>
);

export default App;
