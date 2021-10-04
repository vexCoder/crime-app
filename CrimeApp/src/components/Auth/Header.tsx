import { StackNavigationProp } from "@react-navigation/stack";
import { HStack,
  Text } from "native-base";
import React from "react";
import Logo from "../../assets/Logo";
import { AuthStackParamList } from "../../containers/AuthScreen";

interface HeaderProps {
  selected: "login" | "register";
  navigation: StackNavigationProp<AuthStackParamList>;
}

const Header = ({ selected, navigation }: HeaderProps) => {
  const isLogin = selected === "login";
  const isRegister = selected === "register";

  const handleNavigate = (route: "AuthLogin" | "AuthRegister") => () => {
    navigation.navigate(route);
  };

  const getStyle = (check: boolean) => {
    return {
      color: check ? "gray.700" : "gray.400",
      borderBottomWidth: check ? 2 : 0,
      borderBottomColor: "gray.700",
    };
  };

  return (
    <HStack
      paddingTop={8}
      space={8}
      paddingX={8}
      flexBasis={70}
    >
      <Logo
        color="gray.400"
        size="24px"
      />
      <Text
        onPress={handleNavigate("AuthLogin")}
        paddingBottom={2}
        {...getStyle(isLogin)}
      >
        Login
      </Text>
      <Text
        onPress={handleNavigate("AuthRegister")}
        paddingBottom={2}
        {...getStyle(isRegister)}
      >
        Register
      </Text>
    </HStack>
  );
};

export default Header;
