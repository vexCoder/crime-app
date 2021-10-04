import {
  createIcon 
} from "native-base";
import React from "react";
import {
  Path, rgbaArray 
} from "react-native-svg";

interface RadiusIconProps {
  size?: number
  color?: string | number | rgbaArray | undefined
}

const RadiusIcon = ({ size = 32, color = "black" }: RadiusIconProps) => {
  const _RadiusIcon = createIcon({
    viewBox: "0 0 508.542 508.542",
    path: [
      <Path 
        key="_RadiusIcon-path-1"
        fillRule="evenodd"
        fill={color}
        d="M254.57 270.761c-9.107 0-16.49-7.383-16.49-16.49s7.383-16.49 16.49-16.49h253.674c-3.925-61.697-29.81-119.16-73.917-163.267-99.345-99.345-260.154-99.36-359.514 0-99.347 99.347-99.36 260.154 0 359.514 99.345 99.345 260.154 99.36 359.514 0 44.107-44.106 69.992-101.569 73.917-163.267z"
      />

    ],
  });

  return (
    <_RadiusIcon size={size}/>
  );
};

export default RadiusIcon;