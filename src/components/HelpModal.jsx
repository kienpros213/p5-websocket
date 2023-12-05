import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  AspectRatio,
  Image,
  Text,
  Heading,
  Divider,
  Highlight
} from '@chakra-ui/react';
import React from 'react';

function HelpeModal(props) {
  const [scrollBehavior, setScrollBehavior] = React.useState('inside');

  const btnRef = React.useRef(null);
  return (
    <>
      <Modal
        size="xl"
        onClose={props.onClose}
        finalFocusRef={btnRef}
        isOpen={props.isOpen}
        scrollBehavior={scrollBehavior}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Heading>Camera</Heading>
            <Text fontSize="2xl">
              <Highlight query="Left mouse" styles={{ px: '0.5', py: '0.5', fontWeight: 'bold' }}>
                Left mouse: Rotating
              </Highlight>
            </Text>
            <Text fontSize="2xl">
              <Highlight query="Right mouse" styles={{ px: '1', py: '1', fontWeight: 'bold' }}>
                Right mouse: Panning
              </Highlight>
            </Text>
            <AspectRatio w="auto" ratio={1}>
              <Image title="rotating" src="/resources/rotating.gif" />
            </AspectRatio>
            <Heading>Controls</Heading>
            <Text fontSize="2xl">
              <Highlight query="W" styles={{ px: '1', py: '1', fontWeight: 'bold' }}>
                W: Moving Tool
              </Highlight>
            </Text>
            <Text fontSize="2xl">
              <Highlight query="E" styles={{ px: '1', py: '1', fontWeight: 'bold' }}>
                E: Rotating Tool
              </Highlight>
            </Text>
            <Text fontSize="2xl">
              <Highlight query="R" styles={{ px: '1', py: '1', fontWeight: 'bold' }}>
                R: Scaling Tool
              </Highlight>
            </Text>
            <AspectRatio w="auto" ratio={1}>
              <Image title="control" src="/resources/control.gif" />
            </AspectRatio>
            <Divider />
            <Heading>Drawing</Heading>
            <Text fontSize="2xl">
              <Highlight query="Enter" styles={{ px: '1', py: '1', fontWeight: 'bold' }}>
                Enter: go into Draw Mode, press again to escape Draw Mode
              </Highlight>
            </Text>
            <AspectRatio w="auto" ratio={1}>
              <Image title="drawing" src="/resources/drawing.gif" />
            </AspectRatio>
          </ModalBody>
          <ModalFooter>
            <Button onClick={props.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default HelpeModal;
