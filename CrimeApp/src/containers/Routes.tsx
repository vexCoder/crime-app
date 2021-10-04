import {
  NavigationContainer 
} from "@react-navigation/native";
import {
  createStackNavigator 
} from "@react-navigation/stack";
import React from "react";
import {
  StyleSheet 
} from "react-native";
import AuthScreen from "./AuthScreen";
import DashboardScreen from "./DashboardScreen";

const Stack = createStackNavigator();

export type RootParamList = {
  Auth: undefined;
  Dashboard: undefined;
};

const Routes = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{ header: () => null }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default Routes;
