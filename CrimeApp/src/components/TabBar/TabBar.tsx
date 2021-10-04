import React from "react";
import {
  BottomTabBarProps, BottomTabBarOptions 
} from "@react-navigation/bottom-tabs";
import {
  HStack, View, Text, VStack 
} from "native-base";
import {
  useDimensions 
} from "../../hooks";
import {
  TouchableOpacity 
} from "react-native";

const TabBar = ({ descriptors, state, navigation, activeTintColor }: BottomTabBarProps<BottomTabBarOptions>) => {
  const dim = useDimensions();
  
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  
  return (
    <View
      position="absolute"
      bottom={0}
      width="100%"
    >
      <View
        backgroundColor="black"
        padding={1}
        margin={5}
        borderRadius={dim.width / 2}
        height={45}
        shadow={7}
      >
        <HStack>
          {
            state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;
              const isFocused = state.index === index;
              let color = isFocused ? activeTintColor : "gray.400";

              if(route.name === "DashboardHotline" && isFocused) color = "red.400";
              if(!color) color = "blue.400";

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
    
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };
    
              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };
            
              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={{
                    flex: 1
                  }}
                >
                  <VStack
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {options.tabBarIcon && options.tabBarIcon({
                      color,
                      size: 5,
                      focused: isFocused
                    })}
                  </VStack>
                </TouchableOpacity>
              );
            })
          }
        </HStack>
      </View>
    </View>
  );
};

export default TabBar;
