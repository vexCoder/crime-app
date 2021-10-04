import React from 'react';
import { Post, useStatusQuery, useUpdateResponderLocationMutation } from '../generated/graphql';
import { useToast } from './Toast';

interface LocationContextValues {
  trackLocation: (target: Post) => void;
  clearTracker: () => void;
  location: GeolocationCoordinates | undefined;
  target: Post | undefined;
}

const LocationContext = React.createContext({} as LocationContextValues)

const LocationProvider: React.FC<{}> = ({children}) => {
  const [target, setTarget] = React.useState<Post>()
  const [location, setLoc] = React.useState<GeolocationCoordinates | undefined>();
  const [tracker, setTracker] = React.useState<number | undefined>();
  const toast = useToast()

  const [updateLoc, ] = useUpdateResponderLocationMutation()

  const trackLocation = (target: Post) => {
    setTarget(target)
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLoc(pos.coords)
        updateLoc({
          variables: {
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            },
            target: {
              lat: target.location.lat,
              lng: target.location.lng
            },
            tracking: true
          }
        })
      },
      (err) => {
        toast.error('Geolocation failed, check console for error, stopping...')
        console.error(err)
        setTarget(undefined)
        updateLoc({
          variables: {
            tracking: false
          }
        })
      },
      {
        timeout: 5000
      }
    )

    setTracker(id)
  }

  const clearTracker = () => {
    if(tracker){
      navigator.geolocation.clearWatch(tracker)
      setTarget(undefined)
      updateLoc({
        variables: {
          tracking: false
        }
      })
    }
  }

  return (
    <LocationContext.Provider value={{trackLocation, clearTracker, location, target}}>
      {children}
    </LocationContext.Provider>
  );
}

const useLocation = () => {
  const context = React.useContext(LocationContext)
  if(context === undefined) {
    throw new Error('Location context should be used inside a LocationProvider')
  }
  return context
}

export {LocationProvider, useLocation};
