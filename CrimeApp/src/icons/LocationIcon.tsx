/* eslint-disable react/jsx-key */
import {
  createIcon 
} from "native-base";
import React from "react";
import {
  Path, rgbaArray,
} from "react-native-svg";

interface LocationIconProps {
  size?: number
  color?: string | number | rgbaArray | undefined
}

const LocationIcon = ({ size = 32, color = "black" }: LocationIconProps) => {
  const _LocationIcon = createIcon({
    viewBox:"0 0 16 16",
    path: [
      <Path
        d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"
        fillRule="evenodd"
        fill={color}
      />,
    ],
  });

  return (
    <_LocationIcon size={size}/>
  );
};

export default LocationIcon;

