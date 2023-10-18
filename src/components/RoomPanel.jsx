import { useRef } from 'react';
import { CaretLeft } from 'react-bootstrap-icons';
import {
  Box,
  IconButton,
  Button,
  Input,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import OnlineBox from './OnlineBox';

function RoomPanel(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const btnRef = useRef();

  return (
    <>
      <IconButton
        height="100px"
        aria-label="brushTool"
        icon={<CaretLeft />}
        ref={btnRef}
        colorScheme="teal"
        variant="ghost"
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader paddingBottom="auto">Room</DrawerHeader>
          <Box padding="15px">
            <Input onBlur={(e) => props.setRoom(e.target.value)} placeholder="ID" />
            <Box pt="10px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onClose();
                  toast({
                    title: 'Room Joined',
                    description: 'Welcome to Room ' + props.room + '',
                    status: 'success',
                    duration: 9000,
                    isClosable: true
                  });
                  if (props.socket) {
                    props.socket.emit('joinRequest', props.room);
                  }
                }}
              >
                Join
              </Button>
            </Box>
          </Box>

          <DrawerHeader paddingBottom="auto">Online</DrawerHeader>
          <DrawerBody>
            <OnlineBox online={props.online} socket={props.socket} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default RoomPanel;