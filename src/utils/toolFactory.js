import BrushTool from "./BrushTool";
import CircleTool from "./CircleTool";
import RectangleTool from "./RectangleTool";

export function switchTool(tool, isDraw, brushes, rectangles, circles, socket) {
  switch (tool) {
    case "brushTool":
      return new BrushTool(brushes, isDraw, socket);
    case "rectTool":
      return new RectangleTool(rectangles, isDraw, socket);
    case "circleTool":
      return new CircleTool(circles, isDraw, socket);
  }
}
