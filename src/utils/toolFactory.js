import BrushTool from "./BrushTool";
import CircleTool from "./CircleTool";
import RectangleTool from "./RectangleTool";

export function switchTool(tool, isDraw, brushes, rectangles, circles) {
  switch (tool) {
    case "brushTool":
      return new BrushTool(brushes, isDraw);
    case "rectTool":
      return new RectangleTool(rectangles, isDraw);
    case "circleTool":
      return new CircleTool(circles, isDraw);
  }
}
