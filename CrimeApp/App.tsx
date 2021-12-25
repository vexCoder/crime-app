/* eslint-disable react-native/split-platform-components */

import {
  NativeBaseProvider 
} from "native-base";
import React from "react";
import {
  StatusBar, useColorScheme, PermissionsAndroid
} from "react-native";
import {
  SafeAreaProvider 
} from "react-native-safe-area-context";
import Routes from "./src/containers/Routes";
import {
  StorageProvider 
} from "./src/providers/Storage";
import {
  ToastProvider 
} from "./src/providers/Toast";
import {
  ApolloProvider 
} from "./src/providers/Apollo";



const App = () => {
  const isDarkMode = useColorScheme() === "dark";

  const requestPermission = async () => {
    await PermissionsAndroid.requestMultiple( [ 
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, 
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE
    ] );
  };

  React.useEffect(() => {
    requestPermission();
  }, []);

  return (
    <StorageProvider>
      <ApolloProvider>
        <NativeBaseProvider>
          <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <ToastProvider>
              <Routes />
            </ToastProvider>
          </SafeAreaProvider>
        </NativeBaseProvider>
      </ApolloProvider>
    </StorageProvider>
  );
};

export default App;
