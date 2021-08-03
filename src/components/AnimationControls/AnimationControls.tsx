import React, {
    useCallback,
    useEffect
} from 'react'

import { useSelector, useDispatch, batch } from 'react-redux';

import {
    // releaseNum4ItemsWithLocalChangesSelector,
    // allWaybackItemsSelector,
    activeWaybackItemSelector,
    releaseNum4ActiveWaybackItemUpdated,
    waybackItemsWithLocalChangesSelector
} from '../../store/reducers/WaybackItems';

import {
    waybackItems4AnimationLoaded,
    // rNum4AnimationFramesSelector,
    rNum2ExcludeSelector,
    rNum2ExcludeToggled,
    rNum2ExcludeReset,
    animationSpeedChanged
} from '../../store/reducers/AnimationMode'

import { IWaybackItem } from '../../types';

import DonwloadGifButton from './DonwloadGifButton';
import FramesSeletor from './FramesSeletor';
import SpeedSelector from './SpeedSelector';

const AnimationControls = () => {

    const dispatch = useDispatch();

    // const waybackItems: IWaybackItem[] = useSelector(allWaybackItemsSelector);

    // const rNum4WaybackItemsWithLocalChanges: number[] = useSelector(
    //     releaseNum4ItemsWithLocalChangesSelector
    // );

    // const rNum4AnimationFrames: number[] = useSelector(rNum4AnimationFramesSelector);

    const rNum2ExcludeFromAnimation: number[] = useSelector(rNum2ExcludeSelector);

    const activeItem:IWaybackItem = useSelector(activeWaybackItemSelector);

    const waybackItemsWithLocalChanges: IWaybackItem[] = useSelector(waybackItemsWithLocalChangesSelector);

    // useEffect(()=>{
    //     batch(()=>{
    //         dispatch(rNum4AnimationFramesLoaded(rNum4WaybackItemsWithLocalChanges))
    //         dispatch(rNum2ExcludeReset())
    //     });
    // }, [rNum4WaybackItemsWithLocalChanges])

    const speedOnChange = useCallback((speed:number)=>{
        dispatch(animationSpeedChanged(speed))
    }, [])

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

                <SpeedSelector 
                    onChange={speedOnChange}
                />

                <FramesSeletor 
                    waybackItemsWithLocalChanges={waybackItemsWithLocalChanges}
                    activeItem={activeItem}
                    // rNum4AnimationFrames={rNum4AnimationFrames}
                    rNum2Exclude={rNum2ExcludeFromAnimation}
                    onSelect={(item)=>{
                        const { releaseNum} = item;
                        dispatch(releaseNum4ActiveWaybackItemUpdated(releaseNum));
                    }}
                    toggleFrame={(rNum)=>{
                        dispatch(rNum2ExcludeToggled(rNum))
                    }}
                />
            </div>

        </>
    )
}

export default AnimationControls
