import {
    getWaybackServiceBaseURL,
    long2tile,
    lat2tile,
} from '@esri/wayback-core';
import { WayportJob } from '@store/WayportMode/reducer';

/**
 * Generates a thumbnail image for the given wayport job by fetching and compositing
 * the map tiles that intersect the job's extent at the recorded zoom level.
 *
 * Tiles are arranged from top-left to bottom-right on an HTML canvas, then exported
 * as a Base64-encoded PNG data URL.
 *
 * @param wayportJob - The wayport job containing the spatial extent, wayback item, and zoom level.
 * @returns A promise that resolves with a Base64-encoded PNG data URL of the composited thumbnail,
 *          or rejects if no tiles are found or a tile image fails to load.
 */
export const generateThumbnailImage4WayportTiledLayer = async (
    wayportJob: WayportJob
): Promise<string> => {
    const { xmin, ymin, xmax, ymax } = wayportJob.extent;

    const waybackItem = wayportJob.waybackItem;

    const zoomLevel = wayportJob.zoomLevelOfMapWhenCreatingOrUpdatingExtent;

    const waybackServiceBaseURL = getWaybackServiceBaseURL();

    const minCol = long2tile(xmin, zoomLevel);
    const maxCol = long2tile(xmax, zoomLevel);

    const minRow = lat2tile(ymax, zoomLevel);
    const maxRow = lat2tile(ymin, zoomLevel);

    const tiles: {
        row: number;
        column: number;
    }[] = [];

    for (let row = minRow; row <= maxRow; row++) {
        for (let column = minCol; column <= maxCol; column++) {
            tiles.push({
                row,
                column,
            });
        }
    }

    if (!tiles.length) {
        throw new Error('No tiles found for the given extent and zoom level');
    }

    // this is an array of tile from top left to bottom right that intersect with the extent of the wayport job, we can use this to update the thumbnail of the wayport tile layer item
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Failed to get 2D canvas context');
    }

    const tileSize = 256; // assuming tile size is 256x256
    canvas.width = tileSize * (maxCol - minCol + 1);
    canvas.height = tileSize * (maxRow - minRow + 1);

    // load all tile images first, then draw them on canvas after all images are loaded, this can avoid the issue of some tiles not drawn on canvas due to image loading failure or delay.
    const images = await Promise.all(
        tiles.map((tile) => {
            const url = `${waybackServiceBaseURL}/tile/${waybackItem.releaseNum}/${zoomLevel}/${tile.row}/${tile.column}`;
            return new Promise<HTMLImageElement>((res, rej) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => res(img);
                img.onerror = (err) => rej(err);
                img.src = url;
            });
        })
    );

    for (let i = 0; i < images.length; i++) {
        const tile = tiles[i];
        const img = images[i];

        ctx.drawImage(
            img,
            (tile.column - minCol) * tileSize,
            (tile.row - minRow) * tileSize,
            tileSize,
            tileSize
        );
    }

    return canvas.toDataURL('image/png');
};
