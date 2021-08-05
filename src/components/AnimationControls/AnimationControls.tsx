import React, {
    useCallback,
    useEffect
} from 'react'

import { useSelector, useDispatch, batch } from 'react-redux';

import {
    // releaseNum4ItemsWithLocalChangesSelector,
    // allWaybackItemsSelector,
    // activeWaybackItemSelector,
    // releaseNum4ActiveWaybackItemUpdated,
    waybackItemsWithLocalChangesSelector
} from '../../store/reducers/WaybackItems';

import {
    waybackItems4AnimationLoaded,
    // rNum4AnimationFramesSelector,
    rNum2ExcludeSelector,
    toggleAnimationFrame,
    rNum2ExcludeReset,
    // animationSpeedChanged,
    animationSpeedSelector,
    isAnimationPlayingToggled,
    isAnimationPlayingSelector,
    startAnimation,
    stopAnimation,
    updateAnimationSpeed
} from '../../store/reducers/AnimationMode'

import { IWaybackItem } from '../../types';

import DonwloadGifButton from './DonwloadGifButton';
import FramesSeletor from './FramesSeletor';
import SpeedSelector from './SpeedSelector';
import PlayPauseBtn from './PlayPauseBtn';

const AnimationControls = () => {

    const dispatch = useDispatch();

    const rNum2ExcludeFromAnimation: number[] = useSelector(rNum2ExcludeSelector);

    // const activeItem:IWaybackItem = useSelector(activeWaybackItemSelector);

    const waybackItemsWithLocalChanges: IWaybackItem[] = useSelector(waybackItemsWithLocalChangesSelector);

    const animationSpeed = useSelector(animationSpeedSelector);

    const isPlaying = useSelector(isAnimationPlayingSelector)

    const speedOnChange = useCallback((speed:number)=>{
        dispatch(updateAnimationSpeed(speed))
    }, []);

    const playPauseBtnOnClick = useCallback(()=>{
        if(isPlaying){
            dispatch(stopAnimation())
        } else {
            dispatch(startAnimation())
        }
    }, [isPlaying])

    useEffect(()=>{
        batch(()=>{
            dispatch(waybackItems4AnimationLoaded(waybackItemsWithLocalChanges))
            dispatch(rNum2ExcludeReset())
        });
    }, [waybackItemsWithLocalChanges])

    return (
        <>
            <div 
                style={{
                    padding: '0 1rem',
                    marginTop: '.5rem'
                }}
            >
                <DonwloadGifButton />

                <div className='leader-half'>
                    <span className='font-size--3'>Animation Speed</span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <PlayPauseBtn 
                        isPlaying={isPlaying}
                        onClick={playPauseBtnOnClick}
                    />

                    <SpeedSelector 
                        defaultVal={animationSpeed}
                        onChange={speedOnChange}
                    />

                </div>

                <FramesSeletor 
                    waybackItemsWithLocalChanges={waybackItemsWithLocalChanges}
                    // activeItem={activeItem}
                    // rNum4AnimationFrames={rNum4AnimationFrames}
                    rNum2Exclude={rNum2ExcludeFromAnimation}
                    // onSelect={(item)=>{
                    //     const { releaseNum} = item;
                    //     dispatch(releaseNum4ActiveWaybackItemUpdated(releaseNum));
                    // }}
                    toggleFrame={(rNum)=>{
                        dispatch(toggleAnimationFrame(rNum))
                    }}
                />
            </div>

        </>
    )
}

export default AnimationControls
