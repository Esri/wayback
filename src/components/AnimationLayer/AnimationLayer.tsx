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
    // indexOfActiveAnimationFrameChanged,
    releaseNumberOfActiveAnimationFrameChanged,
    selectAnimationStatus,
    toggleAnimationMode,
    waybackItems4AnimationSelector,
} from '@store/AnimationMode/reducer';
import classNames from 'classnames';
import { CloseButton } from '@components/CloseButton';
import { useMediaLayerImageElement } from './useMediaLayerImageElement';
import useMediaLayerAnimation from './useMediaLayerAnimation';

type Props = {
    mapView?: MapView;
};

export const AnimationLayer: FC<Props> = ({ mapView }: Props) => {
    const dispatch = useDispatch();

    const mediaLayerRef = useRef<MediaLayer>();

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const animationStatus = useSelector(selectAnimationStatus);

    const animationSpeed = useSelector(animationSpeedSelector);

    const waybackItems = useSelector(waybackItems4AnimationSelector);

    /**
     * Array of Imagery Elements for each scene in `sortedQueryParams4ScenesInAnimationMode`
     */
    const mediaLayerElements = useMediaLayerImageElement({
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
        mediaLayerElements,
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

        if (!mediaLayerElements) {
            // animation is not started or just stopped
            // just clear all elements in media layer
            source.elements.removeAll();
        } else {
            source.elements.addMany(mediaLayerElements);
            // media layer elements are ready, change animation mode to playing to start the animation
            dispatch(animationStatusChanged('playing'));
        }
    }, [mediaLayerElements, mapView]);

    useEffect(() => {
        if (isAnimationModeOn) {
            dispatch(animationStatusChanged('loading'));
        } else {
            dispatch(animationStatusChanged(null));
        }
    }, [isAnimationModeOn]);

    // useEffect(() => {
    //     // We only need to save animation window information when the animation is in progress.
    //     // Additionally, we should always reset the animation window information in the hash parameters
    //     // when the animation stops. Resetting the animation window information is crucial
    //     // as it ensures that the animation window information is not used if the user manually starts the animation.
    //     // Animation window information from the hash parameters should only be utilized by users
    //     // who open the application in animation mode through a link shared by others.
    //     const extent = animationStatus === 'playing' ? mapView.extent : null;

    //     const width = animationStatus === 'playing' ? mapView.width : null;

    //     const height = animationStatus === 'playing' ? mapView.height : null;

    //     saveAnimationWindowInfoToHashParams(extent, width, height);
    // }, [animationStatus]);

    // useEffect(() => {
    //     // should close download animation panel whenever user exits the animation mode
    //     if (animationStatus === null) {
    //         dispatch(showDownloadAnimationPanelChanged(false));
    //     }
    // }, [animationStatus]);

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
