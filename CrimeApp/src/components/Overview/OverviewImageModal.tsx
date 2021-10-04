import React from "react";
import {
  Modal, Image, HStack, Pressable 
} from "native-base";
import {
  Post 
} from "../../generated/graphql";
import {
  IMG_API_URL 
} from "../../utils/constants";
import _ from "lodash";
import {
  useDimensions 
} from "../../hooks";


interface OverviewImageModalProps {
  selected?: Post | null;
  initialImage: number;
  handleClose: () => void;
}

const OverviewImageModal = ({ selected, initialImage, handleClose }: OverviewImageModalProps) => {
  const [ image, setImage ] = React.useState(0);
  const dim = useDimensions();

  React.useEffect(() => {
    setImage(initialImage);
  }, [ initialImage ]);

  if(!selected) return null;
  return (
    <Modal
      isOpen={!!selected}
      onClose={handleClose}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Body>
          <Image
            mt={dim.py(4)}
            alt={`image-${initialImage}`}
            style={{
              width: "100%",
              height: dim.py(40),
            }}
            borderRadius="md"
            resizeMode="cover"
            source={{
              uri: `${IMG_API_URL}/uploads/${selected?._id}-upload-${image}.jpg`
            }}
          />
          {
            !!selected?.imageCount && <HStack 
              w="100%"
              space="xs"
              mt="10px"
            >
              {
                _.range(selected?.imageCount).map((o) => {
                  return (
                    <Pressable
                      key={`image-${o}`}
                      onPress={() => {
                        setImage(o);
                      }}
                    >
                      <Image
                        alt={`image-${o}`}
                        size="sm"
                        borderRadius="md"
                        borderWidth="4px"
                        borderStyle="solid"
                        borderColor={image === o ? "blue.400" : "transparent"}
                        resizeMode="cover"
                        source={{
                          uri: `${IMG_API_URL}/uploads/${selected?._id}-thumbnail-upload-${o}.jpg`
                        }}
                      />
                    </Pressable>
                  );
                })
              }
            </HStack>
          }
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default OverviewImageModal;
