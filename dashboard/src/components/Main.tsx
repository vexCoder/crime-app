import { Box, HStack, Stack } from '@chakra-ui/layout';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import { useDeepCompareEffect, useSetState } from 'react-use';
import { Post, useGetLocationOverviewQuery } from '../generated/graphql';
import useAuthGuard from '../hooks/useAuthGuard';
import { useLocalStorageContext } from '../providers/LocalStorage';
import MapSearch from './MapSearch';
import Posts from './Posts';
import _ from 'lodash';


export interface SettingsParams {
  coord: [number, number]
  radius: number,
}

const Main = () => {
  useAuthGuard()
  const {setKeyValue, loadKeyValue} = useLocalStorageContext()
  const [newPosts, setNewPosts] = React.useState<string[]>([])
  const [ids, setIds] = React.useState<string[]>([])
  const [posts, setPosts] = React.useState<Post[]>([])
  const [settings, setSettings] = useSetState<SettingsParams>({
    coord: [0, 0],
    radius: 25
  });

  const res = useGetLocationOverviewQuery({
    pollInterval: 5000,
    variables: {
      location: {
        lat: settings.coord[1],
        lng: settings.coord[0],
      },
      radius: settings.radius,
      allowInvalid: true
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true
  })

  React.useEffect(() => {
    const _settings = loadKeyValue('settings')
    if(_settings){
      setSettings(_settings as any)
    }

  }, []);

  React.useEffect(() => {
    if(!res.loading){
      const _ids = data.map(v => v._id)
      const check = _.isEqual(_ids, ids)
      console.log(check)
      if(!check){
        const newIds = _ids.filter(v => !ids.includes(v))
        setIds(_ids)
        setNewPosts(newIds)
        console.log(_ids, newIds, ids)
      }
      setPosts(data)
    }
  }, [res.loading]);

  const data = res?.data?.getLocationOverview?.posts || []
  const users = res?.data?.getLocationOverview?.users || []

  return (
    <Box p='10' boxSizing='border-box'>
      <Stack flexDirection={['column', 'column', 'row', 'row', 'row']} align='flex-start'>
        <MapSearch
          refetch={() => res.refetch()}
          responders={users}
          posts={data}
          settings={settings}
          onChange={(_settings) => {
            const nsettings = {
              ...settings,
              ..._settings
            }
            setSettings(_settings)
            setKeyValue({ settings: nsettings })
          }}
        />
        <Posts refetch={() => res.refetch()} newPosts={newPosts} posts={posts} settings={settings} />
      </Stack>
    </Box>
  );
}

export default Main;
