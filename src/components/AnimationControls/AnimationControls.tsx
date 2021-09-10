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
    updateAnimationSpeed,
    indexOfCurrentAnimationFrameSelector,
    waybackItem4CurrentAnimationFrameSelector,
    setActiveFrameByReleaseNum
} from '../../store/reducers/AnimationMode'

import { IWaybackItem } from '../../types';

import DonwloadGifButton from './DonwloadGifButton';
import FramesSeletor from './FramesSeletor';
import SpeedSelector from './SpeedSelector';
import PlayPauseBtn from './PlayPauseBtn';
import { usePrevious } from '../../hooks/usePrevious';
import { saveFrames2ExcludeInURLQueryParam } from '../../utils/UrlSearchParam';

const AnimationControls = () => {

    const dispatch = useDispatch();

    const rNum2ExcludeFromAnimation: number[] = useSelector(rNum2ExcludeSelector);

    // const activeItem:IWaybackItem = useSelector(activeWaybackItemSelector);

    const waybackItemsWithLocalChanges: IWaybackItem[] = useSelector(waybackItemsWithLocalChangesSelector);

    const prevWaybackItemsWithLocalChanges = usePrevious<IWaybackItem[]>(waybackItemsWithLocalChanges)

    const animationSpeed = useSelector(animationSpeedSelector);

    const isPlaying = useSelector(isAnimationPlayingSelector)

    const waybackItem4CurrentAnimationFrame = useSelector(waybackItem4CurrentAnimationFrameSelector);

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

    const getContent = ()=>{

        if(!waybackItemsWithLocalChanges || !waybackItemsWithLocalChanges.length){
            return (
                <div className='text-center'>
                    <p className='leader-1 font-size--2'>Loading versions with local changes.</p>
                </div>
            )
        }

        return (
            <>
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
                    setActiveFrame={(rNum)=>{
                        dispatch(setActiveFrameByReleaseNum(rNum))
                    }}
                    toggleFrame={(rNum)=>{
                        dispatch(toggleAnimationFrame(rNum))
                    }}
                    waybackItem4CurrentAnimationFrame={waybackItem4CurrentAnimationFrame}
                    isButtonDisabled={isPlaying}
                />
            </>
        );
    }

    useEffect(()=>{

        batch(()=>{
            dispatch(waybackItems4AnimationLoaded(waybackItemsWithLocalChanges))

            if(
                prevWaybackItemsWithLocalChanges && 
                prevWaybackItemsWithLocalChanges.length
            ){
                dispatch(rNum2ExcludeReset())
            }
        });
    }, [waybackItemsWithLocalChanges])

    useEffect(()=>{
        // console.log(rNum2ExcludeFromAnimation)
        saveFrames2ExcludeInURLQueryParam(rNum2ExcludeFromAnimation)
    }, [rNum2ExcludeFromAnimation])

    return (
        <>
            <div 
                style={{
                    padding: '0 1rem',
                    marginTop: '.5rem'
                }}
            >
                { getContent() }
            </div>

        </>
    )
}

export default AnimationControls
