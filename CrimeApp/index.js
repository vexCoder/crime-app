/**
 * @format
 */
import "react-native-gesture-handler";
import {
  AppRegistry 
} from "react-native";
import App from "./App";
import {
  name as appName 
} from "./app.json";
import Notification from "./src/utils/notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, { 
  Importance 
} from "react-native-push-notification";

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask("PeriodicCrimeFetch", () => Notification);
PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },

  onRegistrationError: function(err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: "background-notification", // (required)
    channelName: "My channel", // (required)
    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    playSound: false, // (optional) default: true
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);