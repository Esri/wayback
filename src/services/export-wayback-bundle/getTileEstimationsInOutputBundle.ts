/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { IExtent } from '@esri/arcgis-rest-request';
import { getServiceUrl } from '@utils/Tier';
import axios from 'axios';
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

const WaybackImageBaseURL = getServiceUrl('wayback-imagery-base');

/**
 * maximum number of tiles allowed by the service
 */
export const MAX_NUMBER_TO_TILES_PER_WAYPORT_EXPORT = 150000;

/**
 * Get estimations of tiles that can be included in the output bundle.
 * It starts with minZoomLevel and keep checking the next level till it hits the upper limit
 * of number of tiles.
 *
 * @param extent map extent of the output bundle
 * @param minZoomLevel min zoom level of the ouput bundle
 * @returns output that includes an estimation of total number of tiles by level
 */
export const getTileEstimationsInOutputBundle = async (
    extent: IExtent,
    minZoomLevel: number,
    /**
     * release number of selected wayback item
     */
    releaseNum: number
): Promise<TileEstimation[]> => {
    const tileEstimations: TileEstimation[] = [];

    // const UpperLimit = MAX_NUM_TILES * 1.1;

    /**
     * a helper function to get estimation by zoom level recursively
     * @param zoomLevel
     * @returns void
     */
    const helper = (zoomLevel: number) => {
        if (zoomLevel > 23) {
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

        // if (total + count <= UpperLimit) {
        //     tileEstimations.push({
        //         level: zoomLevel,
        //         count,
        //     });
        // }

        tileEstimations.push({
            level: zoomLevel,
            count,
        });

        helper(zoomLevel + 1);
    };

    helper(minZoomLevel);

    const output: TileEstimation[] = [];

    for (const tileEstimation of tileEstimations) {
        // add data to output if there is tile at the given zoom level
        const shouldBeIncluded = await hasWaybackImageTile(
            extent,
            tileEstimation.level,
            releaseNum
        );

        if (shouldBeIncluded) {
            output.push(tileEstimation);
        } else {
            break;
        }
    }

    return output;
};

/**
 * Checks if an actual Wayback tile image exists for the selected release at the
 * specified zoom level and center of the input map extent.
 * @param extent user selected map extent
 * @param level user selected zoom level
 * @param releaseNum wayback release number
 * @returns Promise<boolean> returns A Promise that resolves to a boolean indicating whether the image tile exists.
 */
const hasWaybackImageTile = async (
    extent: IExtent,
    level: number,
    releaseNum: number
): Promise<boolean> => {
    if (level <= 17) {
        return true;
    }

    const { xmin, ymin, xmax, ymax } = extent;

    const centerX = (xmax - xmin) / 2 + xmin;
    const centerY = (ymax - ymin) / 2 + ymin;

    const row = geometryFns.lat2tile(centerY, level);
    const column = geometryFns.long2tile(centerX, level);

    const imageURL = `${WaybackImageBaseURL}/tile/${releaseNum}/${level}/${row}/${column}`;

    try {
        // the axios.head request would throw an eror if the tile image dose not exist
        await axios.head(imageURL);
        return true;
    } catch (err) {
        // console.error(err)
        return false;
    }
};
