import { createIcon } from "native-base";
import React from "react";
import { Path, rgbaArray } from "react-native-svg";

interface ReportIconProps {
  size?: number
  color?: string | number | rgbaArray | undefined
}

const ReportIcon = ({ size = 32, color = "black" }: ReportIconProps) => {
  const _ReportIcon = createIcon({
    viewBox: "0 0 16 16",
    path: [
      <Path
        key="_ReportIcon-path"
        fillRule="evenodd"
        fill={color}
        d="M1.592 2.712L2.38 7.25h4.87a.75.75 0 110 1.5H2.38l-.788 4.538L13.929 8 1.592 2.712zM.989 8L.064 2.68a1.341 1.341 0 011.85-1.462l13.402 5.744a1.13 1.13 0 010 2.076L1.913 14.782a1.341 1.341 0 01-1.85-1.463L.99 8z"
      />,
    ],
  });

  return (
    <_ReportIcon size={size}/>
  );
};

export default ReportIcon;