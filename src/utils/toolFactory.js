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
  socket
) {
  switch (tool) {
    case "brushTool":
      return new BrushTool(brushes, color, socket);
    case "rectTool":
      return new RectangleTool(rectangles, color, socket);
    case "circleTool":
      return new CircleTool(circles, color, socket);
    case "freeShapeTool":
      return new FreeShapeTool(socket, freeShapes, color);
  }
}
