import _ from "lodash";
import {
  Box, Button, CheckIcon, HStack, IconButton, QuestionOutlineIcon, ScrollView, Select, Spinner, Text, View, VStack, InfoOutlineIcon, CloseIcon, CircularProgress
} from "native-base";
import React from "react";
import {
  PixelRatio 
} from "react-native";
import Geolocation, {
  GeoPosition 
} from "react-native-geolocation-service";
import {
  useSetState 
} from "react-use";
import {
  Hotline as HotlineDataType, HotlineInput, useGetHotlinesQuery, useStatusQuery, useDeleteHotlineMutation 
} from "../../generated/graphql";
import {
  useDimensions, useToggle 
} from "../../hooks";
import AmbulanceIcon from "../../icons/AmbulanceIcon";
import FiretruckIcon from "../../icons/FiretruckIcon";
import HotlineIcon from "../../icons/HotlineIcon";
import PhoneIcon from "../../icons/PhoneIcon";
import PoliceIcon from "../../icons/PoliceIcon";
import {
  useToast 
} from "../../providers/Toast";
import {
  codes, CountryCode, matchCountryName 
} from "../../utils/countries";
import {
  getEmergencyHotlines 
} from "../../utils/emergency";
import {
  getCountry 
} from "../../utils/mapbox";
import HotlineModal from "./HotlineModal";
import {
  extractError 
} from "../../utils/helper";
import SendIntentAndroid  from "react-native-send-intent";


interface HotlineValues {
  ambulance?: string;
  dispatch?: string;
  fire?: string;
  police?: string;
}

export enum HotlineType {
  Ambulance = "Ambulance",
  Dispatch = "Dispatch",
  Fire = "Fire",
  Police = "Police",
}

const Hotline = () => {
  const toast = useToast();
  const res = useStatusQuery();
  const [ location, setLocation ] = React.useState<string>();
  const [ code, setCode ] = React.useState<string>();
  const [ loading, toggle ] = useToggle();
  const [ loadingDelete, toggleDelete ] = useToggle();
  const [ hotline, setHotline ] = React.useState<HotlineValues>({});
  const [ open, toggleModal ] = useToggle();
  const [ queryHotline, setQueryHotline ] = React.useState<HotlineInput | null>();
  const [ queryDeleteHotline, setQueryDeleteHotline ] = React.useState<HotlineInput | null>();
  const [ valueHotline, setValueHotline ] = useSetState<HotlineInput>({
    label: "",
    number: "",
    type: HotlineType.Ambulance
  });
  const dim = useDimensions();
  
  const user = res?.data?.status?.user;

  const _hotlines = useGetHotlinesQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only"
  });

  const [ deleteHotline ] = useDeleteHotlineMutation({
    variables: {
      options: queryDeleteHotline as HotlineInput
    }
  });

  const userHotlines = _hotlines.data?.getHotlines?.hotlines || [];
  const fetching = _hotlines.loading;

  const currentHotlines = code ? Object.keys(hotline).map(v => {
    return ({
      code,
      type: v,
      number: (hotline as any)[v] as string
    });
  }) : [];

  const allHotlines = [ ...currentHotlines, ...userHotlines ];

  React.useEffect(() => {
    if(_.isEmpty(hotline)){
      fetchHotline();
    }
  }, []);

  const handleDelete = async () => {
    toggleDelete(true);
    if(queryDeleteHotline){
      console.log(queryDeleteHotline);
      const res = await deleteHotline({
        variables: {
          options: queryDeleteHotline,
        }
      });
      const err = extractError(res, "deleteHotline");
      if(err){
        toast.error(err);
      }else{
        toast.success("Deleted Hotline");
      }
      _hotlines.refetch();
    }
    setQueryDeleteHotline(null);
    toggleDelete(false);
  };

  React.useEffect(() => {
    if(queryDeleteHotline) {
      handleDelete();
    }
  }, [ !!queryDeleteHotline ]);

  const fetchHotline = async (code?: CountryCode) => {
    toggle(true);
    if(code){
      setCode(code.code);
      const emergency = await getEmergencyHotlines(code);
      if(emergency.data) {
        const data = emergency.data;
        const ambulance = data?.ambulance?.all;
        const dispatch = data?.dispatch?.all;
        const fire = data?.fire?.all;
        const police = data?.police?.all;
        setHotline({
          ambulance: ambulance?.length ? ambulance[0]: "",
          dispatch: dispatch?.length ? dispatch[0]: "",
          fire: fire?.length ? fire[0]: "",
          police: police?.length ? police[0]: "",
        });
      }
      toggle(false);
      return;
    }

    const pos = await new Promise<GeoPosition | undefined>((resolve) => {
      try {
        Geolocation.getCurrentPosition((pos) => {
          resolve(pos);
        }, (error) => {
          toast.error(error.message);
          resolve();
        }, {});
      } catch (error) {
        toast.error(error.message);
        resolve();
      }
    });
    
    if(pos) {
      const res = await getCountry({ data: { lng: pos.coords.longitude, lat: pos.coords.latitude } });
      if(res.error) {
        toast.error(res.error);
      } else {
        const matches = matchCountryName(res.data);
        if(matches.length){
          setLocation(matches[0].name);
          setCode(matches[0].code);
          const emergency = await getEmergencyHotlines(matches[0]);
          if(emergency.data) {
            const data = emergency.data;
            const ambulance = data?.ambulance?.all;
            const dispatch = data?.dispatch?.all;
            const fire = data?.fire?.all;
            const police = data?.police?.all;
            setHotline({
              ambulance: ambulance?.length ? ambulance[0]: "",
              dispatch: dispatch?.length ? dispatch[0]: "",
              fire: fire?.length ? fire[0]: "",
              police: police?.length ? police[0]: "",
            });
          }
        }else{
          toast.error("Sorry there was no matching emergency hotline to your gps location");
        }
      }
    }
    toggle(false);
  };

  const handleSubmit = (number?: string) => {
    toast.success(`Calling ${number}`);
    setTimeout(() => {
      // Linking.openURL(`tel:${number}`);
      if(number){
        SendIntentAndroid.sendPhoneCall(number, true);
      }
    }, 1500);
  };

  const renderHotline = (v: HotlineDataType, i: number, isUser: boolean) => {
    let icon: React.ReactNode = () => null;

    if(v.type === "fire" || v.type === HotlineType.Fire) icon = <FiretruckIcon size={100} />;
    if(v.type === "police" || v.type === HotlineType.Police) icon = <PoliceIcon size={100} />;
    if(v.type === "ambulance" || v.type === HotlineType.Ambulance) icon = <AmbulanceIcon size={100} />;
    if(v.type === "dispatch" || v.type === HotlineType.Dispatch) icon = <PoliceIcon size={100} />;
  
    if(!v.number) return null;
    return (
      <View 
        key={`${v.code}-${v.number}-${i}-${location}`}
        height={100}
      >
        <View
          style={{ position: "absolute", top: 0, left: 0,bottom: 0, alignItems: "center" }}
          zIndex={100}
        >
          {icon}
        </View>
        <HStack 
          height={75}
          paddingX={dim.bpx([ 5, 25 ])}
          backgroundColor="gray.200"
          borderRadius={50}
          paddingLeft={125}
          alignItems="center"
          justifyContent="space-between"
        >
          <VStack 
            justifyContent="center"
            maxW={dim.px(25)}
          >
            <Text 
              fontSize="md"
              fontWeight={700}
              color="black"
            >{_.capitalize((v as HotlineDataType).label || v.type)}</Text>
            <Text 
              fontSize="md"
              fontWeight={300}
              color="black"
            >{v.number}</Text>
          </VStack>
          <HStack
            space="xs"
            alignItems="center"
          >
            {
              !loadingDelete && isUser && <Box
                backgroundColor="blue.400"
                width={8}
                height={8}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius={194 / PixelRatio.get()}
              >
                <IconButton
                  onPress={() => {
                    toggleModal(true);
                    setQueryHotline(v);
                    setValueHotline(v);
                  }}
                  icon={<InfoOutlineIcon
                    size={4}
                    color="white"
                  />}
                />
              </Box>
            }
            {
              !loadingDelete && isUser && <Box
                backgroundColor="red.500"
                width={8}
                height={8}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius={194 / PixelRatio.get()}
              >
                <IconButton
                  onPress={() => {
                    setQueryDeleteHotline({
                      label: v.label,
                      number:  v.number,
                      type: v.type
                    });
                  }}
                  icon={<CloseIcon
                    size={4}
                    color="white"
                  />}
                />
              </Box>
            }
            {
              ((!loadingDelete && isUser) || !isUser) && <Box
                backgroundColor="red.500"
                width={8}
                height={8}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius={194 / PixelRatio.get()}
              >
                <IconButton
                  isLoading={loadingDelete && isUser}
                  onPress={() => handleSubmit(v.number)}
                  icon={<PhoneIcon
                    size={4}
                    color="white"
                  />}
                />
              </Box>
            }
          </HStack>
          {
            loadingDelete && isUser && <Spinner
              size="small"
              color="blue.400"
            />
          }
        </HStack>
      </View>
    );
  };

  return (
    <>
      <HotlineModal
        open={open}
        query={queryHotline}
        value={valueHotline}
        updateValue={(val: Partial<HotlineInput>) => setValueHotline(val)}
        handleClose={() => toggleModal(false)}
        refetch={() => _hotlines.refetch()}
      />
      <View
        backgroundColor="white"
        paddingX={dim.bpx([ 5, 25 ])}
        paddingY={dim.py(5)}
        height={dim.height}
      >
        <HStack
          alignItems="center"
          space={2}
        >
          <HotlineIcon size={5}/>
          <Text
            fontSize="xl"
            fontWeight={700}
            color="black"
          >Hotline</Text>
        </HStack>
        <Select
          isDisabled={loading}
          selectedValue={location}
          minWidth={200}
          accessibilityLabel="Select Country"
          placeholder="Select Country"
          onValueChange={(itemValue) => {
            setLocation(itemValue);
            const code = codes.find(v => v.name === itemValue);
            if(code){
              fetchHotline(code);
            }else{
              setHotline({});
            }
          }}
          _selectedItem={{
            bg: "green.400",
            endIcon: <CheckIcon size={5} />,
          }}
          marginBottom={1}
          marginTop={dim.py(2)}
          backgroundColor="gray.200"
          borderRadius={50}
          borderColor="white"
        >
          {
            codes.map((v) => <Select.Item
              key={`${v.code}-${v.name}`}
              label={v.name}
              value={v.name}
            />)
          }
        </Select>
        <ScrollView 
          marginTop={dim.py(2)}
          flexGrow={1}
        >
          {!loading && !fetching && !allHotlines.length && (
            <VStack
              flex={1}
              marginTop={dim.py(25)}
              alignItems="center"
              justifyContent="center"
            >
              <QuestionOutlineIcon
                width={40}
                height={40}
                color="gray.400"
              />
              <Text 
                fontSize="sm"
                color="gray.400"
                maxWidth={150}
                textAlign="center"
                marginTop={2}
              >Sorry no emergency numbers can be found</Text>
            </VStack>
          )}
          {
            (loading || fetching) && 
            <VStack
              flex={1}
              marginTop={dim.py(30)}
              alignItems="center"
              justifyContent="center"
            >
              <Spinner color="gray.400" />
              <Text 
                fontSize="sm"
                color="gray.400"
                maxWidth={150}
                textAlign="center"
                marginTop={2}
              >Loading</Text>
            </VStack>
          }
          {
            !loading  && !fetching&& currentHotlines.map((v, i) => renderHotline(v as HotlineDataType, i, false))
          }
          {
            !loading  && !fetching&& userHotlines.map((v, i) => renderHotline(v, i, true))
          }
          {!loading && !fetching &&<Button
            bg="transparent"
            borderWidth="3px"
            borderStyle="dashed"
            borderColor="gray.200"
            _pressed={{
              bg: "transparent"
            }}
            onPress={() => {
              toggleModal(true);
            }}
          >
            <Text>ADD HOTLINE</Text>
          </Button>}
        </ScrollView>
      </View>
    </>
  );
};

export default Hotline;
