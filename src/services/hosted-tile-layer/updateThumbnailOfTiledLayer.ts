import {
    getWaybackServiceBaseURL,
    long2tile,
    lat2tile,
} from '@esri/wayback-core';
import { WayportJob } from '@store/WayportMode/reducer';
import { ca } from 'date-fns/locale';

export const updateThumbnailOfWayportTileLayer = (wayportJob: WayportJob) => {
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

    for (const tile of tiles) {
        // const img = new Image();
        const imageURL = `${waybackServiceBaseURL}/tile/${waybackItem.releaseNum}/${zoomLevel}/${tile.row}/${tile.column}`;
        console.log('Updating thumbnail for tile:', imageURL);
    }

    // this is an array of tile from top left to bottom right that intersect with the extent of the wayport job, we can use this to update the thumbnail of the wayport tile layer item
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const tileSize = 256; // assuming tile size is 256x256
    canvas.width = tileSize * (maxCol - minCol + 1);
    canvas.height = tileSize * (maxRow - minRow + 1);

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            ctx?.drawImage(
                img,
                (tile.column - minCol) * tileSize,
                (tile.row - minRow) * tileSize,
                tileSize,
                tileSize
            );

            // if(i === tiles.length - 1){
            //     // all tiles have been loaded and drawn on the canvas, we can update the thumbnail of the wayport tile layer item with the canvas data URL
            //     const thumbnailDataURL = canvas.toDataURL('image/png');
            //     console.log('Thumbnail data URL:', thumbnailDataURL);
            //     // here you can add the code to update the thumbnail of the wayport tile layer item with the thumbnailDataURL
            // }
        };
        img.src = `${waybackServiceBaseURL}/tile/${waybackItem.releaseNum}/${zoomLevel}/${tile.row}/${tile.column}`;
    }
};
