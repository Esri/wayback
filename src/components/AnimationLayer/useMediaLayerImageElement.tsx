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
import { AnimationStatus } from '@store/AnimationMode/reducer';
import React, { useEffect, useRef, useState } from 'react';
import ImageElement from '@arcgis/core/layers/support/ImageElement';
import ExtentAndRotationGeoreference from '@arcgis/core/layers/support/ExtentAndRotationGeoreference';
import { IWaybackItem } from '@typings/index';
import { getNormalizedExtent } from '@utils/snippets/getNormalizedExtent';
import { generateAnimationFrames, FrameData } from './generateAnimationFrames';

export const MAP_CONTAINER_LEFT_OFFSET = 350;

type Props = {
    mapView?: MapView;
    animationStatus: AnimationStatus;
    waybackItems: IWaybackItem[];
};

export const useMediaLayerImageElement = ({
    mapView,
    animationStatus,
    waybackItems,
}: Props) => {
    const [imageElements, setImageElements] = useState<ImageElement[]>(null);

    const abortControllerRef = useRef<AbortController>();

    // const animationStatus = useSelector(selectAnimationStatus);

    const loadFrameData = async () => {
        if (!mapView) {
            return;
        }

        // use a new abort controller so the pending requests can be cancelled
        // if user quits animation mode before the responses are returned
        abortControllerRef.current = new AbortController();

        try {
            const extent = getNormalizedExtent(mapView.extent);
            const width = mapView.width;
            const height = mapView.height;

            const { xmin, ymin, xmax, ymax } = extent;

            const container = mapView.container as HTMLDivElement;

            const elemRect = container.getBoundingClientRect();
            // console.log(elemRect)

            const frameData = await generateAnimationFrames({
                frameRect: {
                    screenX: elemRect.left - MAP_CONTAINER_LEFT_OFFSET,
                    screenY: elemRect.top,
                    width,
                    height,
                },
                mapView,
                waybackItems,
            });

            // once responses are received, get array of image elements using the binary data returned from export image requests
            const imageElements = frameData.map((d: FrameData) => {
                return new ImageElement({
                    image: URL.createObjectURL(d.frameBlob),
                    georeference: new ExtentAndRotationGeoreference({
                        extent: {
                            spatialReference: {
                                wkid: 102100,
                            },
                            xmin,
                            ymin,
                            xmax,
                            ymax,
                        },
                    }),
                    opacity: 1,
                });
            });

            setImageElements(imageElements);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!animationStatus || !waybackItems.length) {
            // call abort so all pending requests can be cancelled
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // call revokeObjectURL so these image elements can be freed from the memory
            if (imageElements) {
                for (const elem of imageElements) {
                    URL.revokeObjectURL(elem.image as string);
                }
            }

            setImageElements(null);
        } else if (animationStatus === 'loading') {
            loadFrameData();
        }
    }, [animationStatus, waybackItems]);

    return imageElements;
};
