import {
  StackNavigationProp 
} from "@react-navigation/stack";
import {
  Box,
  CheckCircleIcon,
  Flex,
  IconButton,
  Input, KeyboardAvoidingView,





  Spinner,
  Stack,
  Text,
  useColorModeValue,
  View,
  VStack,
  Button
} from "native-base";
import React from "react";
import {
  PixelRatio 
} from "react-native";
import {
  useSetState 
} from "react-use";
import {
  AuthStackParamList 
} from "../../containers/AuthScreen";
import {
  useLoginMutation, useStatusQuery 
} from "../../generated/graphql";
import {
  useToggle, useAuthGuard 
} from "../../hooks";
import useDimensions from "../../hooks/useDimensions";
import {
  useStorage 
} from "../../providers/Storage";
import {
  useToast 
} from "../../providers/Toast";
import {
  extractError 
} from "../../utils/helper";
import Header from "./Header";

interface LoginProps {
  navigation: StackNavigationProp<AuthStackParamList>;
}

const Login = ({ navigation }: LoginProps) => {
  const toast = useToast();
  const [ loading, toggle ] = useToggle(false);
  const [ login, _res ] = useLoginMutation();
  const { set, refetch } = useStorage();
  const spinnerColor = useColorModeValue("gray.900", "gray.100");
  const [ form, setForm ] = useSetState({
    email: "",
    password: "",
  });

  const dim = useDimensions();

  const handleSubmit = async () => {
    toggle(true);
    const { email, password } = form;
    const res = await login({
      variables: {
        options: {
          email,
          password,
        },
      },
    });
  
    const err = extractError(res, "login");
    const token = res?.data?.login?.token;
    if (err) {
      toast.error(err);
    } else if(!token){
      toast.error("Invalid Login");
    } else {
      await set({
        token
      });
      refetch();
      toast.success("Login successful");
      navigation.navigate("Dashboard" as any);
    }
    toggle(false);
  };

  return (
    <Flex
      height={dim.height}
      direction="column"
      flexGrow={1}
    >
      <Header
        selected="login"
        navigation={navigation}
      />
      <Stack
        direction={dim.bp([ "column", "row" ])}
        space={4}
        paddingX={8}
        paddingY={dim.bpy([ 10, 1 ])}
        h={dim.isLandscape ? dim.py(70) : dim.py(95)}
      >
        <VStack flexBasis={dim.bp([ "auto", "50%" ])}>
          <Text
            color="gray.300"
            fontSize={38}
            fontWeight="normal"
            fontFamily="sans-serif"
          >
            Alisto
          </Text>
          <Text
            color="gray.600"
            fontSize={38}
            fontWeight={700}
            fontFamily="sans-serif"
          >
            Do your duty!
          </Text>
        </VStack>
        <VStack
          flex={dim.bp([ 1, 1 ])}
          paddingX={dim.bpx([ 0, 5 ])}
          justifyContent="space-between"
        >
          <VStack 
            space={4}
            flex={1}
          >
            <Input
              variant="underlined"
              value={form.email}
              placeholder="Email"
              onChangeText={(val) => setForm({ email: val })}
            />
            <Input
              type="password"
              variant="underlined"
              value={form.password}
              placeholder="Password"
              caretHidden
              onChangeText={(val) => setForm({ password: val })}
            />
          </VStack>
          <Button
            size="sm"
            w="100%"
            backgroundColor="black"
            onPress={handleSubmit}
          >
            <Text color="white">Login</Text>
          </Button>
        </VStack>
      </Stack>
    </Flex>
  );
};

export default Login;
