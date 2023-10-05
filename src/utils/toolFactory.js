import BrushTool from "./BrushTool";
import CircleTool from "./CircleTool";
import RectangleTool from "./RectangleTool";

export function switchTool(tool, brushes, rectangles, circles, socket) {
  switch (tool) {
    case "brushTool":
      return new BrushTool(brushes, socket);
    case "rectTool":
      return new RectangleTool(rectangles, socket);
    case "circleTool":
      return new CircleTool(circles, socket);
  }
}
