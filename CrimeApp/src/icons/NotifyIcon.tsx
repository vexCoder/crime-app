import {
  createIcon 
} from "native-base";
import React from "react";
import {
  Path, rgbaArray 
} from "react-native-svg";

interface NotifyIconProps {
  size?: number
  color?: string | number | rgbaArray | undefined
}

const NotifyIcon = ({ size = 32, color = "black" }: NotifyIconProps) => {
  const _NotifyIcon = createIcon({
    viewBox: "0 0 512 512",
    path: [
      <Path 
        key="_NotifyIcon-path-1"
        fillRule="evenodd"
        fill={color}
        d="M499.379 169.782a15.001 15.001 0 003.457-19.081l-37.682-65.265a15.001 15.001 0 00-18.253-6.547l-12.83 4.807 54.73 94.793 10.578-8.707zM293.56 357.058c-26.923 8.438-54.033 19.384-78.679 33.605l-13.042 7.529 55.89 96.805c2.778 4.813 7.82 7.503 13.004 7.502 2.545 0 5.124-.648 7.486-2.012l60.622-35a15.001 15.001 0 005.49-20.49l-50.771-87.939zM64.041 277.938c-8.097 4.675-13.888 12.222-16.308 21.252a35.033 35.033 0 00-1.099 11.827L7.61 333.112a15.004 15.004 0 00-5.6 20.553l35.324 61.182c2.776 4.81 7.817 7.503 13.004 7.503 2.504 0 5.043-.628 7.377-1.949l38.337-21.705a35.194 35.194 0 0022.07 7.803 34.78 34.78 0 0017.44-4.682l38.284-22.102-71.525-123.876-38.28 22.099zM509.99 275.187L360.921 16.998A14.998 14.998 0 00347.968 9.5h-.038a15.003 15.003 0 00-12.953 7.436c-.922 1.578-93.488 158.557-206.674 223.903l71.524 123.875c63.15-36.458 140.242-52.746 193.795-59.989 58.421-7.903 102.349-7.056 103.034-7.041a15.001 15.001 0 0013.334-22.497z"
      />

    ],
  });

  return (
    <_NotifyIcon size={size}/>
  );
};

export default NotifyIcon;