import { IExtent } from '@typings/index';
import { haversineDistance } from '@utils/snippets/haversineDistance';
import { zoom } from 'd3';
import React from 'react';

type ExtentSize = {
    /**
     * Width of the extent in kilometers
     */
    widthInKM: number;
    /**
     * Height of the extent in kilometers
     */
    widthInKMFormatted: string;
    /**
     * Height of the extent in kilometers
     */
    heightInKm: number;
    /**
     * Height of the extent in kilometers, formatted as a string with appropriate units (e.g., "10 km", "500 m")
     */
    heightInKmFormatted: string;
    /**
     * Whether the size of the extent should be visible or not. This can be used to hide the size information when the zoom level is too low or when the extent is not defined.
     */
    visible: boolean;
};

/**
 * Helper function to format the size of the extent in a human-readable way.
 * If the size is less than 1 km, it formats it in meters with two decimal places.
 * If it's between 1 km and 100 km, it formats it in kilometers with one decimal place.
 * If it's greater than 100 km, it formats it in kilometers with no decimal places and includes commas as thousand separators.
 * @param num
 * @returns
 */
const formatNumber = (num: number) => {
    if (num === 0) {
        return '0';
    }
    if (num < 1) {
        return num.toPrecision(2);
    }

    if (num < 100) {
        return num.toFixed(1);
    }

    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

/**
 * This hook calculates the width and height of a given extent in kilometers using the Haversine distance formula.
 * If the extent is null or undefined, it returns 0 for both width and height. The hook updates the size of the extent whenever the extent changes.
 *
 * @param extent
 * @returns
 */
export const useCalculateSizeOfExtent = (
    extent: IExtent,
    zoomLevel: number
) => {
    const [sizeOfExtent, setSizeOfExtent] = React.useState<ExtentSize>({
        widthInKM: 0,
        heightInKm: 0,
        widthInKMFormatted: '0',
        heightInKmFormatted: '0',
        visible: false,
    });

    const calculateSizeOfExtent = (extent: IExtent): ExtentSize => {
        const { xmin, ymin, xmax, ymax } = extent || {};

        if (
            xmin === undefined ||
            ymin === undefined ||
            xmax === undefined ||
            ymax === undefined
        ) {
            return {
                widthInKM: 0,
                heightInKm: 0,
                widthInKMFormatted: '0',
                heightInKmFormatted: '0',
                visible: false,
            };
        }
        const widthInKM = haversineDistance(
            { lat: ymax, lon: xmin },
            { lat: ymax, lon: xmax }
        );

        const heightInKm = haversineDistance(
            { lat: ymin, lon: xmin },
            { lat: ymax, lon: xmin }
        );
        return {
            widthInKM,
            heightInKm,
            widthInKMFormatted: formatNumber(widthInKM),
            heightInKmFormatted: formatNumber(heightInKm),
            visible: true,
        };
    };

    React.useEffect(() => {
        if (!extent || !zoomLevel || zoomLevel < 3) {
            setSizeOfExtent({
                widthInKM: 0,
                heightInKm: 0,
                widthInKMFormatted: '0',
                heightInKmFormatted: '0',
                visible: false,
            });
            return;
        }

        const size = calculateSizeOfExtent(extent);
        setSizeOfExtent(size);
    }, [extent, zoomLevel]);

    return sizeOfExtent;
};
