import React from "react";
import {
  ApolloClient,
  ApolloProvider as ApolloClientProvider,
  InMemoryCache,
  ApolloLink,
  NormalizedCacheObject
} from "@apollo/client";
import {
  setContext 
} from "@apollo/client/link/context";
import {
  useStorage 
} from "./Storage";
import {
  createUploadLink 
} from "apollo-upload-client";
import {
  API_URL 
} from "../utils/constants";


interface IApolloContextProps {
  children: React.ReactChild;
}

interface IApolloContextValue {
  refetch: (key: string) => void,
  client: ApolloClient<NormalizedCacheObject>
}


const ApolloContext = React.createContext<IApolloContextValue>({} as IApolloContextValue);

const ApolloProvider: React.FunctionComponent<IApolloContextProps> = ({
  children,
}) => {
  const { get } = useStorage();

  const httpLink = createUploadLink({
    uri: `${API_URL}/graphql`,
    // uri: "https://alisto.xyz/api/graphql",
    credentials: "include"
  }) as any;
  
  const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    const key = await get("token");
    return {
      headers: {
        ...headers,
        authorization: key ? `Bearer ${key}` : ""
      }
    };
  });
  
  const client = new ApolloClient({
    link: ApolloLink.from([ authLink, httpLink ]),
    cache: new InMemoryCache(),
  });

  const refetch = async (key: string) => {
    await client.cache.evict({
      fieldName: key
    });
  };

  return (
    <ApolloContext.Provider
      value={{ refetch, client }}
    >
      <ApolloClientProvider client={client}>
        {children}
      </ApolloClientProvider>
    </ApolloContext.Provider>
  );
};

const useApollo = () => {
  const context: IApolloContextValue = React.useContext(ApolloContext);
  if (context === undefined) {
    throw new Error("Context must be used within a ApolloProvider");
  }
  return context;
};

export { ApolloProvider, useApollo };
