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
import { ImageElementData } from './useMediaLayerImageElement';

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
    imageElementsData: ImageElementData[];
    /**
     * list of release number of wayback items to exclude from the animation
     */
    releaseNumOfItems2Exclude: number[];

    releaseNumOfActiveFrame: number;
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
    imageElementsData,
    releaseNumOfItems2Exclude,
    releaseNumOfActiveFrame,
    activeFrameOnChange,
}: Props) => {
    const isPlayingRef = useRef<boolean>(false);

    const timeLastFrameDisplayed = useRef<number>(performance.now());

    const indexOfActiveFrame = useRef<number>(0);

    const activeFrameOnChangeRef = useRef<any>();

    const animationSpeedRef = useRef<number>(animationSpeed);

    const releaseNumOfItems2ExcludeRef = useRef<number[]>([]);

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
        if (indexOfActiveFrame.current >= imageElementsData.length) {
            indexOfActiveFrame.current = 0;
        }

        activeFrameOnChangeRef.current(indexOfActiveFrame.current);

        for (let i = 0; i < imageElementsData.length; i++) {
            const opacity = i === indexOfActiveFrame.current ? 1 : 0;
            imageElementsData[i].imageElement.opacity = opacity;
        }

        // set index of active frame to -1 so that all frames wil be exclude from the animation
        if (
            releaseNumOfItems2ExcludeRef.current.length ===
            imageElementsData.length
        ) {
            indexOfActiveFrame.current = -1;
            requestAnimationFrame(showNextFrame);
            return;
        }

        // get the index of animation frame that will become active next
        let indexOfNextFrame =
            (indexOfActiveFrame.current + 1) % imageElementsData.length;

        // check if the next frame should be excluded from the animation,
        // if so, update the indexOfNextFrame to skip the frame that should be excluded
        while (
            indexOfNextFrame !== indexOfActiveFrame.current &&
            releaseNumOfItems2ExcludeRef.current.includes(
                imageElementsData[indexOfNextFrame].releaseNumber
            )
        ) {
            indexOfNextFrame =
                (indexOfNextFrame + 1) % imageElementsData.length;
        }

        // update indexOfNextFrame using the index of next element
        // when hit the end of the array, use 0 instead
        indexOfActiveFrame.current = indexOfNextFrame;

        // call showNextFrame recursively to play the animation as long as
        // animationMode is 'playing'
        requestAnimationFrame(showNextFrame);
    };

    useEffect(() => {
        isPlayingRef.current = animationStatus === 'playing';

        // reset the index of active frame when animation is stopped
        if (animationStatus === null) {
            indexOfActiveFrame.current = 0;
        }

        // cannot animate layers if the list is empty
        if (!imageElementsData || !imageElementsData?.length) {
            return;
        }

        if (imageElementsData?.length && animationStatus === 'playing') {
            requestAnimationFrame(showNextFrame);
        }
    }, [animationStatus, imageElementsData]);

    useEffect(() => {
        activeFrameOnChangeRef.current = activeFrameOnChange;
    }, [activeFrameOnChange]);

    useEffect(() => {
        animationSpeedRef.current = animationSpeed;
    }, [animationSpeed]);

    useEffect(() => {
        releaseNumOfItems2ExcludeRef.current = releaseNumOfItems2Exclude;
    }, [releaseNumOfItems2Exclude]);

    useEffect(() => {
        // should not do anything if the animation is playing or loading
        if (animationStatus !== 'pausing') {
            return;
        }

        // find the index of active frame using the release number
        // why is this necessary? when the animation is paused, the user can click on the
        // frame list card to view a frame and decide whether or not to include this frame
        // in the animation
        indexOfActiveFrame.current = imageElementsData.findIndex(
            (d) => d.releaseNumber === releaseNumOfActiveFrame
        );

        // adjust opacity of image elements to show the one that is currently active
        for (let i = 0; i < imageElementsData.length; i++) {
            const opacity = i === indexOfActiveFrame.current ? 1 : 0;
            imageElementsData[i].imageElement.opacity = opacity;
        }
    }, [animationStatus, releaseNumOfActiveFrame, imageElementsData]);
};

export default useMediaLayerAnimation;
