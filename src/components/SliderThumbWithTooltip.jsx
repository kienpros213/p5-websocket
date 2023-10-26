import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip } from '@chakra-ui/react';
import { useState } from 'react';

function SliderThumbWithTooltip(props) {
  const [sliderValue, setSliderValue] = useState(5);
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Slider
      onChangeEnd={(val) => props.setStrokeWeight(val)}
      id="slider"
      defaultValue={5}
      min={0}
      max={100}
      colorScheme="teal"
      onChange={(v) => setSliderValue(v)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip hasArrow bg="teal.500" color="white" placement="top" isOpen={showTooltip} label={`${sliderValue}%`}>
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
}

export default SliderThumbWithTooltip;
