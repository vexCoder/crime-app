import {
  createStackNavigator, StackNavigationProp 
} from "@react-navigation/stack";
import {
  Text 
} from "native-base";
import React from "react";
import {
  View, StyleSheet 
} from "react-native";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import {
  useAuthGuard 
} from "../hooks";
import {
  RootParamList 
} from "./Routes";

export type AuthStackParamList = {
  AuthLogin: undefined;
  AuthRegister: undefined;
};

const AuthStack = createStackNavigator();

interface DashboardScreenProps {
  navigation: StackNavigationProp<RootParamList>;
}

const AuthScreen = ({ navigation }: DashboardScreenProps) => {
  useAuthGuard<StackNavigationProp<RootParamList>>(navigation);

  return (
    <AuthStack.Navigator
      initialRouteName="AuthLogin"
      screenOptions={{ header: () => null }}
    >
      <AuthStack.Screen
        name="AuthLogin"
        component={Login}
      />
      <AuthStack.Screen
        name="AuthRegister"
        component={Register}
      />
    </AuthStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default AuthScreen;
