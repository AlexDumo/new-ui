import type { OpenSeadragonAnnotator } from "@annotorious/openseadragon";

/**
 * Enables move mode on the annotator, allowing users to edit existing annotations
 * instead of creating new ones
 */
export const enableMoveMode = (annotatorRef: OpenSeadragonAnnotator | null) => {
    if (!annotatorRef) {
        console.error("Annotator reference is null");
        return;
    }

    // Disable drawing mode to enable move mode
    annotatorRef.setDrawingEnabled(false);
};

/**
 * Disables move mode and re-enables drawing mode
 */
export const disableMoveMode = (annotatorRef: OpenSeadragonAnnotator | null) => {
    if (!annotatorRef) {
        console.error("Annotator reference is null");
        return;
    }

    // Re-enable drawing mode
    annotatorRef.setDrawingEnabled(true);
};
