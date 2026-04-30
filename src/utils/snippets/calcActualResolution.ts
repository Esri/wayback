/**
 * Calculates the actual ground resolution (meters per pixel) at a given latitude and zoom level
 * in a Web Mercator projection.
 *
 * @param latitude - The latitude in degrees at which to calculate the resolution.
 * @param zoomLevel - The map zoom level (0 = entire world in one tile).
 * @returns The ground resolution in meters per pixel at the specified latitude and zoom level.
 */
export const calcActualResolution = (
    latitude: number,
    zoomLevel: number
): number => {
    // Constant: meters/pixel at the Equator for zoom level 0.
    // Web Mercator uses a standard tile size of 256x256 pixels. At zoom level 0, the entire circumference of the Earth (roughly 40,075,016.686 meters) fits into one 256-pixel tile.
    // This means the nominal resolution at zoom level 0 is about 156,543.04 meters/pixel.
    const EQUATORIAL_RESOLUTION = 156543.04;

    // Convert latitude to radians
    const latRadians = latitude * (Math.PI / 180);

    // Calculate the true resolution based on the zoom level and latitude
    const trueResolution =
        (EQUATORIAL_RESOLUTION * Math.cos(latRadians)) / Math.pow(2, zoomLevel);

    return trueResolution;
};
