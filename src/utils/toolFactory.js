import BrushTool from '../tools/BrushTool';
import CircleTool from '../tools/CircleTool';
import RectangleTool from '../tools/RectangleTool';
import FreeShapeTool from '../tools/FreeShapeTool';
import EraserTool from '../tools/EraserTool';

export function switchTool(
  tool,
  brushes,
  rectangles,
  circles,
  freeShapes,
  color,
  room,
  strokeWeight,
  socket,
  frameBuffer
) {
  switch (tool) {
    case 'brushTool':
      return new BrushTool(color, strokeWeight, room, brushes, socket, frameBuffer);
    case 'rectTool':
      return new RectangleTool(color, strokeWeight, room, rectangles, socket, frameBuffer);
    case 'circleTool':
      return new CircleTool(color, strokeWeight, room, circles, socket, frameBuffer);
    case 'freeShapeTool':
      return new FreeShapeTool(color, strokeWeight, room, freeShapes, socket, frameBuffer);
    case 'eraserTool':
      return new EraserTool(color, strokeWeight, room, brushes, socket, frameBuffer);
  }
}
