import React from "react";
import {
  Box, Text, Slider 
} from "native-base";
import {
  useDebounce 
} from "react-use";
import {
  useDimensions 
} from "../../hooks";
import {
  Settings 
} from "./Overview";

interface OverviewRadiusProps {
  update: (settings: Partial<Settings>) => void;
}

const OverviewRadius = ({ update }: OverviewRadiusProps) => {
  const dim = useDimensions();
  const [ radius, setRadius ] = React.useState(0);

  useDebounce(() => {
    update({
      radius
    });
  }, 1000, [ radius ]);

  return (
    <Box 
      w="100%" 
      px={dim.px(5)}
    >
      <Text 
        fontSize="sm"
        w="100%"
      >Radius: {radius}km</Text>
      <Box
        w="100%"
        mb="20px"
      >
        <Slider
          value={radius}
          onChange={val => setRadius(val)}
          minValue={0}
          maxValue={5}
          step={0.001}
        >
          <Slider.Track>
            <Slider.FilledTrack />
          </Slider.Track>
          <Slider.Thumb />
        </Slider>
      </Box>
    </Box>
  );
};

export default OverviewRadius;
