import { VStack, IconButton, HStack } from '@chakra-ui/react';
import { Square, Circle, Heptagon, Palette, Brush } from 'react-bootstrap-icons';
import { ChromePicker } from 'react-color';
import SliderThumbWithTooltip from './SliderThumbWithTooltip';

function ToolBox(props) {
  return (
    <HStack backgroundColor="#232D3F" align="flex-start" p="10px" borderRadius="10px" margin="10px">
      <VStack display="flex" w="50px" alignItems="center">
        <IconButton onClick={() => props.setTool('brushTool')} aria-label="brushTool" icon={<Brush />} />
        <IconButton onClick={() => props.setTool('rectTool')} aria-label="rectTool" icon={<Square />} />
        <IconButton onClick={() => props.setTool('circleTool')} aria-label="circleTool" icon={<Circle />} />
        <IconButton onClick={() => props.setTool('freeShapeTool')} aria-label="freeShapeTool" icon={<Heptagon />} />
        <IconButton
          onClick={() => {
            if (props.socket) {
              props.socket.emit('clientClearCanvas', { room: props.room, clear: true });
            }
          }}
          aria-label="clear canvas"
          icon={<Palette />}
        />
      </VStack>
      <VStack>
        <ChromePicker
          color={props.color}
          onChange={(e) => {
            props.setColor(e.hex);
          }}
        />
        <SliderThumbWithTooltip setStrokeWeight={props.setStrokeWeight} />
      </VStack>
    </HStack>
  );
}

export default ToolBox;
