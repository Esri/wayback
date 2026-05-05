/* Copyright 2024-2026 Esri
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

import { Extent, Point } from '@arcgis/core/geometry';
import MapView from '@arcgis/core/views/MapView';
import { useAppSelector } from '@store/configureStore';
import {
    selectIsMapUpdating,
    selectMapCenterAndZoom,
} from '@store/Map/reducer';
import { IExtent } from '@typings/index';
import classNames from 'classnames';
import React, { useState, useRef, FC, useEffect, useMemo } from 'react';
import { calculateSizeOfExtent } from './useCalculateSizeOfExtent';

const MIN_SIZE = 256;

const RESIZE_BUTTON_CLASSNAMES = `absolute w-4 h-4 border border-white bg-custom-theme-blue pointer-events-auto rounded-full`;

type Dimensions = {
    width: number;
    height: number;
};

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type Props = {
    mapView: MapView;
    extent: IExtent;
    onExtentChange: (payload: { extent: IExtent; zoomLevel: number }) => void;
};

export const WayportExtentEditor: FC<Props> = ({
    mapView,
    extent,
    onExtentChange,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [isReady, setIsReady] = useState(false);

    const [dimensions, setDimensions] = useState<Dimensions>({
        width: 0,
        height: 0,
    });

    const [isDragging, setIsDragging] = useState(false);

    const mapCenterAndZoom = useAppSelector(selectMapCenterAndZoom);

    const isMapUpdating = useAppSelector(selectIsMapUpdating);

    const [extentSize, setExtentSize] = useState(() =>
        calculateSizeOfExtent(extent)
    );

    /**
     * Track whether the box dimensions exceed the map view size.
     * If so, constrain them to 80% of the map size to keep resize handles accessible.
     * This rechecks on every render to handle window resizing or map view changes.
     */
    const isDimensionBiggerThanMap = useMemo(() => {
        if (!mapView) return false;

        if (!dimensions.width || !dimensions.height) return false;

        const mapWidth = mapView.width;
        const mapHeight = mapView.height;

        return dimensions.width >= mapWidth || dimensions.height >= mapHeight;
    }, [dimensions, mapView.width, mapView.height]);

    /**
     * Track if the extent size should be shown on the map.
     * The size is shown when the extent has a valid size,
     * the user is not currently dragging the box, the map is zoomed in enough to show the details of the extent size,
     * and the map is not currently updating which could cause jitter in the displayed size as the box dimensions are being recalculated.
     */
    const showExtentSize = useMemo(() => {
        return (
            extentSize &&
            extentSize.widthInKM &&
            extentSize.heightInKm &&
            isDragging === false &&
            mapCenterAndZoom?.zoom !== undefined &&
            mapCenterAndZoom.zoom > 3 &&
            isMapUpdating === false
        );
    }, [extentSize, isDragging, mapCenterAndZoom?.zoom, isMapUpdating]);

    const dragInfoRef = useRef<{
        corner: Corner;
        startX: number;
        startY: number;
        startWidth: number;
        startHeight: number;
    } | null>(null);

    /**
     * This function initializes the dimensions of the box based on the initial extent.
     * It converts the corners of the initial extent to screen coordinates to calculate
     * the initial width and height of the box in pixels.
     *
     * @returns
     */
    const initDimensions = () => {
        // get the point of the initial extent corners and convert to screen coordinates to calculate the initial width and height of the box in pixels
        const bottomLeftPoint = new Point({
            latitude: extent.ymin,
            longitude: extent.xmin,
        });
        const topRightPoint = new Point({
            latitude: extent.ymax,
            longitude: extent.xmax,
        });

        // get the screen coordinates of the bottom left and top right points of the initial extent
        const bottomLeftScreen = mapView.toScreen(bottomLeftPoint);
        const topRightScreen = mapView.toScreen(topRightPoint);

        // console.log('MapView ready - Initial extent screen points - bottomLeftScreen:', bottomLeftScreen, 'topRightScreen:', topRightScreen);

        if (!bottomLeftScreen || !topRightScreen) return;

        // Calculate the initial width and height of the box in pixels based on the screen coordinates of the initial extent corners
        const initialWidth = Math.abs(topRightScreen.x - bottomLeftScreen.x);
        const initialHeight = Math.abs(topRightScreen.y - bottomLeftScreen.y);

        setDimensions({
            width: initialWidth,
            height: initialHeight,
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragInfoRef.current || !containerRef.current) return;

        const { corner, startX, startY, startWidth, startHeight } =
            dragInfoRef.current;

        // Calculate how much the mouse has moved since the user started dragging
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Get parent dimensions
        const parentRect = containerRef.current.getBoundingClientRect();
        // Calculate the maximum allowed width and height based on the parent dimensions and a maximum percentage (e.g., 80%) of the parent size to prevent the box from becoming too large
        const maxWidth = parentRect.width * 0.8;
        const maxHeight = parentRect.height * 0.8;

        let newWidth = startWidth;
        let newHeight = startHeight;

        // Calculate new dimensions based on which corner is being dragged
        // Multiply by 2 because the box is centered, so it expands equally on both sides
        if (corner.includes('right')) {
            newWidth = startWidth + deltaX * 2;
        } else if (corner.includes('left')) {
            newWidth = startWidth - deltaX * 2;
        }

        if (corner.includes('bottom')) {
            newHeight = startHeight + deltaY * 2;
        } else if (corner.includes('top')) {
            newHeight = startHeight - deltaY * 2;
        }

        // Enforce minimum and maximum size
        newWidth = Math.max(MIN_SIZE, Math.min(maxWidth, newWidth));
        newHeight = Math.max(MIN_SIZE, Math.min(maxHeight, newHeight));

        setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
        // Clear the drag info and remove event listeners when the user releases the mouse button
        dragInfoRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        setIsDragging(false);
    };

    const handleMouseDown = (corner: Corner, evt: React.MouseEvent) => {
        evt.preventDefault();

        // Store the initial position and dimensions when the user starts dragging
        dragInfoRef.current = {
            corner,
            startX: evt.clientX,
            startY: evt.clientY,
            startWidth: dimensions.width,
            startHeight: dimensions.height,
        };

        // Add event listeners to track mouse movement and when the user releases the mouse button
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        setIsDragging(true);
    };

    // When the mapView is ready, zoom to the initial extent and then set isReady to true to show the box and allow resizing
    useEffect(() => {
        // Convert dimensions to extent and call onExtentChange
        if (!containerRef.current || !mapView) return;

        // console.log('Initial extent points - bottomLeftPt:', bottomLeftPt, 'topRightPt:', topRightPt);

        mapView.when(async () => {
            // console.log('MapView is ready, zooming to initial extent:', initialExtent);

            await mapView.goTo({
                target: new Extent({
                    xmin: extent.xmin,
                    ymin: extent.ymin,
                    xmax: extent.xmax,
                    ymax: extent.ymax,
                    spatialReference: {
                        wkid: 4326,
                    },
                }),
            });

            setIsReady(true);
        });
    }, [mapView]);

    useEffect(() => {
        if (!isReady) return;

        initDimensions();
    }, [isReady]);

    // Recalculate extent of the download job when dimensions or map center/zoom changes
    useEffect(() => {
        if (!containerRef.current || !mapView || !isReady) return;

        // no need to recalculate if the user is currently dragging the box, as we will calculate the new extent on mouse up after the user finishes resizing
        if (isDragging || isMapUpdating) {
            // console.log('User is currently dragging the box, skipping extent recalculation until dragging is finished.');
            return;
        }

        const { width, height } = dimensions;

        // no need to calculate if dimensions are not set yet
        if (!width || !height) return;

        // Get the center of the container in screen coordinates
        const containerRect = containerRef.current.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;

        // Calculate the screen coordinates of the top-left and bottom-right corners of the box
        const topLeftScreen = {
            x: centerX - width / 2,
            y: centerY - height / 2,
        };
        const bottomRightScreen = {
            x: centerX + width / 2,
            y: centerY + height / 2,
        };

        // Convert the screen coordinates back to map points
        const topLeftMapPoint = mapView.toMap(topLeftScreen);
        const bottomRightMapPoint = mapView.toMap(bottomRightScreen);

        if (!topLeftMapPoint || !bottomRightMapPoint) return;

        // Create a new extent from the two map points
        const newExtent: IExtent = {
            xmin: topLeftMapPoint.longitude,
            ymin: bottomRightMapPoint.latitude,
            xmax: bottomRightMapPoint.longitude,
            ymax: topLeftMapPoint.latitude,
        };
        // console.log('Calculated new extent from box dimensions:', newExtent);

        const extentSize = calculateSizeOfExtent(newExtent);
        setExtentSize(extentSize);
        // console.log('Calculated size of new extent:', extentSize);

        onExtentChange({
            extent: newExtent,
            zoomLevel: mapCenterAndZoom?.zoom || 0,
        });
    }, [
        dimensions,
        mapCenterAndZoom?.zoom,
        mapCenterAndZoom?.center?.lat,
        mapCenterAndZoom?.center?.lon,
        isDragging,
        isReady,
        isMapUpdating,
    ]);

    useEffect(() => {
        // If the box dimensions exceed the map view size, constrain them to 80% of the map size to keep resize handles accessible
        if (isDimensionBiggerThanMap) {
            // calculate the new dimensions to be 80% of the map size
            const newWidth = Math.min(dimensions.width, mapView.width * 0.8);
            const newHeight = Math.min(dimensions.height, mapView.height * 0.8);

            setDimensions((prev) => ({
                width: Math.max(MIN_SIZE, newWidth),
                height: Math.max(MIN_SIZE, newHeight),
            }));
        }
    }, [isDimensionBiggerThanMap]);

    return (
        <div
            ref={containerRef}
            className="absolute top-0 left-0 w-full h-full z-0 flex items-center justify-center pointer-events-none"
        >
            {isReady && (
                <div
                    className={classNames('relative border border-white')}
                    style={{
                        width: `${dimensions.width}px`,
                        height: `${dimensions.height}px`,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
                    }}
                >
                    {/* Corner handles */}
                    <button
                        className={classNames(
                            RESIZE_BUTTON_CLASSNAMES,
                            '-top-2 -left-2 cursor-nw-resize'
                        )}
                        onMouseDown={(e) => handleMouseDown('top-left', e)}
                    />
                    <button
                        className={classNames(
                            RESIZE_BUTTON_CLASSNAMES,
                            '-top-2 -right-2 cursor-ne-resize'
                        )}
                        onMouseDown={(e) => handleMouseDown('top-right', e)}
                    />
                    <button
                        className={classNames(
                            RESIZE_BUTTON_CLASSNAMES,
                            '-bottom-2 -left-2 cursor-sw-resize'
                        )}
                        onMouseDown={(e) => handleMouseDown('bottom-left', e)}
                    />
                    <button
                        className={classNames(
                            RESIZE_BUTTON_CLASSNAMES,
                            '-bottom-2 -right-2 cursor-se-resize'
                        )}
                        onMouseDown={(e) => handleMouseDown('bottom-right', e)}
                    />

                    {showExtentSize && (
                        <>
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-custom-theme-blue text-white px-2 py-1 rounded text-xs w-[80px] text-center">
                                {extentSize.widthInKMFormatted + ' km'}
                            </div>

                            <div className="absolute top-1/2 left-10 transform -translate-y-1/2 -translate-x-full -rotate-90 bg-custom-theme-blue text-white px-2 py-1 rounded text-xs w-[80px] text-center">
                                {extentSize.heightInKmFormatted + ' km'}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
