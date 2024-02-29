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

import React, { FC, useMemo } from 'react';

export type Dimension = {
    width: number;
    height: number;
};

type Props = {
    /**
     * dimension of the preview window
     */
    previewWindowSize: Dimension;
    /**
     * dimension of the map view window
     */
    mapViewWindowSize: Dimension;
};

/**
 * Preview Window component helps user to visually see the portion of animation that will be included in the output mp4 file
 * @param param0
 * @returns
 */
export const PreviewWindow: FC<Props> = ({
    previewWindowSize,
    mapViewWindowSize,
}) => {
    /**
     * useMemo Hook for Adjusting Window Size
     *
     * This `useMemo` hook adjusts the size of a preview window (represented by the `size` variable)
     * to make sure it can fit within the preview window (represented by the `mapViewWindowSize` variable).
     *
     * @param {WindowSize} size - The original size of the preview window to be adjusted.
     * @param {WindowSize} mapViewWindowSize - The size of the map view window.
     * @returns {WindowSize | null} - The adjusted window size, or null if `size` is falsy.
     */
    const adjustedSize: Dimension = useMemo(() => {
        if (!previewWindowSize) {
            return null;
        }

        // Calculate the aspect ratio of the user selected output size size.
        const aspectRatio = previewWindowSize.width / previewWindowSize.height;

        const previewWindowHeight = mapViewWindowSize.height;
        const previewWindowWidth = previewWindowHeight * aspectRatio;

        if (previewWindowWidth > mapViewWindowSize.width) {
            return {
                width: mapViewWindowSize.width,
                height: mapViewWindowSize.width * (1 / aspectRatio),
            };
        }

        return {
            height: previewWindowHeight,
            width: previewWindowWidth,
        };
    }, [previewWindowSize]);

    if (!adjustedSize) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div
                style={{
                    width: adjustedSize.width,
                    height: adjustedSize.height,
                    boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.8)`,
                }}
            ></div>
        </div>
    );
};
