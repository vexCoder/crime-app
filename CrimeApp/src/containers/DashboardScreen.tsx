/* eslint-disable react/display-name */
import { Text } from "native-base";
import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Overview from "../components/Overview/Overview";
import Report from "../components/Report/Report";
import Hotline from "../components/Hotline/Hotline";
import Settings from "../components/Settings/Settings";
import HotlineIcon from "../icons/HotlineIcon";
import OverviewIcon from "../icons/OverviewIcon";
import ReportIcon from "../icons/ReportIcon";
import SettingsIcon from "../icons/SettingsIcon";
import TabBar from "../components/TabBar/TabBar";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootParamList } from "./Routes";
import { useAuthGuard } from "../hooks";


const Dashboard = createBottomTabNavigator();

export type DashboardNavParamList = {
  DashboardHotline: undefined;
  DashboardOverview: undefined;
  DashboardSettings: undefined;
  DashboardReport: undefined;
};

interface DashboardScreenProps {
  navigation: StackNavigationProp<RootParamList>;
}

const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  useAuthGuard<StackNavigationProp<RootParamList>>(navigation);
  
  return (
    <Dashboard.Navigator
      initialRouteName="AuthLogin"
      tabBarOptions={{
        iconStyle: {
          marginTop: 6,
        },
        labelPosition: "below-icon",
        labelStyle: {
          marginBottom: 6
        },
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Dashboard.Screen
        name="DashboardHotline"
        component={Hotline}
        options={{
          title: "Hotline",
          tabBarIcon: ({ color }) => <HotlineIcon
            size={4}
            color={color}
          />
        }}
      />
      <Dashboard.Screen
        name="DashboardOverview"
        component={Overview}
        options={{
          title: "Overview",
          tabBarIcon: ({ color,  }) => <OverviewIcon
            size={4}
            color={color}
          />
        }}
      />
      <Dashboard.Screen
        name="DashboardReport"
        component={Report}
        options={{
          title: "Report",
          tabBarIcon: ({ color,  }) => <ReportIcon
            size={4}
            color={color}
          />
        }}
      />
      <Dashboard.Screen
        name="DashboardSettings"
        component={Settings}
        options={{
          title: "Settings",
          tabBarIcon: ({ color,  }) => <SettingsIcon
            size={4}
            color={color}
          />
        }}
      />
    </Dashboard.Navigator>
  );
};

const styles = StyleSheet.create({});

export default DashboardScreen;
