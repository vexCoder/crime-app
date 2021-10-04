import {
  StackNavigationProp 
} from "@react-navigation/stack";
import _ from "lodash";
import {
  Box,
  CheckCircleIcon,
  Flex,
  IconButton,
  Input,
  KeyboardAvoidingView,
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
  useRegisterMutation, useLoginMutation 
} from "../../generated/graphql";
import {
  useToggle, useAuthGuard 
} from "../../hooks";
import useDimensions from "../../hooks/useDimensions";
import {
  useToast 
} from "../../providers/Toast";
import {
  extractError 
} from "../../utils/helper";
import Header from "./Header";
import {
  useStorage 
} from "../../providers/Storage";

interface RegisterProps {
  navigation: StackNavigationProp<AuthStackParamList>;
}

const Register = ({ navigation }: RegisterProps) => {
  const toast = useToast();
  const [ login, _resL ] = useLoginMutation();
  const [ register, _res ] = useRegisterMutation();
  const { set, refetch } = useStorage();
  const [ loading, toggle ] = useToggle();
  const [ form, setForm ] = useSetState({
    email: "",
    password: "",
    name: "",
  });

  const dim = useDimensions();

  const handleSubmit = async () => {
    toggle(true);
    const { email, password, name } = form;
    if (_.isEmpty(email) || _.isEmpty(password) || _.isEmpty(name)) {
      toast.error("Incomplete form values");
      toggle(false);
      return;
    }

    const res = await register({
      variables: {
        options: {
          email,
          name,
          password,
        },
      },
    });

    const err = extractError(res, "register");
    if (err) {
      toast.error(err);
    } else {
      toast.success("Register successful");
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
        selected="register"
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
            Join us,
          </Text>
          <Text
            color="gray.600"
            fontSize={38}
            fontWeight={700}
            fontFamily="sans-serif"
          >
            {form.name || "Random Person!"}
          </Text>
        </VStack>
        <VStack
          flex={dim.bp([ 1, 1 ])}
          paddingX={dim.bpx([ 0, 5 ])}
          justifyContent="space-between"
        >
          <VStack 
            space={4}
          >
            <Input
              variant="underlined"
              value={form.name}
              placeholder="Name"
              caretHidden
              onChangeText={(val) => setForm({ name: val })}
            />
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
            <Text color="white">Register</Text>
          </Button>
        </VStack>
      </Stack>
    </Flex>
  );
};

export default Register;
