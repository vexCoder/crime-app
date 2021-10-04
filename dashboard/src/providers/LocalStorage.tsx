import React from 'react';
import { useLocalStorage } from 'react-use';

interface ILocalStorageContextProps {
  children: React.ReactChild[] | React.ReactChild;
}

interface ILocalStorageContextValue {
  setKeyValue: (val: Record<string, any>) => void;
  loadKeyValue: (key: string) => string;
  clearKey: (key: string) => void;
  value: Record<string, any>;
}

const LocalStorageContext =
  React.createContext<ILocalStorageContextValue>({} as ILocalStorageContextValue);

const LocalStorageProvider: React.FunctionComponent<ILocalStorageContextProps> =
  ({ children }) => {
    const [v, setValue] = useLocalStorage('@storage', {});
    const value = v as any

    const setKeyValue = (val: Record<string, any>) => {
      const nvalue = window.localStorage.getItem('@storage')
      if(nvalue) {
        const parse = JSON.parse(nvalue)
        setValue({...parse, ...val});
      }
    };

    const loadKeyValue = (key: string) => {
      const nvalue = window.localStorage.getItem('@storage')
      if(nvalue) {
        const parse = JSON.parse(nvalue)
        return parse[key];
      }
      return null
    };

    const clearKey = (key: string) => {
      const nobj = {...value}
      delete nobj[key]
      setValue(nobj);
    };

    return (
      <LocalStorageContext.Provider
        value={{ setKeyValue, loadKeyValue, clearKey, value }}
      >
        {children}
      </LocalStorageContext.Provider>
    );
  };

const useLocalStorageContext = () => {
  const context: ILocalStorageContextValue =
    React.useContext(LocalStorageContext);
  if (context === undefined) {
    throw new Error('Context must be used within a LocalStorageProvider');
  }
  return context;
};

export { LocalStorageProvider, useLocalStorageContext };
