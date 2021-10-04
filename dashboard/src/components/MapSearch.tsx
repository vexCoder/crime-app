import { Box, HStack, Text, VStack, StackProps } from '@chakra-ui/layout';
import { Input, Collapse, useOutsideClick, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import { useDebounce, useDeepCompareEffect } from 'react-use';
import { Post, useGetCrimeTypesQuery, User } from '../generated/graphql';
import { config } from '../utils/env';
import { meter2Pixel } from '../utils/helper';
import { searchAddress } from '../utils/mapbox';
import { SettingsParams } from './Main';
import _ from 'lodash';

const Map = ReactMapboxGl({
  accessToken: config().mapbox.key,
});

interface AddressItem {
  center: [number, number];
  id:string;
  name:string;
}

interface MapSearchProps {
  onChange?: (settings: Partial<SettingsParams>) => void
  settings: SettingsParams
  posts: Post[];
  responders: User[];
  refetch: () => void;
}

export const MotionBox = motion<StackProps>(HStack);

const MapSearch = ({onChange, settings, posts, refetch, responders}: MapSearchProps) => {
  const [zoom, setZoom] = React.useState<number>(15)
  const [coord, setCoord] = React.useState<[number, number]>([0,0])
  const [show, setShow] = React.useState(false)
  const [addresses, setAddresses] = React.useState<AddressItem[]>([])
  const [search, setSearch] = React.useState('');
  const [radius, setRadius] = React.useState(0);
  const [input, setInput] = React.useState<HTMLInputElement>();
  const [map, setMap] = React.useState<any>();
  const dropRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useCallback((node: HTMLInputElement) => {
    if(node){
      setInput(node)
    }
  }, [])
  const mapRef = React.useCallback((node: HTMLInputElement) => {
    if(node){
      setMap(node)
    }
  }, [])

  React.useEffect(() => {
    if(map){
      if(settings.coord) setCoord(settings.coord)
      if(settings.radius) setRadius(settings.radius)
    }
  }, [map]);

  const res = useGetCrimeTypesQuery({
    fetchPolicy: "network-only"
  });

  const types = res.data?.getCrimeTypes?.types || [];

  useOutsideClick({
    ref: dropRef,
    handler: () => setShow(false)
  })

  useDebounce(() => {
    if(onChange) {
      onChange({radius})
    }
  }, 1500, [radius])

  useDebounce(() => {
    if(search.length && show){
      searchAddress({address: search, autocomplete: true}).then(res => {
        if(res.data){
          setAddresses(res.data.map((v) => ({
            center: v.center as [number, number],
            id: v.id as string,
            name: v.place_name as string
          })))
        }
      })
    }
  }, 1500, [search])

  return (
    <VStack w={['100%', '100%', 'auto', 'auto', 'auto']} mb='3em' p={['1em', '1em', 0,0,0]}>
      <Box w='100%' pos='relative'>
        <Box
          pos='absolute'
          top={`calc(${input?.clientHeight || 0}px + 0.5rem)`}
          w='100%'
          zIndex={100}
          ref={dropRef}
        >
          <Collapse
            in={show}
            animateOpacity
          >
            <VStack
              bg='white'
              minH={input?.clientHeight || 0}
              maxH={200}
              overflow='auto'
              w='100%'
              borderRadius='md'
              border='1px solid'
              borderColor='gray.200'
              justify='flex-start'
            >
              {
                addresses.map(v => (
                  <MotionBox
                    key={v.id}
                    w='100%'
                    align='center'
                    cursor='pointer'
                    _hover={{background: 'gray.200'}}
                    px='4'
                    onClick={() => {
                      console.log(v.center)
                      setCoord(v.center)
                      setSearch(v.name)
                      setShow(false)
                      if(onChange){
                        onChange({coord: v.center})
                        refetch()
                      }
                    }}
                  >
                    <Text h='auto' >
                      {v.name}
                    </Text>
                  </MotionBox>
                ))
              }
            </VStack>
          </Collapse>
        </Box>
        <Input
          value={search}
          ref={inputRef}
          onChange={(evt) => setSearch(evt.target.value)}
          onClick={() => {
            setShow(true)
          }}
        />
        <VStack mt='4' mb='4' alignItems='flex-start'>
          <Text mb='-1' fontSize='sm' h='auto' >
            {`Radius: ${radius}km`}
          </Text>
          <HStack w='100%'>
            <Slider flex={5} step={0.01} min={0.1} max={25} aria-label="slider-ex-1" defaultValue={50} value={radius} onChange={(val) => {
              if(onChange) setRadius(val)
            }}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Input value={radius || ''} flex={1} min={0.1} max={25} onChange={evt => {
              if(onChange) setRadius(_.clamp(parseFloat(evt.target.value), 0, 25))
            }}/>
          </HStack>
        </VStack>
      </Box>
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        center={coord}
        ref={mapRef as any}
        onClick={(_, evt: any) => {
          const center = evt.lngLat
          if(center && onChange){
            console.log([center.lng, center.lat])
            setCoord([center.lng, center.lat])
            onChange({coord: [center.lng, center.lat]})
            refetch()
          }
        }}
        onZoom={(_, evt:any) => {
          setZoom(evt.target.transform._zoom)
        }}
        zoom={[zoom]}
        containerStyle={{
          height: '400px',
          width: '400px',
          borderRadius: '1em'
        }}
      >
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
          <Feature coordinates={coord} />
        </Layer>
        <Layer type="circle" paint={{
          'circle-radius': meter2Pixel(coord[1], settings.radius * 1000, zoom),
          // 'circle-radius': 10,
          'circle-color': '#E54E52',
          'circle-opacity': 0.2,
        }}>
          <Feature coordinates={coord} />
        </Layer>
        <>
          {
            posts.map(v => {
              const type = types.find(o => v.type === o._id)
              return (
                  <Layer key={v._id} type="circle" paint={{
                    'circle-radius': 5,
                    // 'circle-radius': 10,
                    'circle-color': type?.color,
                    'circle-opacity': 0.8,
                  }}>
                    <Feature coordinates={[v.location.lng, v.location.lat]} />
                  </Layer>
              )
            })
          }
          {
            responders.map(v => {
              const coord = [v.currentLoc?.lng || 0, v.currentLoc?.lat || 0]
              return (
                <>
                  <Layer type="circle" paint={{
                    'circle-radius': meter2Pixel(coord[1], 25, zoom),
                    // 'circle-radius': 10,
                    'circle-color': '#4E94E5',
                    'circle-opacity': 0.5,
                  }}>
                    <Feature coordinates={coord} />
                  </Layer>
                  <Layer
                    key={v._id}
                    type="symbol"
                    layout={{ "icon-image": "police-15", 'icon-size': 1 }}>
                    <Feature coordinates={coord} />
                  </Layer>
                </>
              )
            })
          }
        </>
      </Map>
    </VStack>
  );
}

export default MapSearch;
