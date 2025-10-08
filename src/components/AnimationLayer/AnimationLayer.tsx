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
import MediaLayer from '@arcgis/core/layers/MediaLayer';
import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch } from '@store/configureStore';
import { useAppSelector } from '@store/configureStore';
import {
    // animationSpeedChanged,
    animationSpeedSelector,
    animationStatusChanged,
    isAnimationModeOnSelector,
    rNum2ExcludeReset,
    rNum2ExcludeSelector,
    // indexOfActiveAnimationFrameChanged,
    releaseNumberOfActiveAnimationFrameChanged,
    selectAnimationStatus,
    selectReleaseNumberOfActiveAnimationFrame,
    showDownloadAnimationPanelToggled,
    toggleAnimationMode,
    // waybackItems4AnimationSelector,
} from '@store/AnimationMode/reducer';
import classNames from 'classnames';
import { CloseButton } from '@components/CloseButton';
import { useMediaLayerImageElement } from './useMediaLayerImageElement';
import useMediaLayerAnimation from './useMediaLayerAnimation';
import {
    selectIsLoadingWaybackItems,
    waybackItemsWithLocalChangesSelector,
} from '@store/Wayback/reducer';
import { AnimationDownloadPanel } from '@components/AnimationDownloadPanel';
import { useFrameDataForDownloadJob } from './useFrameDataForDownloadJob';
import { delay } from '@utils/snippets/delay';
import { CalciteLoader } from '@esri/calcite-components-react';
import { once } from '@arcgis/core/core/reactiveUtils';
import { AnimationFrameData } from '@vannizhang/images-to-video-converter-client';

type Props = {
    mapView?: MapView;
};

export const AnimationLayer: FC<Props> = ({ mapView }: Props) => {
    const dispatch = useAppDispatch();

    const mediaLayerRef = useRef<MediaLayer>(null);

    const isAnimationModeOn = useAppSelector(isAnimationModeOnSelector);

    const animationStatus = useAppSelector(selectAnimationStatus);

    // const animationSpeedInSeconds = useAppSelector(animationSpeedSelector);

    const animationSpeedInMilliseconds = useAppSelector(animationSpeedSelector);

    /**
     * wayback items with local changes
     */
    const waybackItems = useAppSelector(waybackItemsWithLocalChangesSelector);

    /**
     * release num of wayback items to be excluded from the animation
     */
    const releaseNumOfItems2Exclude = useAppSelector(rNum2ExcludeSelector);

    const isLoadingWaybackItemsWithLoalChanges = useAppSelector(
        selectIsLoadingWaybackItems
    );

    const releaseNumOfActiveFrame = useAppSelector(
        selectReleaseNumberOfActiveAnimationFrame
    );

    /**
     * Array of Imagery Element Data
     */
    const imageElementsData = useMediaLayerImageElement({
        mapView,
        animationStatus,
        waybackItems,
        isLoadingWaybackItemsWithLoalChanges,
    });

    const frameData = useFrameDataForDownloadJob({
        waybackItems,
        imageElements: imageElementsData,
        mapView,
    });

    /**
     * Filtered frame data to exclude any frames that are associated with the release numbers in the `releaseNumOfItems2Exclude` array.
     */
    const filteredFrameData: AnimationFrameData[] = useMemo(() => {
        if (!frameData?.length) {
            return [];
        }

        if (!releaseNumOfItems2Exclude?.length) {
            return frameData;
        }

        return frameData.filter(
            (d) => !releaseNumOfItems2Exclude.includes(Number(d.key))
        );
    }, [frameData, releaseNumOfItems2Exclude]);

    /**
     * This is a callback function that will be called each time the active frame (Image Element) in the animation layer is changed.
     */
    const activeFrameOnChange = useCallback(
        (indexOfActiveFrame: number) => {
            dispatch(
                releaseNumberOfActiveAnimationFrameChanged(
                    waybackItems[indexOfActiveFrame]?.releaseNum
                )
            );

            // console.log(waybackItems[indexOfActiveFrame])
        },
        [waybackItems]
    );

    useMediaLayerAnimation({
        animationStatus,
        animationSpeed: animationSpeedInMilliseconds,
        imageElementsData,
        releaseNumOfItems2Exclude,
        releaseNumOfActiveFrame,
        activeFrameOnChange,
    });

    const initMediaLayer = async () => {
        mediaLayerRef.current = new MediaLayer({
            visible: true,
            // effect: LandCoverLayerEffect,
            // blendMode: LandCoverLayerBlendMode,
        });

        mapView.map.add(mediaLayerRef.current);
    };

    useEffect(() => {
        (async () => {
            if (!mapView) {
                return;
            }

            if (!mediaLayerRef.current) {
                initMediaLayer();
                return;
            }

            const source = mediaLayerRef.current.source as any;

            if (
                !imageElementsData ||
                !imageElementsData?.length ||
                !isAnimationModeOn
            ) {
                // animation is not started or just stopped
                // just clear all elements in media layer
                source.elements.removeAll();
            } else {
                // source.elements.addMany(
                //     imageElementsData.map((d) => d.imageElement)
                // );

                // // wait for one second before starting playing the animation,
                // // to give the media layer enough time to add all image elements
                // await delay(1000);

                // console.log(
                //     'media layer elements are ready, starting animation...'
                // );

                try {
                    const mediaLayerElements = imageElementsData.map(
                        (d) => d.imageElement
                    );

                    for (const element of mediaLayerElements) {
                        source.elements.add(element);

                        // Wait for each element to load before proceeding
                        await once(
                            () =>
                                element.loadStatus === 'loaded' ||
                                element.loadStatus === 'failed'
                        );

                        if (element.loadStatus === 'failed') {
                            throw new Error(
                                `Element failed to load: ${element}`
                            );
                        }

                        console.log(`Element loaded: ${element.loadStatus}`);
                    }

                    // media layer elements are ready, change animation mode to playing to start the animation
                    dispatch(animationStatusChanged('playing'));
                } catch (error) {
                    console.error('Error loading media layer elements:', error);
                    dispatch(animationStatusChanged('failed'));
                }
            }
        })();
    }, [imageElementsData, isAnimationModeOn, mapView]);

    useEffect(() => {
        if (isAnimationModeOn) {
            dispatch(animationStatusChanged('loading'));
        } else {
            dispatch(animationStatusChanged(null));
            dispatch(rNum2ExcludeReset());
            dispatch(releaseNumberOfActiveAnimationFrameChanged(null));
        }
    }, [isAnimationModeOn]);

    useEffect(() => {
        // should close download animation panel whenever user exits the animation mode
        if (animationStatus === null) {
            dispatch(showDownloadAnimationPanelToggled(false));
        }
    }, [animationStatus]);

    if (!isAnimationModeOn) {
        return null;
    }

    return (
        <div
            className={classNames(
                'absolute top-0 left-0 bottom-0 right-0 z-10 flex items-center justify-center'
            )}
        >
            {animationStatus === 'loading' && (
                <CalciteLoader scale="l"></CalciteLoader>
            )}

            <CloseButton
                onClick={() => {
                    dispatch(toggleAnimationMode());
                }}
            />

            <AnimationDownloadPanel
                frameData4DownloadJob={filteredFrameData}
                animationSpeed={animationSpeedInMilliseconds}
                mapViewWindowSize={{
                    width: mapView.width,
                    height: mapView.height,
                }}
            />
        </div>
    );
};
