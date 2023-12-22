import HelpModal from './HelpModal';
import { VStack, Box, IconButton, Divider, useDisclosure, HStack, Input } from '@chakra-ui/react';
import {
  BoxFill,
  CircleFill,
  SquareFill,
  QuestionLg,
  ArrowCounterclockwise,
  TriangleFill
} from 'react-bootstrap-icons';
import { changeShape } from '../utils/changeShape';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faY, faZ } from '@fortawesome/free-solid-svg-icons';
import { fitToRect } from '../threeUtils/fitToRect';
import { shapeRotation } from '../threeUtils/shapeRotation';
import { useState } from 'react';
import PropTypes from 'prop-types'; // ES6

function Button(props) {
  const [rotation, setRotation] = useState(90);
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(props.scene, props.shapeName);
  return (
    <>
      <Box display="flex" justifyContent="center">
        <Box position="absolute" backgroundColor="#081924" w="280px" m="10px" borderRadius="10px">
          <HStack p="10px">
            <IconButton
              onClick={() => {
                shapeRotation(rotation, props.scene, 'all', props.shapeName);
              }}
              icon={<ArrowCounterclockwise />}
            ></IconButton>
            <IconButton
              onClick={() => {
                shapeRotation(rotation, props.scene, 'x', props.shapeName);
              }}
              icon={<FontAwesomeIcon icon={faX} />}
            ></IconButton>
            <IconButton
              onClick={() => {
                shapeRotation(rotation, props.scene, 'y', props.shapeName);
              }}
              icon={<FontAwesomeIcon icon={faY} />}
            ></IconButton>
            <IconButton
              onClick={() => {
                shapeRotation(rotation, props.scene, 'z', props.shapeName);
              }}
              icon={<FontAwesomeIcon icon={faZ} />}
            ></IconButton>
            <Input
              value={rotation}
              onChange={(e) => {
                setRotation(e.target.value);
              }}
              textAlign="center"
              backgroundColor="white"
            ></Input>
          </HStack>
        </Box>
      </Box>
      <Box pos="absolute" m="10px" p="10px" backgroundColor="#081924" borderRadius="10px">
        <VStack>
          <IconButton icon={<QuestionLg />} onClick={onOpen}></IconButton>
          <Divider />
          {/* shape button */}
          <IconButton
            icon={<BoxFill />}
            onClick={() => {
              props.setShapeName(changeShape('box', props.shapeName, props.scene, props.control));
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
          <IconButton
            icon={<TriangleFill />}
            onClick={() => {
              props.shapeName = changeShape('cone', props.shapeName, props.scene, props.control);
            }}
          ></IconButton>
          {/* rotation button */}
          <Divider />
          <IconButton
            onClick={() => {
              fitToRect(props.xPlane, props.cameraControls);
            }}
            icon={<FontAwesomeIcon icon={faX} />}
          ></IconButton>
          <IconButton
            onClick={() => {
              fitToRect(props.yPlane, props.cameraControls);
            }}
            icon={<FontAwesomeIcon icon={faY} />}
          ></IconButton>
          <IconButton
            onClick={() => {
              fitToRect(props.zPlane, props.cameraControls);
            }}
            icon={<FontAwesomeIcon icon={faZ} />}
          ></IconButton>
          <Divider />
          {/* reverse rotation button */}
          <IconButton
            bg="#f23350"
            onClick={() => {
              fitToRect(props.reverseXPlane, props.cameraControls);
            }}
            icon={<FontAwesomeIcon icon={faX} />}
          ></IconButton>
          <IconButton
            bg="#f23350"
            onClick={() => {
              fitToRect(props.reverseYPlane, props.cameraControls);
            }}
            icon={<FontAwesomeIcon icon={faY} />}
          ></IconButton>
          <IconButton
            bg="#f23350"
            onClick={() => {
              fitToRect(props.reverseZPlane, props.cameraControls);
            }}
            icon={<FontAwesomeIcon icon={faZ} />}
          ></IconButton>
        </VStack>
      </Box>
      <HelpModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
}

Button.propTypes = {
  scene: PropTypes.any,
  shapeName: PropTypes.any,
  control: PropTypes.any,
  xPlane: PropTypes.any,
  yPlane: PropTypes.any,
  zPlane: PropTypes.any,
  reverseXPlane: PropTypes.any,
  reverseYPlane: PropTypes.any,
  reverseZPlane: PropTypes.any,
  cameraControls: PropTypes.any,
  setShapeName: PropTypes.any
};

export default Button;
