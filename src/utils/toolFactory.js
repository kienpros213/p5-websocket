import BrushTool from "../tools/BrushTool";
import CircleTool from "../tools/CircleTool";
import RectangleTool from "../tools/RectangleTool";
import FreeShapeTool from "../tools/FreeShapeTool";

export function switchTool(
  tool,
  brushes,
  rectangles,
  circles,
  freeShapes,
  color,
  strokeWeight,
  socket
) {
  switch (tool) {
    case "brushTool":
      return new BrushTool(color, strokeWeight, brushes, socket);
    case "rectTool":
      return new RectangleTool(color, strokeWeight, rectangles, socket);
    case "circleTool":
      return new CircleTool(color, strokeWeight, circles, socket);
    case "freeShapeTool":
      return new FreeShapeTool(color, strokeWeight, freeShapes, socket);
  }
}
