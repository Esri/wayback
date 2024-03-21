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

import ImageElement from '@arcgis/core/layers/support/ImageElement';
import { selectMapCenter } from '@store/Map/reducer';
import { IWaybackItem } from '@typings/index';
import { loadImageAsHTMLIMageElement } from '@utils/snippets/loadImage';
import { AnimationFrameData } from '@vannizhang/images-to-video-converter-client';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ImageElementData } from './useMediaLayerImageElement';
// import { AnimationFrameData4DownloadJob } from '../AnimationDownloadPanel/DownloadPanel';

/**
 * Represents the properties required by the custom hook `useFrameDataForDownloadJob`.
 */
type Props = {
    /**
     * An array wayback items associated with the media layer elements in animation mode.
     */
    waybackItems: IWaybackItem[];
    /**
     * An array of ImageElement objects representing media layer elements.
     */
    imageElements: ImageElementData[];
    /**
     * list of release number of wayback items to exclude from the animation.
     */
    releaseNumOfItems2Exclude: number[];
};

/**
 * This custom hook returns an array of `AnimationFrameData` objects that
 * can be used by the Animation Download task.
 * @param {Props} - The properties required by the hook.
 * @returns An array of `AnimationFrameData4DownloadJob` objects.
 */
export const useFrameDataForDownloadJob = ({
    waybackItems,
    imageElements,
    releaseNumOfItems2Exclude,
}: Props) => {
    const { lon, lat } = useSelector(selectMapCenter) || {};

    const [frameData, setFrameData] = useState<AnimationFrameData[]>([]);

    useEffect(() => {
        (async () => {
            if (!waybackItems?.length || !imageElements?.length) {
                setFrameData([]);
                return;
            }

            const data: AnimationFrameData[] = [];

            const images = await Promise.all(
                imageElements.map((d) =>
                    loadImageAsHTMLIMageElement(d.imageElement.image as string)
                )
            );

            for (let i = 0; i < imageElements.length; i++) {
                const item = waybackItems[i];

                // should not include the frame of the items in the exlusion list
                if (releaseNumOfItems2Exclude.includes(item.releaseNum)) {
                    continue;
                }

                // // load media layer elements as an array of HTML Image Elements
                // const image = await loadImageAsHTMLIMageElement(
                //     imageElements[i].imageElement.image as string
                // );

                const frameData = {
                    image: images[i],
                    imageInfo: `${item.releaseDateLabel}  |  x ${lon.toFixed(
                        3
                    )} y ${lat.toFixed(3)}`,
                } as AnimationFrameData;

                data.push(frameData);
            }

            setFrameData(data);
        })();
    }, [imageElements, releaseNumOfItems2Exclude]);

    return frameData;
};
