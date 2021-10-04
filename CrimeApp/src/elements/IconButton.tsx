import React from "react";
import { TouchableHighlight,
  TouchableHighlightProps } from "react-native";
import { State } from "react-native-gesture-handler";

interface IconButtonProps extends TouchableHighlightProps {
  icon: any;
}

const IconButton = ({ icon: Icon, ...props }: IconButtonProps) => {
  const [ state, setState ] = React.useState<State>(0);
  return <TouchableHighlight {...props}>{Icon}</TouchableHighlight>;
};

export default IconButton;
