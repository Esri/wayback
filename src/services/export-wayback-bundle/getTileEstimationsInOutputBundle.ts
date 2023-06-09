import { IExtent } from '@esri/arcgis-rest-request';
import { geometryFns } from 'helper-toolkit-ts';

export type TileEstimation = {
    /**
     * zoom level
     */
    level: number;
    /**
     * total number of tiles for this zoom level
     */
    count: number;
};

/**
 * maximum number of tiles allowed by the service
 */
const MAX_NUM_TILES = 150000;

/**
 * Get estimations of tiles that can be included in the output bundle.
 * It starts with minZoomLevel and keep checking the next level till it hits the upper limit
 * of number of tiles.
 *
 * @param extent map extent of the output bundle
 * @param minZoomLevel min zoom level of the ouput bundle
 * @returns output that includes an estimation of total number of tiles by level
 */
export const getTileEstimationsInOutputBundle = (
    extent: IExtent,
    minZoomLevel: number
): TileEstimation[] => {
    const output: TileEstimation[] = [];

    const UpperLimit = MAX_NUM_TILES * 1.1;

    /**
     * a helper function to get estimation by zoom level recursively
     * @param zoomLevel
     * @returns void
     */
    const helper = (zoomLevel: number, total = 0) => {
        if (total >= UpperLimit || zoomLevel > 23) {
            return;
        }

        const { xmin, ymin, xmax, ymax } = extent;

        const tileRowMin = geometryFns.lat2tile(ymin, zoomLevel);
        const tileColMin = geometryFns.long2tile(xmin, zoomLevel);

        const tileRowMax = geometryFns.lat2tile(ymax, zoomLevel);
        const tileColMax = geometryFns.long2tile(xmax, zoomLevel);

        const rows = Math.abs(tileRowMax - tileRowMin) + 1;
        const cols = Math.abs(tileColMax - tileColMin) + 1;
        const count = rows * cols;

        if (total + count <= UpperLimit) {
            output.push({
                level: zoomLevel,
                count,
            });
        }

        helper(zoomLevel + 1, total + count);
    };

    helper(minZoomLevel);

    return output;
};
