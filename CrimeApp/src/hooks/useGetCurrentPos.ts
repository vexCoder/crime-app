
import React from "react";
import Geolocation, {
  GeoPosition 
} from "react-native-geolocation-service";

const useGetCurrentPos = () => {
  const [ error, setError ] = React.useState<string | null>(null);
  const [ pos, setPos ] = React.useState<{lat: number; lng: number}>({
    lat: 0,
    lng: 0
  });

  React.useEffect(() => {
    getPos();
  }, []);

  const getPos = async () => {
    const pos = await new Promise<GeoPosition | undefined>((resolve) => {
      try {
        Geolocation.getCurrentPosition((pos) => {
          setError(null);
          resolve(pos);
        }, (error) => {
          setError(error.message);
          resolve();
        }, {});
      } catch (error) {
        setError(error.message);
        resolve();
      }
    });

    if(pos) {
      setPos({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    }
  };

  return {
    ...pos,
    error
  };
};

export default useGetCurrentPos;