import { createIcon } from "native-base";
import React from "react";
import { Path, rgbaArray } from "react-native-svg";

interface HotlineIconProps {
  size?: number
  color?: string | number | rgbaArray | undefined
}

const HotlineIcon = ({ size = 32, color = "black" }: HotlineIconProps) => {
  const _HotlineIcon = createIcon({
    viewBox: "0 0 16 16",
    path: [
      <Path
        key="_HotlineIcon-path"
        fillRule="evenodd"
        fill={color}
        d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"
      />,
    ],
  });

  return (
    <_HotlineIcon size={size}/>
  );
};

export default HotlineIcon;

