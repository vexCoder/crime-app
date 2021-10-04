import React from 'react'
import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import { CrimeType, useDeleteTypeMutation, useGetCrimeTypesQuery } from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { useLocalStorageContext } from '../providers/LocalStorage';
import {SmallAddIcon} from '@chakra-ui/icons';
import useAuthGuard from './../hooks/useAuthGuard';
import CrimeTypeModal from './CrimeTypeModal';
import { useToggle } from 'react-use';
import { extractError } from '../utils/helper';
import { useToast } from '../providers/Toast';


const Admin = () => {
  useAuthGuard()
  const toast = useToast()
  const [loading, toggle] = useToggle(false)
  const [open, setOpen] = useToggle(false)
  const [selected, setSelected] = React.useState<CrimeType | null>()
  const {clearKey} = useLocalStorageContext()
  const res = useGetCrimeTypesQuery({
    fetchPolicy: "network-only"
  });

  const [deleteType] = useDeleteTypeMutation({})

  const handleDelete = async (id: string) => {
    toggle(true)
    const _res = await deleteType({
      variables: {
        id: id,
      }
    })
    const err = extractError(_res, 'updateType')
    if(err){
      toast.error(err)
    }else{
      toast.success('Deleted Type')
    }
    res.refetch()
    toggle(false)
  }

  const types = res?.data?.getCrimeTypes?.types || []

  return (
    <>
    <CrimeTypeModal refetch={() => res.refetch()} open={open} selected={selected} handleClose={() => {
      setSelected(null)
      setOpen(false)
    }}/>
    <VStack p='2'>
      <HStack mb='5'  w='100%' justify='flex-start' px='5'>
        <Button onClick={() => clearKey('token')} bg='blue.400' color='white'>
          Logout
        </Button>
      </HStack>
      <Text w='100%' textAlign='left' px='5' fontWeight={700} color='gray.400'>Crime Types</Text>
      <VStack w='100%' px='5'>
      {
        types.map(v => (
          <HStack key={v._id} w='100%' justify='space-between' border='1px solid' background='blue.50' borderColor='gray.200' px='3' py='1' borderRadius='md'>
            <Text fontWeight={700} color={v.color}>{v.label}</Text>
            <HStack>
              <Button isLoading={loading} fontWeight={700} variant='link' color='blue.400' onClick={() => {
                setOpen(true)
                setSelected(v)
              }}>
                Edit
              </Button>
              <Button isLoading={loading} fontWeight={700} variant='link' color='red.400' onClick={() => handleDelete(v._id)}>
                Delete
              </Button>
            </HStack>
          </HStack>
        ))
      }
      <Button isLoading={loading} w='100%' border='1px dashed' borderColor='gray.200' background='transparent' onClick={() => {
                setOpen(true)
                setSelected(null)
              }}>
        <HStack w='100%' justify='center' align='center' px='3' py='1' borderRadius='md'>
          <SmallAddIcon color='gray.400' />
          <Text fontWeight={700} color='gray.400'>Add</Text>
        </HStack>
      </Button>
      </VStack>
    </VStack>
    </>
  )
}

export default Admin
