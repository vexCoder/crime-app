import React from "react";
import {
  ApolloClient,
  ApolloProvider as ApolloClientProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  NormalizedCacheObject
} from "@apollo/client";
import {
  setContext
} from "@apollo/client/link/context";
import axios from "axios";
import { config } from "../utils/env";
import { useLocalStorageContext } from "./LocalStorage";


interface IApolloContextProps {
  children: React.ReactChild;
}

interface IApolloContextValue {
  client: ApolloClient<NormalizedCacheObject>
}
const ApolloContext = React.createContext<IApolloContextValue>({} as IApolloContextValue);

const ApolloProvider: React.FunctionComponent<IApolloContextProps> = ({
  children,
}) => {
  const {app} = config()
  const { loadKeyValue } = useLocalStorageContext();

  const httpLink = new HttpLink({
    uri: `${app.api}/api/graphql`,
  }) as any;

  const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    const key = loadKeyValue('token')
    return {
      headers: {
        ...headers,
        authorization: key ? `Bearer ${key}` : ""
      }
    };
  });


  const client = new ApolloClient({
    link: ApolloLink.from([  authLink, httpLink ]),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloContext.Provider
      value={{  client }}
    >
      <ApolloClientProvider client={client}>
        {children}
      </ApolloClientProvider>
    </ApolloContext.Provider>
  );
};

const useApolloContext = () => {
  const context: IApolloContextValue = React.useContext(ApolloContext);
  if (context === undefined) {
    throw new Error("Context must be used within a ApolloProvider");
  }
  return context;
};

export { ApolloProvider, useApolloContext };
