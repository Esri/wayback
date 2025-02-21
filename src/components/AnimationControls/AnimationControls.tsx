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

import React, { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@store/configureStore';

import {
    // releaseNum4ItemsWithLocalChangesSelector,
    // allWaybackItemsSelector,
    // activeWaybackItemSelector,
    // releaseNum4ActiveWaybackItemUpdated,
    waybackItemsWithLocalChangesSelector,
} from '@store/Wayback/reducer';

import {
    // waybackItems4AnimationLoaded,
    // rNum4AnimationFramesSelector,
    rNum2ExcludeSelector,
    // toggleAnimationFrame,
    // rNum2ExcludeReset,
    // animationSpeedChanged,
    animationSpeedSelector,
    // isAnimationPlayingToggled,
    // isAnimationPlayingSelector,
    // startAnimation,
    // stopAnimation,
    // updateAnimationSpeed,
    // indexOfCurrentAnimationFrameSelector,
    // waybackItem4CurrentAnimationFrameSelector,
    animationSpeedChanged,
    selectAnimationStatus,
    animationStatusChanged,
    // indexOfActiveAnimationFrameChanged,
    selectReleaseNumberOfActiveAnimationFrame,
    rNum2ExcludeToggled,
    releaseNumberOfActiveAnimationFrameChanged,
    // releaseNumberOfActiveAnimationFrameChanged,
    // setActiveFrameByReleaseNum,
} from '@store/AnimationMode/reducer';

import { IWaybackItem } from '@typings/index';

import { DonwloadAnimationButton } from './DonwloadAnimationButton';
import FramesSeletor from './FramesSeletor';
import SpeedSelector from './SpeedSelector';
import PlayPauseBtn from './PlayPauseBtn';
// import { usePrevious } from '@hooks/usePrevious';
import {
    saveAnimationSpeedInURLQueryParam,
    saveFrames2ExcludeInURLQueryParam,
} from '@utils/UrlSearchParam';

const AnimationControls = () => {
    const dispatch = useAppDispatch();

    const rNum2ExcludeFromAnimation: number[] =
        useAppSelector(rNum2ExcludeSelector);

    const waybackItemsWithLocalChanges: IWaybackItem[] = useAppSelector(
        waybackItemsWithLocalChangesSelector
    );

    const animationSpeed = useAppSelector(animationSpeedSelector);

    const animationStatus = useAppSelector(selectAnimationStatus);

    const releaseNum4ActiveFrame = useAppSelector(
        selectReleaseNumberOfActiveAnimationFrame
    );

    const speedOnChange = useCallback((speed: number) => {
        dispatch(animationSpeedChanged(speed));
    }, []);

    const playPauseBtnOnClick = useCallback(() => {
        if (animationStatus === 'playing') {
            dispatch(animationStatusChanged('pausing'));
        } else {
            dispatch(animationStatusChanged('playing'));
        }
    }, [animationStatus]);

    const getContent = () => {
        if (
            !waybackItemsWithLocalChanges ||
            !waybackItemsWithLocalChanges.length
        ) {
            return (
                <div className="text-center">
                    <p className="mt-4 text-sm">
                        Loading versions with local changes.
                    </p>
                </div>
            );
        }

        return (
            <>
                <DonwloadAnimationButton />

                <div className=" mt-2">
                    <span className=" text-xs">Animation Speed</span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <PlayPauseBtn
                        isPlaying={animationStatus === 'playing'}
                        isLoading={animationStatus === 'loading'}
                        onClick={playPauseBtnOnClick}
                    />

                    <SpeedSelector
                        defaultVal={animationSpeed}
                        onChange={speedOnChange}
                    />
                </div>

                <FramesSeletor
                    waybackItemsWithLocalChanges={waybackItemsWithLocalChanges}
                    rNum2Exclude={rNum2ExcludeFromAnimation}
                    setActiveFrame={(rNum) => {
                        if (animationStatus !== 'pausing') {
                            return;
                        }

                        dispatch(
                            releaseNumberOfActiveAnimationFrameChanged(rNum)
                        );
                        // console.log(rNum);
                    }}
                    toggleFrame={(rNum) => {
                        dispatch(rNum2ExcludeToggled(rNum));
                    }}
                    releaseNum4ActiveFrame={releaseNum4ActiveFrame}
                    isButtonDisabled={animationStatus === 'playing'}
                />
            </>
        );
    };

    useEffect(() => {
        // console.log(rNum2ExcludeFromAnimation)
        saveFrames2ExcludeInURLQueryParam(rNum2ExcludeFromAnimation);
    }, [rNum2ExcludeFromAnimation]);

    return (
        <>
            <div
                className="px-4 py-0 mt-2"
                // style={{
                //     padding: '0 1rem',
                //     marginTop: '.5rem',
                // }}
            >
                {getContent()}
            </div>
        </>
    );
};

export default AnimationControls;
