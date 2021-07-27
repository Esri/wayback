import React, {
    useEffect
} from 'react'

import { useSelector, useDispatch, batch } from 'react-redux';

import {
    releaseNum4ItemsWithLocalChangesSelector,
    allWaybackItemsSelector,
    activeWaybackItemSelector,
    releaseNum4ActiveWaybackItemUpdated
} from '../../store/reducers/WaybackItems';

import {
    rNum4AnimationFramesLoaded,
    rNum4AnimationFramesSelector,
    rNum2ExcludeSelector,
    rNum2ExcludeToggled,
    rNum2ExcludeReset
} from '../../store/reducers/AnimationMode'

import { IWaybackItem } from '../../types';

import DonwloadGifButton from './DonwloadGifButton';
import FramesSeletor from './FramesSeletor';

const AnimationControls = () => {

    const dispatch = useDispatch();

    const waybackItems: IWaybackItem[] = useSelector(allWaybackItemsSelector);

    const rNum4WaybackItemsWithLocalChanges: number[] = useSelector(
        releaseNum4ItemsWithLocalChangesSelector
    );

    const rNum4AnimationFrames: number[] = useSelector(rNum4AnimationFramesSelector);

    const rNum2ExcludeFromAnimation: number[] = useSelector(rNum2ExcludeSelector);

    const activeItem:IWaybackItem = useSelector(activeWaybackItemSelector)

    useEffect(()=>{
        batch(()=>{
            dispatch(rNum4AnimationFramesLoaded(rNum4WaybackItemsWithLocalChanges))
            dispatch(rNum2ExcludeReset())
        });
    }, [rNum4WaybackItemsWithLocalChanges])

    return (
        <>
            <div 
                style={{
                    padding: '0 1rem',
                    marginTop: '.5rem'
                }}
            >
                <DonwloadGifButton />

                <FramesSeletor 
                    waybackItems={waybackItems}
                    activeItem={activeItem}
                    rNum4AnimationFrames={rNum4AnimationFrames}
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
