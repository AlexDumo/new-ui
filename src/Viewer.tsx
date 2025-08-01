import { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { enableGeoTIFFTileSource } from "geotiff-tilesource";
import { useQuery } from "@tanstack/react-query";

enableGeoTIFFTileSource(OpenSeadragon);

export default function Viewer() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const viewerRef = useRef<HTMLDivElement>(null);
  const osdRef = useRef<OpenSeadragon.Viewer | null>(null);

  useEffect(() => {
    if (
      viewerRef.current &&
      !osdRef.current &&
      tileQuery.isSuccess &&
      tileQuery.data
    ) {
      try {
        console.log("Initializing OpenSeaDragon viewer...");
        osdRef.current = OpenSeadragon({
          element: viewerRef.current,
          tileSources: tileQuery.data,
          showNavigator: true,
          navigatorPosition: "BOTTOM_RIGHT",
          showRotationControl: true,
          gestureSettingsMouse: {
            clickToZoom: true,
            dblClickToZoom: true,
          },
        });

        osdRef.current.addHandler("open", () => {
          console.log("OpenSeaDragon viewer opened successfully");
          setIsLoading(false);
        });

        osdRef.current.addHandler("tile-loaded", () => {
          console.log("Tile loaded");
        });

        osdRef.current.addHandler("tile-load-failed", (event) => {
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
      if (osdRef.current) {
        osdRef.current.destroy();
        osdRef.current = null;
      }
    };
  }, [tileQuery.data, tileQuery.isSuccess]);

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
        ref={viewerRef}
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
