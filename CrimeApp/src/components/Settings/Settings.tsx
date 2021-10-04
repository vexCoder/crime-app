import {
  Box, Text, HStack, ChevronRightIcon, Switch , Slider, Input, VStack
} from "native-base";
import React from "react";
import {
  Pressable,  
} from "react-native";
import {
  useStatusQuery 
} from "../../generated/graphql";
import LogoutIcon from "../../icons/LogoutIcon";
import {
  useStorage 
} from "../../providers/Storage";
import NotifyIcon from "../../icons/NotifyIcon";
import RadiusIcon from "../../icons/RadiusIcon";
import {
  useDimensions 
} from "../../hooks";
import {
  useDebounce 
} from "react-use";

const Settings = () => {
  const res = useStatusQuery();
  const { set, get, unset } = useStorage();
  const [ notif, setNotif ] = React.useState(false);

  React.useEffect(() => {
    get("notification").then(v => {
      setNotif(v === "1");
    });
  }, []);

  const user = res?.data?.status?.user;
  return (
    <Box>
      {
        !!user && 
        <Box p="5">
          <Text
            fontSize="lg"
            fontWeight={700}
          >{user?.name}</Text>
          <Text>{user?.email}</Text>
        </Box>
      }
      <Divider title="Notification" />
      <SettingButton
        label={<Text lineHeight="4">Show Notification</Text>}
        icon={<NotifyIcon
          size={22}
          color="#52525b"
        />}
        action={
          <Switch
            mt="-7px"
            pt="2"
            size="sm"
            isChecked={notif}
            onToggle={() => {
              set({
                notification: !notif ? "1" : "0"
              });
              setNotif(!notif);
            }}
          />
        }
        onPress={() => {
          set({
            notification: !notif ? "1" : "0"
          });
          setNotif(!notif);
        }}
      />
      <VStack >
        <HStack 
          alignItems="center"
          mt="-5.5px"
          space="sm"
          px="5"
          pt={"4"}
          pb="2"
        >
          <RadiusIcon 
            size={22}
            color="#52525b"
          />
          <Text lineHeight="4">Radius</Text>
        </HStack>
        <NotifRadius />
      </VStack>
      <Divider title="Misc" />
      <SettingButton
        label={<Text lineHeight="4">Logout</Text>}
        icon={<LogoutIcon
          size={22}
          color="#52525b"
        />}
        onPress={() => {
          unset("token");
        }}
      />
    </Box>
  );
};

const NotifRadius = () => {
  const { set, get } = useStorage();
  const dim = useDimensions();
  const [ radius, setRadius ] = React.useState(0);

  React.useEffect(() => {
    get("radius").then(v => {
      setRadius(v || 10);
    });
  }, []);

  useDebounce(() => {
    set({
      radius
    });
  }, 1000, [ radius ]);

  return (
    <HStack 
      alignItems="center"
      mt="-5.5px"
      space="lg"
      px="5"
      pt={"4"}
      pb="2"
    >
      <Slider
        flex={1}
        value={radius}
        onChange={val => setRadius(val)}
        minValue={0}
        maxValue={10}
        step={0.001}
      >
        <Slider.Track>
          <Slider.FilledTrack />
        </Slider.Track>
        <Slider.Thumb />
      </Slider>
      <Box flex={1}>
        <Input
          size="xs"
          p={"0 10px 0 10px"}
          value={radius ? `${radius}` : ""}
          onChangeText={(text) => setRadius(parseFloat(text))}
        />
      </Box>
    </HStack>
  );
};

interface SettingButtonProps {
  label: string | React.ReactNode;
  icon: React.ReactNode;
  action?: React.ReactNode;
  onPress: () => void;
  pt?: any;
}

const SettingButton = ({ label, icon, onPress, action, pt }: SettingButtonProps) => {
  return (
    <Pressable onPress={onPress}>
      <HStack
        px="5"
        pt={pt || "4"}
        pb="2"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack 
          alignItems="center"
          mt="-5.5px"
          space="sm"
        >
          {icon}
          {typeof label === "string" ? <Text>{label}</Text> : label}
        </HStack>
        {!action && <ChevronRightIcon 
          color="#52525b"
        />}
        {
          !!action && action
        }
      </HStack>
    </Pressable>
  );
};

const Divider = ({ title }: {title: string}) => {
  return (
    <Box
      px="5"
      py="2"
      bg="gray.200"
    >
      <Text
        fontSize="sm"
        color="gray.500"
        letterSpacing="3px"
      >
        {title.toUpperCase()}
      </Text>
    </Box>
  );
};

export default Settings;
