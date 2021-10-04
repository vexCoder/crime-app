import {
  AddIcon, Button, CheckIcon, HStack, IconButton, Image, Pressable, ScrollView, Select, Text, TextArea, TextField, View, VStack 
} from "native-base";
import React from "react";
import {
  StyleSheet 
} from "react-native";
import {
  RNCamera 
} from "react-native-camera";
import {
  useSetState 
} from "react-use";
import {
  CreatePostInput, useCreatePostMutation, useGetCrimeTypesQuery, useUploadFileMutation 
} from "../../generated/graphql";
import {
  useDimensions, useToggle 
} from "../../hooks";
import useGetCurrentPos from "../../hooks/useGetCurrentPos";
import ReportIcon from "../../icons/ReportIcon";
import {
  useToast 
} from "../../providers/Toast";
import {
  createFile, extractError 
} from "../../utils/helper";
import ReportMap from "./ReportMap";


const styles = StyleSheet.create({
  preview: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
});

const Report = () => {
  const dim = useDimensions();
  const toast = useToast();
  const { lat, lng, error } = useGetCurrentPos();
  const [ photos, setPhotos ] = React.useState<string[]>([]);
  const [ showCam, setShowCam ] = useToggle(true);
  const [ loading, toggle ] = useToggle(false);
  const res = useGetCrimeTypesQuery({
    fetchPolicy: "network-only"
  });

  const types = res.data?.getCrimeTypes?.types || [];

  const [ value, setValue ] = useSetState<CreatePostInput>({
    type: types[0]?._id,
    location: {
      lat: 0,
      lng: 0,
      address: ""
    },
    imageCount: 0,
    description: ""
  });

  const [ sendReport ] = useCreatePostMutation({
    variables: {
      options: {
        ...value,
        imageCount: photos.length
      }
    }
  });
  const [ uploadFile ] = useUploadFileMutation();

  React.useEffect(() => {
    if(error) toast.error(error);
  }, [ error ]);

  React.useEffect(() => {
    if(typeof lat === "number" && typeof lng === "number" && !error){
      setValue({
        location: {
          address: "",
          lat,
          lng
        }
      });
    }
  }, [ lat, lng ]);

  const crimeTypes = types.map(v => ({
    label: v.label,
    value: v._id
  }));

  const handleSubmit = async () => {
    toggle(true);
    try {
      const res = await sendReport({
        variables: {
          options: {
            ...value,
            imageCount: photos.length
          }
        }
      });
      const err = extractError(res, "createPost");
      if(err){
        toast.error(err);
      }else{
        toast.success("Successfully added report");
        const id = res.data?.createPost.post?._id;
        if(id){
          for (let i = 0; i < photos.length; i++) {
            const uri = photos[i];
            const pRes = await uploadFile({
              variables: {
                id,
                photo: createFile(uri, `upload-${i}.jpg`)
              }
            });
            const err = extractError(pRes, "uploadFile");
            if(err){
              toast.error(err);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    toggle(false);
  };

  if(showCam){
    return  (
      <View
        backgroundColor="white"
        flex={1}
      >
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: "Permission to use camera",
            message: "We need your permission to use your camera",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
        >{({ camera, status }) => {
            return (
              <View 
                position="absolute"
                bottom={dim.py(12)}
                width="100%"
                flex={1}
                justifyContent="center"
                alignItems="center"
              >
                <IconButton
                  marginBottom={photos.length ? 10 : 0}
                  width={10}
                  height={10}
                  variant="solid"
                  borderRadius={50}
                  bg="teal.500"
                  borderWidth={2}
                  borderColor="white"
                  onPress={async () => {
                    const options = { quality: 0.5, base64: true };
                    const data = await camera.takePictureAsync(options);
                    if(photos.length >= 4) {
                      toast.error("Only 4 pictures is allowed");
                    } else{
                      setPhotos(prev => [ ...prev, data.uri ]);
                    }
                  }}
                  icon={
                    <AddIcon
                      size="xs"
                      color="white"
                    />
                  }
                />
                {!!photos.length && <View 
                  width="100%"
                  flex={1}
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  {
                    photos.map((v, i) => 
                      <Pressable
                        key={`image-${v}-${i}`}
                        onLongPress={(evt) => {
                          setPhotos(prev => {
                            const narr = prev.slice();
                            narr.splice(i, 1);
                            return narr;
                          });
                        }}
                      >
                        <Image
                          borderRadius={5}
                          marginRight={5}
                          width={dim.px(15)}
                          alt={`image-${v}-${i}`}
                          source={{ uri: v }}
                          size="sm"
                        />
                      </Pressable>
                    )
                  }
                  <IconButton
                    width={dim.px(15)}
                    height={dim.px(15)}
                    variant="solid"
                    borderRadius={5}
                    bg="blue.500"
                    borderColor="white"
                    onPress={() => {
                      if(!photos.length){
                        toast.error("You haven't added any photo");
                      }else{
                        setShowCam(false);
                      }
                    }}
                    icon={
                      <CheckIcon
                        size="sm"
                        color="white"
                      />
                    }
                  />
                </View>
                }
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  }

  return (
    <VStack
      backgroundColor="white"
      flex={1}
      paddingTop={dim.py(5)}
    >
      <HStack
        paddingX={dim.bpx([ 5, 25 ])}
        alignItems="center"
        space={2}
        paddingBottom={dim.py(2)}
      >
        <ReportIcon size={5}/>
        <Text
          fontSize="xl"
          fontWeight={700}
          color="black"
        >Report</Text>
      </HStack>
      <ScrollView 
        paddingX={dim.bpx([ 5, 25 ])}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VStack
          pt={dim.py(2)}
          pb={dim.py(10)}
          alignItems="center"
          flex={1}
        >
          <ReportMap
            lat={lat}
            lng={lng}
            onChangeCoordinate={(coord: [number, number]) => {
              setValue(prev => ({
                location: {
                  ...prev.location,
                  lat: coord[1],
                  lng: coord[0]
                }
              }));
            }}
          />
          <Select
            selectedValue={value.type}
            minWidth={200}
            width="100%"
            accessibilityLabel="Select Crime Type"
            placeholder="Select Crime Type"
            _selectedItem={{
              bg: "green.400",
              endIcon: <CheckIcon size={5} />,
            }}
            marginBottom={1}
            marginTop={dim.py(2)}
            backgroundColor="gray.200"
            borderRadius={50}
            borderColor="white"
            onValueChange={(val) => {
              setValue({ type: val });
            }}
          >
            {
              crimeTypes.map((v, i) => <Select.Item
                key={`type-${v.value}-${i}`}
                label={v.label}
                value={v.value}
              />)
            }
          </Select>
          <View 
            width="100%"
            paddingX={dim.px(1)}
          >
            <TextArea
              width="100%"
              backgroundColor="gray.200"
              borderRadius={15}
              aria-label="t1"
              numberOfLines={4}
              placeholder="Description"
              value={value.description}
              marginBottom={1}
              marginTop={dim.py(2)}
              textAlignVertical="top"
              _focus={{
                borderColor: "black"
              }}
              onChangeText={(val) => {
                setValue({
                  description: val
                });
              }}
            />
          </View>
          <View 
            width="100%"
            paddingX={dim.px(1)}
          >
            <TextField
              width="100%"
              backgroundColor="gray.200"
              borderRadius={15}
              aria-label="t1"
              placeholder="Full Address (Optional)*"
              value={value.location.address || ""}
              marginBottom={1}
              marginTop={dim.py(2)}
              _focus={{
                borderColor: "black"
              }}
              onChangeText={(val) => {
                setValue(prev => ({
                  location: {
                    ...prev.location,
                    address: val
                  }
                }));
              }}
            />
          </View>
          <View 
            height={dim.px(15)}
            marginBottom={7}
            width="100%"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            {
              photos.map((v, i) => 
                <Pressable
                  key={`image-${v}-${i}`}
                  onLongPress={(evt) => {
                    if(photos.length === 1){
                      toast.error("Sorry but you need a photo to continue");
                    }else{
                      setPhotos(prev => {
                        const narr = prev.slice();
                        narr.splice(i, 1);
                        return narr;
                      });
                    }
                  }}
                >
                  <Image
                    borderRadius={5}
                    marginRight={5}
                    width={dim.px(15)}
                    alt={`image-${v}-${i}`}
                    source={{ uri: v }}
                    size="sm"
                  />
                </Pressable>
              )
            }
            <IconButton
              width={dim.px(15)}
              height={dim.px(15)}
              variant="solid"
              borderRadius={5}
              bg="teal.500"
              borderColor="white"
              onPress={() => {
                if(photos.length >= 4){
                  toast.error("You already have 4 photos");
                }else{
                  setShowCam(true);
                }
              }}
              icon={
                <AddIcon
                  size="xs"
                  color="white"
                />
              }
            />
          </View>
          <Button 
            width="100%"
            borderRadius={50}
            bg="blue.700"
            onPress={handleSubmit}
            isLoading={loading}
            startIcon={<ReportIcon
              size={4}
              color="white"
            />}
          >
            <Text color="white">Send Report!</Text>
          </Button>
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export default Report;
