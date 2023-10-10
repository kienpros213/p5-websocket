import BrushTool from '../tools/BrushTool';
import CircleTool from '../tools/CircleTool';
import RectangleTool from '../tools/RectangleTool';
import FreeShapeTool from '../tools/FreeShapeTool';

export function switchTool(tool, brushes, rectangles, circles, freeShapes, color, room, strokeWeight, socket) {
  switch (tool) {
    case 'brushTool':
      return new BrushTool(color, strokeWeight, room, brushes, socket);
    case 'rectTool':
      return new RectangleTool(color, strokeWeight, room, rectangles, socket);
    case 'circleTool':
      return new CircleTool(color, strokeWeight, room, circles, socket);
    case 'freeShapeTool':
      return new FreeShapeTool(color, strokeWeight, room, freeShapes, socket);
  }
}
