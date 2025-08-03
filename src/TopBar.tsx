import { RectangleIcon, PolygonIcon, HandIcon } from "@phosphor-icons/react";
import { useViewerStore } from "./stores/viewerStore";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { enableMoveMode, disableMoveMode } from "./lib/annotatorUtils";

type DrawingTool = "rectangle" | "polygon";

const TopBar = () => {
  const { annotatorRef } = useViewerStore();
  const [activeTool, setActiveTool] = useState<DrawingTool | undefined>();
  const [isMoveMode, setIsMoveMode] = useState(false);

  useEffect(() => {
    if (annotatorRef) {
      setActiveTool(annotatorRef.getDrawingTool() as DrawingTool);
    }
  }, [annotatorRef]);

  const handleToolChange = useCallback(
    (tool: DrawingTool) => {
      if (annotatorRef) {
        // Disable move mode and return to drawing mode
        if (isMoveMode) {
          disableMoveMode(annotatorRef);
          setIsMoveMode(false);
        }

        annotatorRef.setDrawingTool(tool);
        setActiveTool(annotatorRef.getDrawingTool() as DrawingTool);
      } else {
        console.error("Annotator not found");
      }
    },
    [annotatorRef, isMoveMode],
  );

  const handleRectangleClick = useCallback(
    () => handleToolChange("rectangle"),
    [handleToolChange],
  );
  const handlePolygonClick = useCallback(
    () => handleToolChange("polygon"),
    [handleToolChange],
  );

  const handleMoveModeToggle = useCallback(() => {
    if (annotatorRef) {
      if (isMoveMode) {
        disableMoveMode(annotatorRef);
        setIsMoveMode(false);
      } else {
        enableMoveMode(annotatorRef);
        setIsMoveMode(true);
      }
    } else {
      console.error("Annotator not found");
    }
  }, [annotatorRef, isMoveMode]);

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

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={handleMoveModeToggle}
          className={clsx(
            "flex items-center space-x-2 px-3 py-2 text-sm font-medium border rounded-md transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            isMoveMode
              ? "text-white bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700"
              : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400",
          )}
        >
          <HandIcon size={16} />
          <span>Move Mode</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
