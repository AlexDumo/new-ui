import { useEffect, useRef } from "react";
import OpenSeadragon from "openseadragon";
import { enableGeoTIFFTileSource } from "geotiff-tilesource";
import { useQuery } from "@tanstack/react-query";
import "@annotorious/openseadragon/annotorious-openseadragon.css";
import { createOSDAnnotator } from "@annotorious/openseadragon";
import { useViewerStore } from "./stores/viewerStore";

enableGeoTIFFTileSource(OpenSeadragon);

export default function Viewer() {
  const {
    osdRef,
    isLoading,
    error,
    setOsdRef,
    setAnnotatorRef,
    setIsLoading,
    setError,
    cleanup,
  } = useViewerStore();

  const viewerElementRef = useRef<HTMLDivElement>(null);

  const tileQuery = useQuery({
    queryKey: ["tiles"],
    queryFn: async () => {
      try {
        console.log("Loading tile sources...");
        const tileSources =
          await OpenSeadragon.GeoTIFFTileSource.getAllTileSources("/TCI.tif", {
            logLatency: true,
          });
        console.log("Tile sources loaded:", tileSources);
        return tileSources;
      } catch (err) {
        console.error("Error loading tile sources:", err);
        throw err;
      }
    },
    retry: 1,
  });

  useEffect(() => {
    if (
      viewerElementRef.current &&
      !osdRef &&
      tileQuery.isSuccess &&
      tileQuery.data
    ) {
      try {
        console.log("Initializing OpenSeaDragon viewer...");
        const newOsdRef = OpenSeadragon({
          element: viewerElementRef.current,
          tileSources: tileQuery.data,
          showNavigator: true,
          navigatorPosition: "BOTTOM_RIGHT",
          showRotationControl: true,
          gestureSettingsMouse: {
            clickToZoom: false,
            dblClickToZoom: false,
          },
        });

        const newAnnotatorRef = createOSDAnnotator(newOsdRef, {
          drawingEnabled: true,
          style: {
            fill: "#0000ff",
            fillOpacity: 0.0001,
          },
        });
        newAnnotatorRef.setDrawingTool("rectangle");
        newAnnotatorRef.on("createAnnotation", function (annotation) {
          console.log("created", annotation);
        });

        // Store refs in Zustand store
        setOsdRef(newOsdRef);
        setAnnotatorRef(newAnnotatorRef);

        newOsdRef.addHandler("open", () => {
          console.log("OpenSeaDragon viewer opened successfully");
          setIsLoading(false);
        });

        newOsdRef.addHandler("tile-loaded", () => {
          console.log("Tile loaded");
        });

        newOsdRef.addHandler("tile-load-failed", (event) => {
          console.error("Tile load failed:", event);
          setError("Failed to load image tiles");
        });
      } catch (err) {
        console.error("Error initializing OpenSeaDragon:", err);
        setError("Failed to initialize viewer");
        setIsLoading(false);
      }
    }

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tileQuery.data,
    tileQuery.isSuccess,
    setOsdRef,
    setAnnotatorRef,
    setIsLoading,
    setError,
    cleanup,
  ]);

  if (tileQuery.isError) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h3>Error loading image</h3>
        <p>{tileQuery.error?.message || "Unknown error occurred"}</p>
        <button onClick={() => tileQuery.refetch()}>Retry</button>
      </div>
    );
  }

  if (tileQuery.isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading image...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div
        ref={viewerElementRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f0f0f0",
        }}
      />
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          Loading viewer...
        </div>
      )}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(255,0,0,0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
