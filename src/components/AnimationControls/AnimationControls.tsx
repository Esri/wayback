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
    setActiveWaybackItem,
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
    showDownloadAnimationPanelToggled,
    // releaseNumberOfActiveAnimationFrameChanged,
    // setActiveFrameByReleaseNum,
} from '@store/AnimationMode/reducer';

import { IWaybackItem } from '@typings/index';

import { DonwloadAnimationButton } from './DonwloadAnimationButton';
import FramesSeletor from './FramesSeletor';
import SpeedSelector from './SpeedSelector';
import { AnimationStatusControlButtons } from './AnimationStatusControlButtons';
// import { usePrevious } from '@hooks/usePrevious';
import {
    saveAnimationSpeedInURLQueryParam,
    saveFrames2ExcludeInURLQueryParam,
} from '@utils/UrlSearchParam';
import { copyAnimationLink } from '@store/AnimationMode/thunks';

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

    /**
     * Whether the animation is playing or pausing
     */
    const isAnimationActive =
        animationStatus === 'playing' || animationStatus === 'pausing';

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
                {/* <DonwloadAnimationButton /> */}

                <div className="px-4 mb-2">
                    {animationStatus === 'failed' && (
                        <div className="text-red-400 text-xs">
                            Failed to load animation frames. Click the Play
                            button below to try again.
                        </div>
                    )}

                    <div className="flex items-center">
                        {isAnimationActive && (
                            <SpeedSelector
                                defaultVal={animationSpeed}
                                onChange={speedOnChange}
                            />
                        )}

                        {!isAnimationActive && (
                            <div className="grow leading-tight">
                                <span className="text-sm opacity-70">
                                    {animationStatus === 'loading'
                                        ? 'Loading animation frames...'
                                        : 'Chosse versions to animate.'}
                                </span>
                            </div>
                        )}

                        <AnimationStatusControlButtons
                            status={animationStatus}
                            // onClick={playPauseBtnOnClick}
                            statusOnChanged={(status) => {
                                dispatch(animationStatusChanged(status));
                            }}
                            downloadButtonOnClick={() => {
                                dispatch(
                                    showDownloadAnimationPanelToggled(true)
                                );
                            }}
                            copyLinkButtonOnClick={() => {
                                dispatch(copyAnimationLink());
                            }}
                        />
                    </div>
                </div>

                <FramesSeletor
                    waybackItemsWithLocalChanges={waybackItemsWithLocalChanges}
                    rNum2Exclude={rNum2ExcludeFromAnimation}
                    setActiveFrame={(releaseNum) => {
                        if (
                            animationStatus === 'playing' ||
                            animationStatus === 'loading'
                        ) {
                            return;
                        }

                        dispatch(
                            releaseNumberOfActiveAnimationFrameChanged(
                                releaseNum
                            )
                        );

                        // also set the active wayback item in the wayback reducer
                        // this is to keep the active item in sync when user selects a frame in animation controls
                        // and can help user to see the selected frame's details when the animation is not started
                        dispatch(setActiveWaybackItem(releaseNum));

                        // console.log(rNum);
                    }}
                    toggleFrame={(rNum) => {
                        dispatch(rNum2ExcludeToggled(rNum));
                    }}
                    releaseNum4ActiveFrame={releaseNum4ActiveFrame}
                    isButtonDisabled={
                        animationStatus === 'playing' ||
                        animationStatus === 'loading'
                    }
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
                className="h-full py-0 mt-2"
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
