import React from "react";
import {
  useSetState, useDebounce 
} from "react-use";
import {
  VStack, Box, Input, Text, Slider, Button, Modal, HStack, Pressable 
} from "native-base";
import {
  Settings 
} from "./Overview";
import {
  useDimensions 
} from "../../hooks";
import {
  searchAddress 
} from "../../utils/mapbox";
import LocationIcon from "../../icons/LocationIcon";

interface OverviewSettings {
  handleSubmit: (settings: Partial<Settings>) => void;
  open: boolean
  handleClose: () => void
}

const OverviewSettings = ({ handleSubmit, open, handleClose }: OverviewSettings) => {
  const dim = useDimensions();
  const [ selected, setSelected ] = React.useState<string | null>(null);
  const [ searchInput, setSearchInput ] = React.useState<string>("");
  const [ settings, setSettings ] = useSetState<Settings>({
    address: "",
    lat: 0,
    lng: 0,
    radius: 50,
  });
  const [ autoRes, setAutoRes ] = React.useState<any[]>([]);

  useDebounce(() => {
    if(searchInput && searchInput.length >= 3){
      searchAddress({ address: searchInput, autocomplete: true }).then(res => {
        if(res.data) {
          setAutoRes(res.data);
          setSelected(null);
        }
      });
    }
  }, 1000, [ searchInput ]);

  const handleChangeSettings = (val: Partial<Settings>) => {
    setSettings(val);
  };

  React.useEffect(() => {
    setSelected(null);
  }, []);

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Body>
          <VStack
            alignItems="center"
            w="100%"
            background="white"
            px={dim.px(5)}
          >
            <Text 
              fontSize="sm"
              mb="10px"
              w="100%"
            >Search Address</Text>
            <Box
              w="100%"
              mb="20px"
            >
              <Input
                w="100%"
                value={searchInput}
                onChangeText={(val) => setSearchInput(val)}
                size="xs"
              />
            </Box>
            {
              !!autoRes.length && autoRes.map(v => (
                <Pressable
                  p="2.5px 10px"
                  key={v.id}
                  onPress={() => {
                    setSelected(v.id);
                    setSettings({
                      address: v.place_name,
                      lng: v.center[0],
                      lat: v.center[1],
                    });
                  }}
                >
                  <HStack
                    p="2.5px 10px"
                    w="100%"
                    mb="20px"
                    bg="blue.100"
                    alignItems="center"
                    borderRadius="7.5px"
                    border="1px solid"
                    minH={dim.py(5)}
                    borderColor={selected === v.id ? "blue.400" : "blue.100"}
                  >
                    <LocationIcon
                      size={5}
                      color="#747474"
                    />
                    <Text 
                      ml="10px"
                      fontSize="sm"
                      w="100%"
                    >
                      {v.place_name}
                    </Text>
                  </HStack>
                </Pressable>
              ))
            }
            <Box
              w="100%"
              mb="10px"
            >
              <Button
                w="100%"
                disabled={!selected}
                onPress={() => {
                  handleSubmit(settings);
                  handleClose();
                }}
              >
                <Text color="white">Move To</Text>
              </Button>
            </Box>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default OverviewSettings;
