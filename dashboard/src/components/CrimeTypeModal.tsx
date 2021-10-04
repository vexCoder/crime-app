import React from 'react'
import {
  Modal, ModalOverlay, ModalContent, Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, VStack, Input, Text, Box as _Box
} from '@chakra-ui/react';
import { CreateCrimeTypeInput, CrimeType, useCreateTypeMutation, useUpdateTypeMutation } from '../generated/graphql';
import { SketchPicker } from 'react-color';
import { useSetState, useToggle } from 'react-use';
import { useToast } from '../providers/Toast';
import { extractError } from '../utils/helper';
import styled from '@emotion/styled';



interface CrimeTypeModalProps {
  open: boolean;
  selected?: CrimeType | null;
  handleClose: () => void;
  refetch: () => void;
}

const Box = styled(_Box)`
  & > div.sketch-picker {
    box-shadow: none !important;
    border-width: 1px;
    border-style:  solid;
  }
`

const CrimeTypeModal = ({open, selected, handleClose, refetch}: CrimeTypeModalProps) => {
  const toast = useToast()
  const [loading, toggle] = useToggle(false)
  const [type, setType] = useSetState<CreateCrimeTypeInput>({
    color: '',
    label: ''
  })

  const [updateType] = useUpdateTypeMutation({})
  const [createType] = useCreateTypeMutation()

  React.useEffect(() => {
    if(open && selected){
      setType({
        color: selected.color,
        label: selected.label
      })
    }

    if(!open) {
      setType({
        color: '',
        label: ''
      })
    }
  }, [open]);

  const handleSubmit = async () => {
    toggle(true)
    let res;
    let err;
    console.log(selected, type)
    if(selected) {
      res = await updateType({
        variables: {
          id: selected._id,
          options: type
        }
      })
      err = extractError(res, 'updateType')
    }else{
      res = await createType({
        variables: {
          options: type
        }
      })
      err = extractError(res, 'createType')
    }

    if(err){
      toast.error(err)
    }else{
      toast.success(selected ? 'Updated Type' : 'Created Type')
      handleClose()
    }
    refetch()
    toggle(false)
  }

  const Picker = 'default' in SketchPicker ? ((SketchPicker as any).default as typeof SketchPicker) : SketchPicker
  return (
    <Modal isOpen={open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{!!selected ? 'Update' : 'Add'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align='flex-start'>
            <Text fontWeight={700}>Label</Text>
            <Input value={type.label} size='sm' borderRadius='lg' onChange={(evt) => setType({label: evt.target.value})}/>
            <Text fontWeight={700}>Color</Text>
            <Box borderColor='gray.50'>
              <Picker color={type.color} onChange={({hex}) => setType({color: hex})}/>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button isLoading={loading} size='sm' variant="ghost" mr={3} onClick={handleClose}>
            Close
          </Button>
          <Button isLoading={loading}  size='sm' colorScheme="blue" onClick={handleSubmit}>
            {!!selected ? 'Update' : 'Add'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CrimeTypeModal
