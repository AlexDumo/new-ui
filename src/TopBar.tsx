import { RectangleIcon, PolygonIcon } from "@phosphor-icons/react";
import { useViewerStore } from "./stores/viewerStore";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";

type DrawingTool = "rectangle" | "polygon";

const TopBar = () => {
  const { annotatorRef } = useViewerStore();
  const [activeTool, setActiveTool] = useState<DrawingTool | undefined>();

  useEffect(() => {
    if (annotatorRef) {
      setActiveTool(annotatorRef.getDrawingTool() as DrawingTool);
    }
  }, [annotatorRef]);

  const handleToolChange = useCallback(
    (tool: DrawingTool) => {
      if (annotatorRef) {
        annotatorRef.setDrawingTool(tool);
        setActiveTool(annotatorRef.getDrawingTool() as DrawingTool);
      } else {
        console.error("Annotator not found");
      }
    },
    [annotatorRef],
  );

  const handleRectangleClick = useCallback(
    () => handleToolChange("rectangle"),
    [handleToolChange],
  );
  const handlePolygonClick = useCallback(
    () => handleToolChange("polygon"),
    [handleToolChange],
  );

  const getButtonClasses = useCallback(
    (tool: DrawingTool) => {
      const isActive = activeTool === tool;
      console.log(isActive);
      console.log(activeTool);

      return clsx(
        "flex items-center space-x-2 px-3 py-2 text-sm font-medium border rounded-md transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        isActive
          ? "text-white bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
          : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400",
      );
    },
    [activeTool],
  );

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleRectangleClick}
          className={getButtonClasses("rectangle")}
        >
          <RectangleIcon size={16} />
          <span>Rectangle</span>
        </button>

        <button
          onClick={handlePolygonClick}
          className={getButtonClasses("polygon")}
        >
          <PolygonIcon size={16} />
          <span>Polygon</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
