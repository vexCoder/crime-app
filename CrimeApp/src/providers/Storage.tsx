import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";


interface IStorageContextProps {
  children: React.ReactChild;
}

interface IStorageContextValue {
  storage: Record<any, any>,
  refetch: () => void;
  set: (data: Record<any, any>) => void;
  get: (key: string) => Promise<any>;
  unset: (key: string) => Promise<any>;
}

const StorageContext = React.createContext<IStorageContextValue>({} as IStorageContextValue);

const StorageProvider: React.FunctionComponent<IStorageContextProps> = ({
  children,
}) => {
  const [ storage, setStorage ] = React.useState({});

  React.useEffect(() => {
    fetch();
  }, []);

  const getLatest = async () => {
    const res = await AsyncStorage.getItem("@storage");
    if(res) {
      const parsed = JSON.parse(res);
      return parsed;
    }
    return {};
  };

  const fetch = async () => {
    const res = await AsyncStorage.getItem("@storage");
    if(res) setStorage(JSON.parse(res));
  };

  const set = async (data: Record<any, any>) => {
    const store = await getLatest();
    const ndata = {
      ...store,
      ...data
    };
    await AsyncStorage.setItem("@storage", JSON.stringify(ndata));
  };

  const unset = async (key: string) => {
    const store = await getLatest();
    const ndata = _.omit(store, [ key ]);
    setStorage(ndata);
    await AsyncStorage.setItem("@storage", JSON.stringify(ndata));
  };

  const get = async (key: string) => {
    const store = await getLatest();
    if(store[key]) {
      return store[key];
    }
    return null;
  };

  return (
    <StorageContext.Provider
      value={{
        storage,
        refetch: fetch,
        set,
        get,
        unset
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

const useStorage = () => {
  const context: IStorageContextValue = React.useContext(StorageContext);
  if (context === undefined) {
    throw new Error("Context must be used within a StorageProvider");
  }
  return context;
};

export { StorageProvider, useStorage };
