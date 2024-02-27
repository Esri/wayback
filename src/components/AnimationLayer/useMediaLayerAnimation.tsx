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

import React, { FC, useEffect, useRef, useState } from 'react';
import IImageElement from '@arcgis/core/layers/support/ImageElement';
import { AnimationStatus } from '@store/AnimationMode/reducer';

type Props = {
    /**
     * status of the animation mode
     */
    animationStatus: AnimationStatus;
    /**
     * animation speed in millisecond
     */
    animationSpeed: number;
    /**
     * array of image elements to be animated
     */
    mediaLayerElements: IImageElement[];
    /**
     * Fires when the active frame changes
     * @param indexOfActiveFrame index of the active frame
     * @returns void
     */
    activeFrameOnChange: (indexOfActiveFrame: number) => void;
};

/**
 * This is a custom hook that handles the animation of input media layer elements
 * @param animationStatus status of the animation
 * @param mediaLayerElements Image Elements added to a media layer that will be animated
 */
const useMediaLayerAnimation = ({
    animationStatus,
    animationSpeed,
    mediaLayerElements,
    activeFrameOnChange,
}: Props) => {
    const isPlayingRef = useRef<boolean>(false);

    const timeLastFrameDisplayed = useRef<number>(performance.now());

    const indexOfNextFrame = useRef<number>(0);

    const activeFrameOnChangeRef = useRef<any>();

    const animationSpeedRef = useRef<number>(animationSpeed);

    const showNextFrame = () => {
        // use has stopped animation, no need to show next frame
        if (!isPlayingRef.current) {
            return;
        }

        // get current performance time
        const now = performance.now();

        const millisecondsSinceLastFrame = now - timeLastFrameDisplayed.current;

        // if last frame was shown within the time window, no need to display next frame
        if (millisecondsSinceLastFrame < animationSpeedRef.current) {
            requestAnimationFrame(showNextFrame);
            return;
        }

        timeLastFrameDisplayed.current = now;

        // reset index of next frame to 0 if it is out of range.
        // this can happen when a frame gets removed after previous animation is stopped
        if (indexOfNextFrame.current >= mediaLayerElements.length) {
            indexOfNextFrame.current = 0;
        }

        activeFrameOnChangeRef.current(indexOfNextFrame.current);

        for (let i = 0; i < mediaLayerElements.length; i++) {
            const opacity = i === indexOfNextFrame.current ? 1 : 0;
            mediaLayerElements[i].opacity = opacity;
        }

        // update indexOfNextFrame using the index of next element
        // when hit the end of the array, use 0 instead
        indexOfNextFrame.current =
            (indexOfNextFrame.current + 1) % mediaLayerElements.length;

        // call showNextFrame recursively to play the animation as long as
        // animationMode is 'playing'
        requestAnimationFrame(showNextFrame);
    };

    useEffect(() => {
        isPlayingRef.current = animationStatus === 'playing';

        // cannot animate layers if the list is empty
        if (!mediaLayerElements || !mediaLayerElements?.length) {
            return;
        }

        if (mediaLayerElements && animationStatus === 'playing') {
            requestAnimationFrame(showNextFrame);
        }
    }, [animationStatus, mediaLayerElements]);

    useEffect(() => {
        activeFrameOnChangeRef.current = activeFrameOnChange;
    }, [activeFrameOnChange]);

    useEffect(() => {
        animationSpeedRef.current = animationSpeed;
    }, [animationSpeed]);
};

export default useMediaLayerAnimation;
