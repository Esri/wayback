import MapView from '@arcgis/core/views/MapView';
import { getReferenceLayer } from '@components/ReferenceLayer/helper';
import { convertCanvas2HtmlImageElement } from '@utils/snippets/convertCanvas2HtmlImageElement';
import { loadImageAsHTMLIMageElement } from '@utils/snippets/loadImage';

type GetScreenshotOfBasemapLayersParams = {
    mapView: MapView;
    /**
     * Whether the reference layer is visible in the mapView.
     */
    isReferenceLayerVisible: boolean;
};

type GetScreenshotOfBasemapLayersOutput = {
    referenceLayersScreenshot: __esri.Screenshot | null;
};

/**
 * Combines a media layer image (such as a landcover or satellite layer) with optional map screenshots
 * (basemap, map labels, and hillshade) into a single HTMLImageElement using canvas compositing.
 *
 * The function supports blending the media layer with the basemap using a multiply blend mode,
 * which is useful for landcover layers but should be avoided for satellite imagery to prevent unwanted mixing.
 * Hillshade and map label screenshots can also be composited on top using appropriate blend modes.
 *
 * @param params - An object containing the following properties:
 * @param params.animationFrameImageUrl - The URL of the media layer image to load and combine.
 * @param params.basemapScreenshotData - Optional ImageData for the basemap screenshot to be drawn first.
 * @param params.mapLabelScreenshotData - Optional ImageData for map labels to be drawn last.
 * @param params.hillshadeScreenshotData - Optional ImageData for hillshade to be blended with the result.
 * @param params.shouldBlendMediaLayerElementWithBasemap - If true, blends the media layer with the basemap using 'multiply'.
 *
 * @returns A Promise that resolves to an HTMLImageElement containing the combined image.
 */
export const combineAnimationFrameImageWithMapScreenshots = async ({
    animationFrameImageUrl,
    referenceLayersScreenshot,
}: {
    animationFrameImageUrl: string;
    referenceLayersScreenshot: ImageData | null;
}): Promise<HTMLImageElement> => {
    // Load the animation frame image to be combined with map screenshots as an HTML Image Element
    const animationFrameImage = await loadImageAsHTMLIMageElement(
        animationFrameImageUrl
    );

    // Create a new canvas to combine the imageData and the HTMLImageElement
    const combinedCanvas = document.createElement('canvas');
    const combinedCtx = combinedCanvas.getContext('2d');

    // Set the dimensions of the new canvas to accommodate both the image and the imageData
    combinedCanvas.width = Math.max(
        combinedCanvas.width,
        animationFrameImage.width
    );
    combinedCanvas.height = Math.max(
        combinedCanvas.height,
        animationFrameImage.height
    );

    // Draw the media layer image onto the canvas on top of the basemap screenshot
    if (animationFrameImage) {
        combinedCtx.drawImage(animationFrameImage, 0, 0);
    }

    // Draw the map label screenshot data onto the new canvas last
    if (referenceLayersScreenshot) {
        // reset the globalCompositeOperation to default value 'source-over' before drawing map label screenshot
        combinedCtx.globalCompositeOperation = 'source-over';

        const mapLabelScreenshotBitmap = await createImageBitmap(
            referenceLayersScreenshot
        );

        combinedCtx.drawImage(mapLabelScreenshotBitmap, 0, 0);
    }

    // Convert the combined canvas to an HTMLImageElement
    const outputImage = await convertCanvas2HtmlImageElement(combinedCanvas);

    return outputImage;
};

/**
 * Get a screenshot of the basemap layers, optionally including map label layers.
 *
 * @param params.mapView The MapView instance from which to capture the screenshot.
 * @param params.includeMapLabelsInScreenshot Whether to include map label layers in the screenshot.
 * @returns
 */
export const getScreenshotOfReferenceLayer = async ({
    mapView,
    isReferenceLayerVisible,
}: GetScreenshotOfBasemapLayersParams): Promise<GetScreenshotOfBasemapLayersOutput> => {
    if (!mapView || !isReferenceLayerVisible) {
        return {
            referenceLayersScreenshot: null,
        };
    }

    const referenceLayer = getReferenceLayer(mapView);

    if (!referenceLayer) {
        return {
            referenceLayersScreenshot: null,
        };
    }

    const referenceLayersScreenshot = await mapView.takeScreenshot({
        layers: referenceLayer ? [referenceLayer] : [],
        format: 'png',
        ignoreBackground: true,
    });

    return {
        referenceLayersScreenshot,
    };
};
