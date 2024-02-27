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

import { useSelector, useDispatch, batch } from 'react-redux';

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
    rNum2ExcludeReset,
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
    // setActiveFrameByReleaseNum,
} from '@store/AnimationMode/reducer';

import { IWaybackItem } from '@typings/index';

import DonwloadGifButton from './DonwloadGifButton';
import FramesSeletor from './FramesSeletor';
import SpeedSelector from './SpeedSelector';
import PlayPauseBtn from './PlayPauseBtn';
// import { usePrevious } from '@hooks/usePrevious';
import {
    saveAnimationSpeedInURLQueryParam,
    saveFrames2ExcludeInURLQueryParam,
} from '@utils/UrlSearchParam';

const AnimationControls = () => {
    const dispatch = useDispatch();

    const rNum2ExcludeFromAnimation: number[] =
        useSelector(rNum2ExcludeSelector);

    const waybackItemsWithLocalChanges: IWaybackItem[] = useSelector(
        waybackItemsWithLocalChangesSelector
    );

    const animationSpeed = useSelector(animationSpeedSelector);

    const animationStatus = useSelector(selectAnimationStatus);

    const releaseNum4ActiveFrame = useSelector(
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
                    <p className="leader-1 font-size--2">
                        Loading versions with local changes.
                    </p>
                </div>
            );
        }

        return (
            <>
                <DonwloadGifButton />

                <div className="leader-half">
                    <span className="font-size--3">Animation Speed</span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <PlayPauseBtn
                        isPlaying={animationStatus === 'playing'}
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
                        // dispatch(indexOfActiveAnimationFrameChanged(rNum));
                        console.log(rNum);
                    }}
                    toggleFrame={(rNum) => {
                        // dispatch(toggleAnimationFrame(rNum));
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

    useEffect(() => {
        saveAnimationSpeedInURLQueryParam(
            animationStatus !== null ? animationSpeed : undefined
        );
    }, [animationSpeed, animationStatus]);

    return (
        <>
            <div
                style={{
                    padding: '0 1rem',
                    marginTop: '.5rem',
                }}
            >
                {getContent()}
            </div>
        </>
    );
};

export default AnimationControls;
