import { useState } from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import { Box } from '@chakra-ui/react';

function CustomColorPicker() {
  const { color, setColor } = useState();

  // state = {
  //   displayColorPicker: false,
  //   color: {
  //     r: '241',
  //     g: '112',
  //     b: '19',
  //     a: '1'
  //   }
  // };

  function handleChange(color) {
    setColor({ color: color.rgb });
  }

  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '10px'
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer'
      },
      popover: {
        position: 'absolute',
        zIndex: '2'
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    }
  });

  return (
    <Box borderRadius="100px">
      <SketchPicker color={color} onChange={handleChange} />
    </Box>
  );
}

export default CustomColorPicker;
