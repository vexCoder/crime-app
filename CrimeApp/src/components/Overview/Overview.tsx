import React from "react";
import {
  useDimensions, useToggle 
} from "../../hooks";
import {
  VStack, HStack , Text, ScrollView, Input, Slider, Box, Button
} from "native-base";
import OverviewIcon from "../../icons/OverviewIcon";
import OverviewMap from "./OverviewMap";
import useGetCurrentPos from "../../hooks/useGetCurrentPos";
import {
  useToast 
} from "../../providers/Toast";
import {
  useSetState, useDebounce, useInterval 
} from "react-use";
import _ from "lodash";
import OverviewSettings from "./OverviewSettings";
import OverviewData from "./OverviewData";
import {
  useGetLocationOverviewQuery, Post 
} from "../../generated/graphql";
import OverviewRadius from "./OverviewRadius";


export interface Settings {
  address: string;
  lat: number;
  lng: number;
  radius: number;
}

const Overview = () => {
  const dim = useDimensions();
  const toast = useToast();
  const { lat, lng, error } = useGetCurrentPos();
  const [ open, toggleSettings ] = useToggle();
  const [ settings, setSettings ] = useSetState<Settings>({
    address: "",
    lat: 0,
    lng: 0,
    radius: 0.01,
  });

  
  
  const [ ids, setIds ] = React.useState<string[]>([]);
  const [ posts, setPosts ] = React.useState<Post[]>([]);
  const [ newPosts, setNewPosts ] = React.useState<string[]>([]);
  
  const { data, refetch, loading, startPolling, stopPolling } = useGetLocationOverviewQuery({
    pollInterval: 5000,
    variables: {
      location: {
        lat: settings.lat,
        lng: settings.lng,
        address: settings.address,
      },
      radius: settings.radius
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true
  });

  React.useEffect(() => {
    if(!loading){
      const _ids = _posts.map(v => v._id);
      const check = _.isEqual(_ids, ids);
      if(!check){
        const newIds = _ids.filter(v => !ids.includes(v));
        setIds(_ids);
        setNewPosts(newIds);
      }
      setPosts(_posts);
    }
  }, [ loading ]);

  React.useEffect(() => {
    refetch();
  }, []);

  React.useEffect(() => {
    if(error) toast.error(error);
  }, [ error ]);
  
  React.useEffect(() => {
    if(typeof lat === "number" && typeof lng === "number" && !error){
      setSettings({
        lat,
        lng
      });
    }
  }, [ lat, lng ]);

  const handleChangeSettings = (val: Partial<Settings>) => {
    setSettings(val);
  };

  
  const _posts = data?.getLocationOverview?.posts || [];
  const responders = data?.getLocationOverview?.users || [];
  const stats = data?.getLocationOverview?.stats;

  return (
    <VStack
      backgroundColor="white"
      flex={1}
      paddingTop={dim.py(5)}
    >
      <HStack
        paddingX={dim.bpx([ 5, 25 ])}
        alignItems="center"
        space={2}
        paddingBottom={dim.py(2)}
      >
        <OverviewIcon size={5}/>
        <Text
          fontSize="xl"
          fontWeight={700}
          color="black"
        >Overview</Text>
      </HStack>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VStack
          pt={dim.py(2)}
          pb={dim.py(10)}
          alignItems="center"
          flex={1}
        >
          <Box
            w="100%"
            px={dim.px(5)}
            mb="10px"
          >
            <Button
              size="sm"
              w="100%"
              onPress={() => toggleSettings(true)}
            >
              <Text color="white">Change Address Settings</Text>
            </Button>
          </Box>
          <OverviewSettings
            open={open}
            handleSubmit={handleChangeSettings}
            handleClose={() => toggleSettings(false)}
          />
          <OverviewRadius update={setSettings} />
          <Box
            w="100%"
            px={dim.px(5)}
          >
            <OverviewMap
              settings={settings}
              posts={posts}
              responders={responders}
              onChangeCoordinate={(data) => setSettings({ lat: data[1], lng: data[0] })}
            />
          </Box>
          <OverviewData
            posts={posts}
            settings={settings}
            newPosts={newPosts}
            stats={stats}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export default Overview;
