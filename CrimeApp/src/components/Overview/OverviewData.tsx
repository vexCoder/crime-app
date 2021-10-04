import React from "react";
import {
  useGetLocationOverviewQuery, Post, useGetCrimeTypesQuery, Stats 
} from "../../generated/graphql";
import {
  Settings 
} from "./Overview";
import {
  VStack, Box, Text, HStack, ScrollView, TextArea, Image, Pressable 
} from "native-base";
import {
  useDimensions 
} from "../../hooks";
import moment from "moment";
import _ from "lodash";
import * as Progress from "react-native-progress";
import {
  rainbow 
} from "../../utils/helper";
import {
  API_URL, IMG_API_URL 
} from "../../utils/constants";
import OverviewImageModal from "./OverviewImageModal";



interface OverviewDataProps {
  settings: Settings
  posts: Post[]
  newPosts: string[]
  stats?: Stats | null
}

const OverviewData = ({ settings, posts, newPosts, stats }: OverviewDataProps) => {
  const dim = useDimensions();
  
  const [ animate, setAnimate ] = React.useState(false);
  const [ selected, setSelected ] = React.useState<Post | null>();
  const [ initialImage, setInitialImage ] = React.useState<number>(0);
  const res = useGetCrimeTypesQuery({
    fetchPolicy: "network-only"
  });

  const types = res.data?.getCrimeTypes?.types || [];

  const _postsGrouped = _(posts).groupBy("type"); 
  const postsGrouped = _postsGrouped.value(); 
  const postsGroupedKeys = _postsGrouped.keys().value();
  const total = posts.length;

  React.useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 2000);
  }, []);


  return (
    <>
      <OverviewImageModal
        selected={selected}
        initialImage={initialImage}
        handleClose={() => {
          setSelected(null);
        }}
      />
      <VStack
        w="100%"
        px={dim.px(5)}
      >
        <Text
          fontSize="xl"
          alignSelf="flex-start"
          fontWeight={700}
          mt={dim.py(2)}
        >Crime Summary:</Text>
        {stats && 
        <VStack 
          mt={dim.py(1)}
          w="100%"
          mb={dim.py(2)}
          alignItems="flex-start"
          px={dim.px(2)}
          pb={dim.py(1)}
          pt={dim.py(0.5)}
          bg="blue.100"
          borderRadius="7.5px"
        >
          <VStack
            w="100%"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Text
              fontSize="3xl"
              lineHeight="34px"
              fontWeight={700}
            >{stats.past6Hours}</Text>
            <Text
              fontSize="lg"
              lineHeight="18px"
            >Past 6 hours</Text>
          </VStack>
          <HStack 
            w="100%"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              fontSize="sm"
              mr="4px"
            >Past hour:</Text>
            <Text
              fontSize="sm" 
              fontWeight={700}
            >{stats.pastHour}</Text>
          </HStack>
          <HStack 
            w="100%"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              fontSize="sm"
              mr="4px"
            >Past 30 minutes:</Text>
            <Text
              fontSize="sm" 
              fontWeight={700}
            >{stats.past30Min}</Text>
          </HStack>
        </VStack>
        }
        <HStack
          space="md"
          mt={dim.py(1)}
          mb={dim.py(5)}
          justifyContent="space-evenly"
        >
          {
            postsGroupedKeys.map((v, i) => {
              const type = types.find(o => o._id === v);
              const count = postsGrouped[v].length;
              const prog = count / total;
              const color = type?.color || "#f00";
              if(!prog) return null;
              return (
                <VStack 
                  key={`progress-${v}`}
                  alignItems="center"
                  space="xs"
                >
                  <Progress.Circle
                    showsText={true}
                    progress={prog}
                    size={Math.max(100 / postsGroupedKeys.length, 60)}
                    color={color}
                    thickness={6}
                    borderWidth={1.5}
                    animated={false}
                    textStyle={{
                      fontWeight: "700",
                      fontSize: Math.max(25 / postsGroupedKeys.length, 15)
                    }}
                  />
                  <Text
                    color={color}
                    fontWeight={700}
                    fontSize={Math.max(15 / postsGroupedKeys.length, 10)}
                  >{type?.label}</Text>
                </VStack>
              );
            })
          }
        </HStack>
        <VStack >
          {
            posts.map(v => {
              const type = types.find(o => o._id === v.type);
              const isNew = !!newPosts.find(o => o === v._id);

              return (
                <VStack
                  w="100%"
                  key={`posts-${v._id}`}
                  p="8px"
                  justifyContent="flex-start"
                  mb="20px"
                  bg="blue.100"
                  borderRadius="7.5px"
                  minH={dim.py(5)}
                >
                  <HStack>
                    {isNew && 
                    <Box 
                      bg="red.400"
                      borderRadius="md"
                      mr="4px"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight={700}
                        color="yellow.400"
                        px="1"
                      >
                        New
                      </Text>
                    </Box>
                    }
                    <Text
                      fontSize="xs" 
                      fontWeight={700}
                    >
                      {`user-${v.user.slice(0, 9)} reported a `}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      fontWeight={700}
                      color={type?.color || "#f00"}
                    >
                      {type?.label || "Crime"}
                    </Text>
                  </HStack>
                  <Text>
                    {v.description}
                  </Text>
                  {
                    !!v.imageCount && <HStack 
                      w="100%"
                      space="xs"
                      mt="10px"
                    >
                      {
                        _.range(v.imageCount).map((o) => {
                          return (
                            <Pressable
                              key={`image-${o}`}
                              onPress={() => {
                                console.log("wtf");
                                setSelected(v);
                                setInitialImage(o);
                              }}
                            >
                              <Image
                                alt={`image-${o}`}
                                size="sm"
                                borderRadius="md"
                                resizeMode="cover"
                                source={{
                                  uri: `${IMG_API_URL}/uploads/${v._id}-thumbnail-upload-${o}.jpg`
                                }}
                              />
                            </Pressable>
                          );
                        })
                      }
                    </HStack>
                  }
                  <Text
                    fontSize="xs" 
                    w="100%"
                    textAlign="right"
                    pr="5px"
                    color="gray.500"
                  >
                    {moment(v.createdAt).format("DD MMM, hh:mm:ss A")}
                  </Text>
                </VStack>
              );
            })
          }
        </VStack>
      </VStack>
    </>
  );
};

export default OverviewData;
