import {
  ApolloClient,

  ApolloLink, InMemoryCache
} from "@apollo/client";
import {
  setContext 
} from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUploadLink 
} from "apollo-upload-client";
import Geolocation, {
  GeoPosition 
} from "react-native-geolocation-service";
import PushNotification from "react-native-push-notification";
import {
  CheckRadiusNotifyDocument 
} from "../generated/graphql";
import {
  API_URL 
} from "./constants";


const notification = async () => {
  const test = true;
  if(test){
    const res = await AsyncStorage.getItem("@storage");

    const storage = JSON.parse(res || "{}");

    if(storage.token && storage.notification){
      const httpLink = createUploadLink({
        uri: `${API_URL}/graphql`,
        // uri: "https://alisto.xyz/api/graphql",
        credentials: "include"
      }) as any;
      
      const authLink = setContext(async (_, { headers }) => {
        return {
          headers: {
            ...headers,
            authorization: storage.token ? `Bearer ${storage.token}` : ""
          }
        };
      });
  
      const client = new ApolloClient({
        link: ApolloLink.from([ authLink, httpLink ]),
        cache: new InMemoryCache(),
      });

      const pos = await new Promise<GeoPosition | undefined>((resolve) => {
        try {
          Geolocation.getCurrentPosition((pos) => {
            resolve(pos);
          }, (error) => {
            resolve();
          }, {});
        } catch (error) {
          resolve();
        }
      });
      
      if(pos) {
        const res = await client.query({
          query: CheckRadiusNotifyDocument,
          variables: {
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              address: "",
            },
            radius: typeof storage.radius === "number" && !!storage.radius ? storage.radius : 10
          }
        });

        const data = res.data?.checkRadiusNotify?.notification;
        if(data){
          const { crimesNearby } = data;
          console.log("Crime Found:", crimesNearby);
          if(crimesNearby > 0) {
            PushNotification.localNotification({
              channelId: "background-notification",
              title: "Hotzone Warning",
              message: `There are ${crimesNearby} crime that happened in the past 30 seconds in your current area`,
              repeatTime: undefined,
              repeatType: undefined,
              onlyAlertOnce: true
            });
          }
        }
      }
    }
  }
};

export default notification;