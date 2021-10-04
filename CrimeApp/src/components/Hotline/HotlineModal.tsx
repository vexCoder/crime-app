import React from "react";
import {
  Modal, Image, HStack, Pressable, Input, VStack, Text, Select, CheckIcon, Button 
} from "native-base";
import {
  Post, HotlineInput, useAddHotlineMutation, useUpdateHotlineMutation 
} from "../../generated/graphql";
import {
  IMG_API_URL 
} from "../../utils/constants";
import _, {
  update 
} from "lodash";
import {
  useDimensions, useToggle 
} from "../../hooks";
import {
  extractError 
} from "../../utils/helper";
import {
  useToast 
} from "../../providers/Toast";


export enum HotlineType {
  Ambulance = "Ambulance",
  Dispatch = "Dispatch",
  Fire = "Fire",
  Police = "Police",
}

interface HotlineModalProps {
  open: boolean;
  query?: HotlineInput | null;
  value: HotlineInput;
  updateValue:(val: Partial<HotlineInput>) => void;
  handleClose: () => void;
  refetch: () => void;
}

const HotlineModal = ({ open, query, value, updateValue,  handleClose, refetch }: HotlineModalProps) => {
  const dim = useDimensions();
  const toast = useToast();
  const [ loading, toggle ] = useToggle(false);

  const [ addHotline ] = useAddHotlineMutation({
    variables: {
      options: value
    }
  });

  const [ updateHotline ] = useUpdateHotlineMutation({
    variables: {
      query: query as HotlineInput,
      options: value
    }
  });

  const handleSubmit = async () => {
    toggle(true);
    let res;
    let err;
    if(query) {
      console.log(query, value);
      res = await updateHotline({
        variables: {
          query: {
            label: query.label,
            number: query.number,
            type: query.type,
          },
          options: {
            label: value.label,
            number: value.number,
            type: value.type,
          }
        }
      });
      err = extractError(res, "updateHotline");
    }else {
      res = await addHotline({
        variables: {
          options: value
        }
      });
      err = extractError(res, "addHotline");
    }

    if(err){
      toast.error(err);
    }else{
      toast.success(query ? "Updated Hotline" : "Created Hotline");
    }
    
    updateValue({
      label: "",
      number: ""
    });
    refetch();
    handleClose();
    toggle(false);
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Body>
          <VStack
            mt={dim.py(4)}
            space="xs"
          >
            <Text fontWeight={700}>Label</Text>
            <Input
              value={value.label}
              onChangeText={(val) => updateValue({ label: val })}
              size="xs"
            />
            <Text fontWeight={700}>Number</Text>
            <Input
              value={value.number}
              type="number"
              onChangeText={(val) => updateValue({ number: val })}
              size="xs"
            />
            <Text fontWeight={700}>Type</Text>
            <Select
              selectedValue={value.type}
              size="xs"
              accessibilityLabel="Hotline Type"
              placeholder="Hotline Type"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(val) => {
                updateValue({ type: val as HotlineType });
              }}
            >
              <Select.Item
                label="Ambulance"
                value={HotlineType.Ambulance}
              />
              <Select.Item
                label="Dispatch"
                value={HotlineType.Dispatch}
              />
              <Select.Item
                label="Fire"
                value={HotlineType.Fire}
              />
              <Select.Item
                label="Police"
                value={HotlineType.Police}
              />
            </Select>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group>
            <Button
              isLoading={loading}
              variant="ghost"
              size="sm"
              onPress={handleClose}
            >
              <Text>Cancel</Text>
            </Button>
            <Button
              isLoading={loading}
              bg="blue.400"
              size="sm"
              onPress={handleSubmit}
            >
              <Text 
                color="white"
              >{query ? "Update" : "Create"}</Text>
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default HotlineModal;
