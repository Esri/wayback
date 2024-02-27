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
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
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
    showDownloadAnimationPanelToggled,
    toggleAnimationMode,
    // waybackItems4AnimationSelector,
} from '@store/AnimationMode/reducer';
import classNames from 'classnames';
import { CloseButton } from '@components/CloseButton';
import { useMediaLayerImageElement } from './useMediaLayerImageElement';
import useMediaLayerAnimation from './useMediaLayerAnimation';
import { waybackItemsWithLocalChangesSelector } from '@store/Wayback/reducer';

type Props = {
    mapView?: MapView;
};

export const AnimationLayer: FC<Props> = ({ mapView }: Props) => {
    const dispatch = useDispatch();

    const mediaLayerRef = useRef<MediaLayer>();

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const animationStatus = useSelector(selectAnimationStatus);

    const animationSpeed = useSelector(animationSpeedSelector);

    const waybackItems = useSelector(waybackItemsWithLocalChangesSelector);

    /**
     * release num of wayback items to be excluded from the animation
     */
    const releaseNumOfItems2Exclude = useSelector(rNum2ExcludeSelector);

    /**
     * Array of Imagery Element Data
     */
    const imageElementsData = useMediaLayerImageElement({
        mapView,
        animationStatus,
        waybackItems,
    });

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
        animationSpeed: animationSpeed * 1000,
        imageElementsData,
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
        if (!mediaLayerRef.current) {
            initMediaLayer();
            return;
        }

        const source = mediaLayerRef.current.source as any;

        if (!imageElementsData) {
            // animation is not started or just stopped
            // just clear all elements in media layer
            source.elements.removeAll();
        } else {
            source.elements.addMany(
                imageElementsData.map((d) => d.imageElement)
            );
            // media layer elements are ready, change animation mode to playing to start the animation
            dispatch(animationStatusChanged('playing'));
        }
    }, [imageElementsData, mapView]);

    useEffect(() => {
        if (isAnimationModeOn) {
            dispatch(animationStatusChanged('loading'));
        } else {
            dispatch(animationStatusChanged(null));
            dispatch(rNum2ExcludeReset());
        }
    }, [isAnimationModeOn]);

    useEffect(() => {
        // should close download animation panel whenever user exits the animation mode
        if (animationStatus === null) {
            dispatch(showDownloadAnimationPanelToggled(false));
        }
    }, [animationStatus]);

    if (!animationStatus) {
        return null;
    }

    return (
        <div
            className={classNames(
                'absolute top-0 left-0 bottom-0 right-0 z-10 flex items-center justify-center'
            )}
        >
            {animationStatus === 'loading' && (
                <calcite-loader active scale="l"></calcite-loader>
            )}

            <CloseButton
                onClick={() => {
                    dispatch(toggleAnimationMode());
                }}
            />

            {/* <AnimationDownloadPanel
                frameData4DownloadJob={frameData4DownloadJob}
                animationSpeed={animationSpeed}
                mapViewWindowSize={{
                    width: mapView.width,
                    height: mapView.height,
                }}
            /> */}
        </div>
    );
};
