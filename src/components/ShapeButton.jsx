import { IconButton } from '@chakra-ui/react';
import { BoxFill, CircleFill, SquareFill } from 'react-bootstrap-icons';
import { changeShape } from '../utils/changeShape';

function ShapeButton(props) {
  return (
    <>
      <IconButton
        icon={<BoxFill />}
        onClick={() => {
          console.log(props.shapeName, props.scene, props.control);
          if (props.scene) {
            props.shapeName = changeShape('box', props.shapeName, props.scene, props.control);
          }
        }}
      ></IconButton>
      <IconButton
        icon={<SquareFill />}
        onClick={() => {
          props.shapeName = changeShape('plane', props.shapeName, props.scene, props.control);
        }}
      ></IconButton>
      <IconButton
        icon={<CircleFill />}
        onClick={() => {
          props.shapeName = changeShape('sphere', props.shapeName, props.scene, props.control);
        }}
      ></IconButton>
    </>
  );
}

export default ShapeButton;
