import {
  createIcon 
} from "native-base";
import React from "react";
import {
  Path, rgbaArray 
} from "react-native-svg";

interface LogoutIconProps {
  size?: number
  color?: string | number | rgbaArray | undefined
}

const LogoutIcon = ({ size = 32, color = "black" }: LogoutIconProps) => {
  const _LogoutIcon = createIcon({
    viewBox: "0 0 122.775 122.776",
    path: [
      <Path 
        key="_LogoutIcon-path-1"
        fillRule="evenodd"
        fill={color}
        d="M86 28.074v-20.7c0-3.3-2.699-6-6-6H6c-3.3 0-6 2.7-6 6v84.801c0 2.199 1.3 4.299 3.2 5.299l45.6 23.601c2 1 4.4-.399 4.4-2.7v-23H80c3.301 0 6-2.699 6-6v-32.8H74v23.8c0 1.7-1.3 3-3 3H53.3v-50.9c0-2.2-1.3-4.3-3.2-5.3l-26.9-13.8H71c1.7 0 3 1.3 3 3v11.8h12v-.101z"
      />,
      <Path 
        key="_LogoutIcon-path-2"
        fillRule="evenodd"
        fill={color}
        d="M101.4 18.273l19.5 19.5c2.5 2.5 2.5 6.2 0 8.7l-19.5 19.5c-2.5 2.5-6.301 2.601-8.801.101-2.399-2.399-2.1-6.4.201-8.8l8.799-8.7H67.5c-1.699 0-3.4-.7-4.5-2-2.8-3-2.1-8.3 1.5-10.3.9-.5 2-.8 3-.8h34.1s-8.699-8.7-8.799-8.7c-2.301-2.3-2.601-6.4-.201-8.7 2.4-2.4 6.3-2.301 8.8.199z"
      />,
    ],
  });

  return (
    <_LogoutIcon size={size}/>
  );
};

export default LogoutIcon;