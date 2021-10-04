import React from 'react';
import {Dimensions,
useWindowDimensions} from 'react-native';
import {useSetState} from 'react-use';

export enum Orientation {
  Portrait = 'Portrait',
  Landscape = 'Landscape',
}

const useDimensions = () => {
  const {width, height} = useWindowDimensions();

  let orientation = Orientation.Portrait;
  if (width < height) {
    orientation = Orientation.Portrait;
  } else {
    orientation = Orientation.Landscape;
  }

  const px = (percent: number) => width * (percent / 100);
  const py = (percent: number) => height * (percent / 100);

  const isPortrait = orientation === Orientation.Portrait;
  const isLandscape = orientation === Orientation.Landscape;

  return {
    width,
    height,
    orientation,
    px,
    py,
    bpx: (percents: number[]) => px(percents[isPortrait ? 0 : 1]),
    bpy: (percents: number[]) => py(percents[isPortrait ? 0 : 1]),
    bp: (values: any[]) => values[isPortrait ? 0 : 1],
    isPortrait,
    isLandscape,
  };
};

export default useDimensions;
