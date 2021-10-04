import { Button } from '@chakra-ui/button';
import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import moment from 'moment';
import React from 'react';
import { Post, useGetCrimeTypesQuery, useInvalidatePostMutation, User } from '../generated/graphql';
import { useLocalStorageContext } from '../providers/LocalStorage';
import { useLocation } from '../providers/Location';
import { SettingsParams } from './Main';
import { useToggle } from 'react-use';
import { extractError } from './../utils/helper';
import { useToast } from '../providers/Toast';

interface PostsProps {
  settings: SettingsParams
  newPosts: string[];
  posts: Post[];
  refetch: () => void;
}

const Posts = ({posts, newPosts, refetch}: PostsProps) => {
  const {target, trackLocation, clearTracker} = useLocation()
  const toast = useToast()
  const [loading, toggle] = useToggle(false)
  const {clearKey} = useLocalStorageContext()
  const res = useGetCrimeTypesQuery({
    fetchPolicy: "network-only"
  });


  const [invalidate] = useInvalidatePostMutation()

  const handleInvalidation = async (id: string, isInvalid?: boolean) => {
    const res = await invalidate({
      variables: {
        id
      }
    })
    const err = extractError(res, 'updateType')

    if(err){
      toast.error(err)
    }else{
      toast.success(isInvalid ? 'Validated Post' : 'Invalidated Post')
    }
    refetch()
  }

  const types = res.data?.getCrimeTypes?.types || [];

  return (
    <VStack w='100%' maxH='80vh' flex={1}>
      <HStack w='100%' px='4' >
        <Button onClick={refetch} bg='blue.400' color='white'>
          Refresh Reports
        </Button>
        <Button onClick={() => clearKey('token')} bg='blue.400' color='white'>
          Logout
        </Button>
      </HStack>
      <VStack w='100%' maxH='80vh' overflowY='auto' px='4' >
        {
          posts.map(v => {
            const type = types.find(o => o._id === v.type);
            const isNew = !!newPosts.find(o => o === v._id)
            return (
              <VStack
                w="100%"
                key={`posts-${v._id}`}
                p="5px"
                justifyContent="flex-start"
                mb="20px"
                bg="blue.100"
                borderRadius="7.5px"
                alignItems='flex-start'
                borderWidth='1px'
                borderStyle='solid'
                borderColor={isNew ? 'red.400' : 'none'}
              >
                <HStack align='flex-start' justify='space-between' w='100%'>
                  <VStack w='100%' align='flex-start'>
                    <HStack>
                    {isNew && <Text
                        fontSize="xs"
                        fontWeight={700}
                        color='yellow.400'
                        background='red'
                        px='1'
                        borderRadius='md'
                      >
                        New
                      </Text>}
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
                    <Text mt={0} lineHeight='1em'>
                      {v.description}
                    </Text>
                  </VStack>
                  <VStack align='flex-end'>
                    {!v.invalid && <Button w='100%' px='5' color='white' size='xs' background='red.400'  onClick={() => {
                        handleInvalidation(v._id, !!v.invalid)
                      }}>
                        Invalidate
                      </Button>}
                    {v.invalid && <Button w='100%' px='5' color='white' size='xs' background='green.400'  onClick={() => {
                        handleInvalidation(v._id, !!v.invalid)
                      }}>
                        Validate
                      </Button>}
                    {
                      target?._id !== v._id &&
                      <Button w='100%' px='5' color='white' size='xs' background='blue.400'  onClick={() => {
                        trackLocation(v)
                      }}>
                        Go To Location
                      </Button>
                    }
                    {
                      target?._id === v._id &&
                      <Button w='100%' px='5' color='white' size='xs' background='red.400' onClick={() => {
                        clearTracker()
                      }}>
                        Close Target
                      </Button>
                    }
                  </VStack>
                </HStack>
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
  );
}

export default Posts;
