import BrushTool from "./BrushTool";
import RectangleTool from "./RectangleTool";

export function switchTool(tool, isDraw, brushes, rectangles) {
  switch (tool) {
    case "brushTool":
      return new BrushTool(brushes, isDraw);
    case "rectTool":
      return new RectangleTool(rectangles, isDraw);
  }
}
