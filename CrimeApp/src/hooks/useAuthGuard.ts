import {
  NavigationProp 
} from "@react-navigation/native";
import React from "react";
import {
  useStatusQuery 
} from "../generated/graphql";
import {
  PeriodicCrimeFetch 
} from "../utils/native";
import {
  useApollo 
} from "../providers/Apollo";


const useAuthGuard = <T extends NavigationProp<any>>(navigation: T) => {
  const [ mounted, setMounted ] = React.useState(false);
  const { refetch } = useApollo();
  const res = useStatusQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  const user = res.data?.status.user;

  const startService = async () => {
    const check = await PeriodicCrimeFetch.startService();
  };

  React.useEffect(() => {
    if(!res.loading && mounted){
      if(user){
        startService();
        navigation.navigate("Dashboard" as any);
      }else{
        navigation.navigate("Auth" as any);
      }
    }else if(!mounted){
      setMounted(true);
      refetch("status");
    }
  }, [ res.loading ]);


  return {
    user,
    refetch: () => res.refetch()
  };
};

export default useAuthGuard;