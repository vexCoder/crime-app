import React from "react";
import {
  View, Text 
} from "native-base";
import MapboxGL, {
  Logger  
} from "@react-native-mapbox-gl/maps";
import {
  StyleSheet 
} from "react-native";
import {
  Settings 
} from "./Overview";
import {
  useDeepCompareEffect 
} from "react-use";
import {
  meter2Pixel 
} from "../../utils/helper";
import _ from "lodash";
import {
  Post, useGetCrimeTypesQuery, User 
} from "../../generated/graphql";


MapboxGL.setAccessToken("pk.eyJ1IjoidmFuaXR5MDExIiwiYSI6ImNrZmYyM29ndzBhaTQyeXBqNWFhY24ybHYifQ.0dCVSTLN0OH6WH9IW02Tjw");

const styles = StyleSheet.create({
  map: {
    backgroundColor: "white",
    flex: 1
  },
});

interface OverviewMapProps {
  settings: Settings, 
  onChangeCoordinate?: (coord: [number, number]) => void;
  posts: Post[]
  responders: User[]
}
const OverviewMap = ({ settings, onChangeCoordinate, posts, responders }: OverviewMapProps) => {
  const [ cam, setCam ] = React.useState<MapboxGL.Camera>();
  const [ map, setMap ] = React.useState<MapboxGL.MapView>();
  const [ zoom, setZoom ] = React.useState(15);
  const [ coord, setCoord ] = React.useState<[number, number]>([ 0, 0 ]);
  const mapRef = React.useCallback((node: MapboxGL.MapView) => {
    if(node){
      setMap(node);
    }
  }, [ ]);
  const viewRef = React.useCallback((node: MapboxGL.Camera) => {
    if(node){
      setCam(node);
    }
  }, [ ]);
  const res = useGetCrimeTypesQuery({
    fetchPolicy: "network-only"
  });

  const types = res.data?.getCrimeTypes?.types || [];

  React.useEffect(() => {
    Logger.setLogCallback(log => {
      const { message } = log;
      if (
        message.match("Request failed due to a permanent error: Canceled") ||
        message.match("Request failed due to a permanent error: Socket Closed")
      ) {
        return true;
      }
      return false;
    });
  }, []);

  useDeepCompareEffect(() => {
    if(cam){
      const { lat, lng } = settings;
      cam.moveTo([ lng, lat ], 1500);
      setCoord([ lng, lat ]);
    }
  }, [ settings, cam ]);

  const circleShape = {
    // circleRadius: meter2Pixel(settings.lat, settings.radius / 1000, zoom),
    circleRadius: meter2Pixel(coord[1], settings.radius * 1000, zoom),
    circleColor: "#f00",
    circleOpacity: 0.2,
  };

  const reportShaper = (color = "#f00") => ({
    // circleRadius: meter2Pixel(settings.lat, settings.radius / 1000, zoom),
    circleRadius: 5,
    circleColor: color,
    circleOpacity: 0.5,
  });

  const responderShaper = (lat: number) => ({
    // circleRadius: meter2Pixel(settings.lat, settings.radius / 1000, zoom),
    circleRadius: meter2Pixel(lat, 0.1 * 1000, zoom),
    circleColor: "#2563eb",
    circleOpacity: 0.2,
  });


  const debouncedZoomChange = _.debounce(() => {
    if(map){
      map.getZoom().then((res) => {
        setZoom(res);
      });
    }
  }, 1000);
  
  const features = posts.map(v => {
    const type = types.find(o => o._id === v.type);
    const color = type?.color || "#f00";
    return ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [ v.location.lng, v.location.lat ],
      },
      properties: {
        id: v._id,
        color,
      }
    }) as any;
  });

  const featuresR = responders.map(v => {
    const type = types.find(o => o._id === v.type);
    const color = type?.color || "#f00";
    return ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [ v.currentLoc?.lng, v.currentLoc?.lat ],
      },
      properties: {
        id: v._id,
        layout: "police-15",
      }
    }) as any;
  });

  const shaper = (feature: any) => ({
    "type": "FeatureCollection",
    "features": [ feature ]
  });

  return (
    <View
      w="100%"
      h={300}
      borderRadius={15}
      overflow="hidden"
      shadow={2}
    >
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        zoomEnabled={true}
        onDidFinishRenderingFrame={debouncedZoomChange}
        onRegionDidChange={debouncedZoomChange}
        onPress={(feat) => {
          const geometry = feat.geometry as unknown as {coordinates: [number, number]};
          setCoord(geometry.coordinates);
          if(onChangeCoordinate) onChangeCoordinate(geometry.coordinates);
        }}
      >
        <MapboxGL.Camera
          defaultSettings={{
            zoomLevel: 15
          }}
          ref={viewRef}
        />
        <MapboxGL.ShapeSource
          id="circle"
          shape={shaper({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": coord
            }
          }) as any}
        >
          <MapboxGL.CircleLayer
            id="selected-radius"
            style={circleShape as any}
          />
        </MapboxGL.ShapeSource>
        {
          features.map(v => (
            <MapboxGL.ShapeSource
              key={v.properties.id}
              id={`posts-layer-location-${v.properties.id}`}
              shape={shaper(v) as any}
            >
              <MapboxGL.CircleLayer
                key={v.properties.id}
                id={v.properties.id}
                style={reportShaper(v.properties.color) as any}
              />
              
            </MapboxGL.ShapeSource>
          ))
        }
        {
          featuresR.map(v => (
            <>
              <MapboxGL.ShapeSource
                key={v.properties.id}
                id={`responder-layer-location-${v.properties.id}`}
                shape={shaper(v) as any}
              >
                <MapboxGL.CircleLayer
                  key={v.properties.id}
                  id={v.properties.id}
                  style={responderShaper(v.geometry.coordinates[1]) as any}
                />
              </MapboxGL.ShapeSource>
              <MapboxGL.ShapeSource
                key={v.properties.id}
                id={`responder-layer-symbol-location-${v.properties.id}`}
                shape={shaper(v) as any}
              >
                <MapboxGL.SymbolLayer
                  key={`symbol-${v.properties.id}`}
                  id={`symbol-${v.properties.id}`}
                  style={{
                    iconImage: "police-15",
                    iconSize: 1,
                  }}
                />
              </MapboxGL.ShapeSource>
            </>
          ))
        }
        <MapboxGL.PointAnnotation
          id="selected-pos"
          coordinate={coord}
        />
      </MapboxGL.MapView>
    </View>
  );
};

export default OverviewMap;
