import { createIcon } from "native-base";
import React from "react";
import { Path, rgbaArray } from "react-native-svg";

interface OverviewIconProps {
  size?: number
  color?: string | number | rgbaArray | undefined
}

const OverviewIcon = ({ size = 32, color = "black" }: OverviewIconProps) => {
  const _OverviewIcon = createIcon({
    viewBox: "0 0 16 16",
    path: [
      <Path
        key="_OverviewIcon-path"
        fillRule="evenodd"
        fill={color}
        d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"
      />,
    ],
  });

  return (
    <_OverviewIcon size={size}/>
  );
};

export default OverviewIcon;