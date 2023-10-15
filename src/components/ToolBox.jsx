import { VStack, IconButton, HStack } from '@chakra-ui/react';
import { Square, Circle, Heptagon, Palette, Brush } from 'react-bootstrap-icons';
import { ChromePicker } from 'react-color';

function ToolBox(props) {
  return (
    <HStack backgroundColor="#232D3F" align="flex-start" p="10px" borderRadius="10px" margin="10px">
      <VStack display="flex" w="50px" alignItems="center">
        <IconButton onClick={() => props.setTool('brushTool')} aria-label="brushTool" icon={<Brush />} />
        <IconButton onClick={() => props.setTool('rectTool')} aria-label="rectTool" icon={<Square />} />
        <IconButton onClick={() => props.setTool('circleTool')} aria-label="circleTool" icon={<Circle />} />
        <IconButton onClick={() => props.setTool('freeShapeTool')} aria-label="freeShapeTool" icon={<Heptagon />} />
        <IconButton aria-label="Search database" icon={<Palette />} />
      </VStack>
      <ChromePicker
        color={props.color}
        onChange={(e) => {
          props.setColor(e.hex);
        }}
      />
    </HStack>
  );
}

export default ToolBox;
