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

MapboxGL.setAccessToken("pk.eyJ1IjoidmFuaXR5MDExIiwiYSI6ImNrZmYyM29ndzBhaTQyeXBqNWFhY24ybHYifQ.0dCVSTLN0OH6WH9IW02Tjw");

const styles = StyleSheet.create({
  map: {
    backgroundColor: "white",
    flex: 1
  },
});

interface ReportMapProps {
  lat?: number, 
  lng?: number,
  onChangeCoordinate?: (coord: [number, number]) => void;
}

const ReportMap = ({ lat = 0, lng = 0, onChangeCoordinate }: ReportMapProps) => {
  const [ cam, setCam ] = React.useState<MapboxGL.Camera>();
  const [ coord, setCoord ] = React.useState<[number, number]>([ 0, 0 ]);
  const viewRef = React.useCallback((node: MapboxGL.Camera) => {
    if(node){
      setCam(node);
    }
  }, [ ]);

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

  React.useEffect(() => {
    if(cam){
      cam.moveTo([ lng, lat ], 1500);
      setCoord([ lng, lat ]);
    }
  }, [ lat, lng, cam ]);

  return (
    <View
      w="100%"
      h={300}
      borderRadius={15}
      overflow="hidden"
      shadow={2}
    >
      <MapboxGL.MapView
        style={styles.map}
        zoomEnabled={true}
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
        <MapboxGL.PointAnnotation
          id="selected-pos"
          coordinate={coord}
        />
      </MapboxGL.MapView>
    </View>
  );
};

export default ReportMap;
