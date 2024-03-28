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

import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';

import { geometryFns } from 'helper-toolkit-ts';
import { IWaybackItem } from '@typings/index';
import { getServiceUrl } from '@utils/Tier';

// import { loadModules } from 'esri-loader';

type TileInfo = {
    row: number;
    column: number;
    level: number;
    // top left point on map
    latitude?: number;
    longitude?: number;
    // top left point on screen
    x?: number;
    y?: number;
};

const TILE_SIZE = 256;

type FrameRectInfo = {
    screenX: number;
    screenY: number;
    height: number;
    width: number;
};

type GenerateFramesParams = {
    frameRect: FrameRectInfo;
    mapView: MapView;
    waybackItems: IWaybackItem[];
    abortController?: AbortController;
};

type CenterLocationForFrameRect = {
    latitude: number;
    longitude: number;
};

export type FrameData = {
    releaseNum: number;
    // waybackItem: IWaybackItem;
    frameCanvas: HTMLCanvasElement;
    frameBlob: Blob;
    // frameDataURI?: string;
    // height: number;
    // width: number;
    // center: CenterLocationForFrameRect;
};

const WaybackImageBaseURL = getServiceUrl('wayback-imagery-base');

export const generateAnimationFrames = async ({
    frameRect,
    mapView,
    waybackItems,
    abortController,
}: GenerateFramesParams): Promise<FrameData[]> => {
    const frames: FrameData[] = [];

    // get list of tiles that can cover the entire container DIV
    const tiles = getListOfTiles({
        frameRect,
        mapView,
    });

    const generateFrameRequests = waybackItems.map((item) => {
        const { releaseNum } = item;

        return generateFrame({
            frameRect,
            tiles,
            releaseNum,
            abortController,
        });
    });

    const responses = await Promise.all(generateFrameRequests);

    for (let i = 0; i < responses.length; i++) {
        const res = responses[i];

        const { releaseNum } = waybackItems[i];

        frames.push({
            ...res,
            releaseNum,
        });
    }

    return new Promise((resolve, reject) => {
        if (abortController && abortController.signal.aborted) {
            reject(
                'The task to generate animation frames has been cancelled by the user'
            );
        }

        resolve(frames);
    });
};

// get data URL from canvas with map tiles that conver the entire container
const generateFrame = async ({
    frameRect,
    tiles,
    releaseNum,
    abortController,
}: {
    frameRect: FrameRectInfo;
    tiles: TileInfo[];
    releaseNum: number;
    abortController: AbortController;
}): Promise<{
    frameCanvas: HTMLCanvasElement;
    frameBlob: Blob;
}> => {
    return new Promise((resolve, reject) => {
        const { screenX, screenY, height, width } = frameRect;

        const canvas = document.createElement('canvas');
        canvas.height = height;
        canvas.width = width;

        const context = canvas.getContext('2d');

        let tilesProcessed = 0;

        for (const tile of tiles) {
            const { row, column, level, x, y } = tile;

            const img = new Image(TILE_SIZE, TILE_SIZE);
            img.crossOrigin = 'anonymous';

            const imageURL = `${WaybackImageBaseURL}/tile/${releaseNum}/${level}/${row}/${column}`;

            img.src = imageURL;

            img.addEventListener('load', () => {
                // console.log(img)

                const dx = x < screenX ? -(screenX - x) : x - screenX;

                const dy = y < screenY ? -(screenY - y) : y - screenY;

                context.drawImage(img, dx, dy, TILE_SIZE, TILE_SIZE);

                // context.font = '22px "Avenir Next';
                // context.fillStyle = "#fff";
                // context.fillText(`Wayback Imagery ${releaseNum}`, 50, 50);

                tilesProcessed++;

                // all tiles are drawn to canvas, return the canvas as D
                if (tilesProcessed === tiles.length) {
                    // resolve(canvas.toDataURL('image/png'));
                    // resolve({
                    //     frameCanvas: canvas,
                    //     frameDataURI: canvas.toDataURL('image/png'),
                    // });

                    canvas.toBlob((frameBlob: Blob) => {
                        resolve({
                            frameCanvas: canvas,
                            frameBlob,
                        });
                    });
                }
            });
        }

        // reject('failed to process all tiles')
    });
};

const getListOfTiles = ({
    frameRect,
    mapView,
}: {
    frameRect: FrameRectInfo;
    mapView: MapView;
}): TileInfo[] => {
    const tiles: TileInfo[] = [];

    const { screenX, screenY, width, height } = frameRect;

    // get tile that intersect with top-left corner of the container
    const topLeftTile = getTileByScreenPoint({
        screenX,
        screenY,
        mapView,
    });

    let numOfCols = 1;
    let numOfRows = 1;

    const { row, column, level, x, y } = topLeftTile;

    while (x + numOfCols * TILE_SIZE < screenX + width) {
        numOfCols++;
    }

    while (y + numOfRows * TILE_SIZE < screenY + height) {
        numOfRows++;
    }

    for (let r = 0; r < numOfRows; r++) {
        for (let c = 0; c < numOfCols; c++) {
            tiles.push({
                row: row + r,
                column: column + c,
                level,
                x: x + c * TILE_SIZE,
                y: y + r * TILE_SIZE,
            });
        }
    }

    return tiles;
};

// get tile that intersect with the screen point
const getTileByScreenPoint = ({
    screenX,
    screenY,
    mapView,
}: {
    screenY: number;
    screenX: number;
    mapView: MapView;
}): TileInfo => {
    // type Modules = [typeof IPoint];

    // const [Point] = await (loadModules(['esri/geometry/Point']) as Promise<
    //     Modules
    // >);

    const level = mapView.zoom;

    // convert screen point to map point
    const { latitude, longitude } = mapView.toMap({
        x: screenX,
        y: screenY,
    });

    // get the tile row, col num from the map point converted by screen point
    const tileRow = geometryFns.lat2tile(latitude, level);
    const tileCol = geometryFns.long2tile(longitude, level);
    // console.log(tileRow, tileCol)

    // convert the row and col number into the lat, lon that represent the top left corner of the tile on map
    const tileLat = geometryFns.tile2lat(tileRow, level);
    const tileLon = geometryFns.tile2Long(tileCol, level);
    // console.log(tileLat, tileLon)

    const { x, y } = mapView.toScreen(
        new Point({
            latitude: tileLat,
            longitude: tileLon,
        })
    );
    // console.log(screenPoint)

    return {
        row: tileRow,
        column: tileCol,
        level,
        latitude: tileLat,
        longitude: tileLon,
        x,
        y,
    };
};

const getCenterLocationForFrameRect = ({
    frameRect,
    mapView,
}: {
    frameRect: FrameRectInfo;
    mapView: MapView;
}): CenterLocationForFrameRect => {
    const { screenX, screenY, height, width } = frameRect;

    const point = mapView.toMap({
        x: screenX + width / 2,
        y: screenY + height / 2,
    });

    const { latitude, longitude } = point;

    return {
        latitude,
        longitude,
    };
};
