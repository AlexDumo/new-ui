declare module 'geotiff-tilesource' {
    import OpenSeadragon from 'openseadragon';

    export function enableGeoTIFFTileSource(osd: typeof OpenSeadragon): void;

    declare global {
        namespace OpenSeadragon {
            class GeoTIFFTileSource {
                static getAllTileSources(
                    url: string,
                    options?: {
                        logLatency?: boolean;
                        [key: string]: any;
                    }
                ): Promise<any>;
            }
        }
    }
}
