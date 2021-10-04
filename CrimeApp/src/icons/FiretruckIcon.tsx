/* eslint-disable react/jsx-key */
import { createIcon } from "native-base";
import React from "react";
import { Path, rgbaArray, Circle } from "react-native-svg";

interface FiretruckIconProps {
  size?: number
  color?: string | number | rgbaArray | undefined
}

const FiretruckIcon = ({ size = 32, color = "black" }: FiretruckIconProps) => {
  const _FiretruckIcon = createIcon({
    viewBox: "0 0 512 512",
    path: [
      <Path
        d="m211 121h30v60h-30z"
        fill="#5b5555"
      />,
      <Path
        d="m211 121h30v60h-30z"
        fill="#5b5555"
      />,
      <Path
        d="m317 196v210l-15 30h-302v-90h30v-30h-30v-150h302z"
        fill="#ff8066"
      />,
      <Path
        d="m317 196v210l-15 30h-76v-270h76z"
        fill="#fd435b"
      />,
      <Path
        d="m512 316v-30l-150-120h-30l-15 30v210l15 30h180v-90l-30-15z"
        fill="#fd435b"
      />,
      <Path
        d="m467 136c-5.156 0-10.21-.864-15.029-2.578l-119.971-42.422 120-42.422c4.79-1.714 9.844-2.578 15-2.578 24.814 0 45 20.186 45 45s-20.186 45-45 45z"
        fill="#dfe7f4"
      />,
      <Path
        d="m407 466c-24.814 0-45-20.186-45-45s20.186-45 45-45 45 20.186 45 45-20.186 45-45 45z"
        fill="#5b5555"
      />,
      <Circle
        cx="407"
        cy="421"
        fill="#dfe7f4"
        r="15"
      />,
      <Path
        d="m91 466c-24.814 0-45-20.186-45-45s20.186-45 45-45 45 20.186 45 45-20.186 45-45 45z"
        fill="#766e6e"
      />,
      <Circle
        cx="91"
        cy="421"
        fill="#f0f7ff"
        r="15"
      />,
      <Path
        d="m181 466c-24.814 0-45-20.186-45-45s20.186-45 45-45 45 20.186 45 45-20.186 45-45 45z"
        fill="#766e6e"
      />,
      <Circle
        cx="181"
        cy="421"
        fill="#f0f7ff"
        r="15"
      />,
      <Path
        d="m477.811 166h-115.811v120h150z"
        fill="#463f3f"
      />,
      <Path
        d="m0 316h61v30h-61z"
        fill="#fd435b"
      />,
      <Path
        d="m452 316h60v30h-60z"
        fill="#fc6"
      />,
      <Path
        d="m302 166h30v270h-30z"
        fill="#5b5555"
      />,
      <Path
        d="m226 46c-41.4 0-75 33.6-75 75v15h151v-90z"
        fill="#ff8066"
      />,
      <Path
        d="m226 46h76v90h-76z"
        fill="#fd435b"
      />,
      <Path
        d="m106 256h120v30h-120z"
        fill="#f0f7ff"
      />,
      <Path
        d="m91 226h30v90h-30z"
        fill="#f0f7ff"
      />,
      <Path
        d="m211 226h30v90h-30z"
        fill="#f0f7ff"
      />,
      <Path
        d="m226 226h15v90h-15z"
        fill="#dfe7f4"
      />
    ],
  });

  return (
    <_FiretruckIcon size={size}/>
  );
};

export default FiretruckIcon;