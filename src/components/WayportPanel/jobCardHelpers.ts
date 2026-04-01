import { WayportJob } from '@store/WayportMode/reducer';

import PreviewImageLevel0 from './preview-tile-images/L00.jpg';
import PreviewImageLevel1 from './preview-tile-images/L01.jpg';
import PreviewImageLevel2 from './preview-tile-images/L02.jpg';
import PreviewImageLevel3 from './preview-tile-images/L03.jpg';
import PreviewImageLevel4 from './preview-tile-images/L04.jpg';
import PreviewImageLevel5 from './preview-tile-images/L05.jpg';
import PreviewImageLevel6 from './preview-tile-images/L06.jpg';
import PreviewImageLevel7 from './preview-tile-images/L07.jpg';
import PreviewImageLevel8 from './preview-tile-images/L08.jpg';
import PreviewImageLevel9 from './preview-tile-images/L09.jpg';
import PreviewImageLevel10 from './preview-tile-images/L10.jpg';
import PreviewImageLevel11 from './preview-tile-images/L11.jpg';
import PreviewImageLevel12 from './preview-tile-images/L12.jpg';
import PreviewImageLevel13 from './preview-tile-images/L13.jpg';
import PreviewImageLevel14 from './preview-tile-images/L14.jpg';
import PreviewImageLevel15 from './preview-tile-images/L15.jpg';
import PreviewImageLevel16 from './preview-tile-images/L16.jpg';
import PreviewImageLevel17 from './preview-tile-images/L17.jpg';
import PreviewImageLevel18 from './preview-tile-images/L18.jpg';
import PreviewImageLevel19 from './preview-tile-images/L19.jpg';
import PreviewImageLevel20 from './preview-tile-images/L20.jpg';
import PreviewImageLevel21 from './preview-tile-images/L21.jpg';
import PreviewImageLevel22 from './preview-tile-images/L22.jpg';
import PreviewImageLevel23 from './preview-tile-images/L23.jpg';

const IMAGES_BY_ZOOM_LEVEL: string[] = [
    PreviewImageLevel0,
    PreviewImageLevel1,
    PreviewImageLevel2,
    PreviewImageLevel3,
    PreviewImageLevel4,
    PreviewImageLevel5,
    PreviewImageLevel6,
    PreviewImageLevel7,
    PreviewImageLevel8,
    PreviewImageLevel9,
    PreviewImageLevel10,
    PreviewImageLevel11,
    PreviewImageLevel12,
    PreviewImageLevel13,
    PreviewImageLevel14,
    PreviewImageLevel15,
    PreviewImageLevel16,
    PreviewImageLevel17,
    PreviewImageLevel18,
    PreviewImageLevel19,
    PreviewImageLevel20,
    PreviewImageLevel21,
    PreviewImageLevel22,
    PreviewImageLevel23,
];

/**
 * Determines whether the remove button for a Wayport job card should be disabled.
 *
 * The button is disabled when the job is actively being processed — either because
 * it is pending or waiting to start, or because the tile layer publish/update workflow
 * is in progress — to prevent users from removing a job mid-operation.
 *
 * @param job - The Wayport job to evaluate.
 * @returns `true` if the remove button should be disabled, `false` otherwise.
 */
export const checkShouldDisableRemoveButton = (job: WayportJob): boolean => {
    const { status, publishWayportTileLayerStatus } = job;

    // remove button should be disabled when the job is in progress (pending or waiting to start) or when the tile layer is being published or updated,
    // to prevent users from removing a job that is in the middle of being processed
    const shouldBeDisabled =
        status === 'wayport job pending' ||
        status === 'wayport job waiting to start' ||
        publishWayportTileLayerStatus ===
            'publishing job adding tile package' ||
        publishWayportTileLayerStatus === 'publishing job adding tile layer' ||
        publishWayportTileLayerStatus === 'publishing job updating tiles';

    return shouldBeDisabled;
};

/**
 * Flag to ensure that preview images are only preloaded once.
 * This prevents unnecessary network requests and optimizes performance by caching the images after the first load.
 */
let hasPreloadedImages = false;

/**
 * This function returns an array of URLs for preview images corresponding to different zoom levels.
 * The images are preloaded to ensure they are cached and load instantly when needed in the UI.
 * @returns
 */
export const getPreviewImageURLs = (): string[] => {
    // If the images have already been preloaded, return the cached URLs to avoid redundant network requests and improve performance
    if (hasPreloadedImages) {
        return IMAGES_BY_ZOOM_LEVEL;
    }

    // Preload all preview images to ensure they are cached and load instantly when needed
    for (let i = 0; i < IMAGES_BY_ZOOM_LEVEL.length; i++) {
        const imageURL = IMAGES_BY_ZOOM_LEVEL[i];
        const image = new Image();
        image.src = imageURL;
    }

    hasPreloadedImages = true;

    return IMAGES_BY_ZOOM_LEVEL;
};
