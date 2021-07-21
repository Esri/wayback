import React, {
    useEffect
} from 'react'

import { useSelector, useDispatch } from 'react-redux';

import {
    releaseNum4ItemsWithLocalChangesSelector,
    allWaybackItemsSelector,
    activeWaybackItemSelector
} from '../../store/reducers/WaybackItems';

import {
    rNum4AnimationFramesLoaded,
    rNum4AnimationFramesSelector
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

    const activeItem:IWaybackItem = useSelector(activeWaybackItemSelector)

    useEffect(()=>{
        dispatch(rNum4AnimationFramesLoaded(rNum4WaybackItemsWithLocalChanges))
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
            </div>

            <FramesSeletor 
                waybackItems={waybackItems}
                activeItem={activeItem}
                rNum4AnimationFrames={rNum4AnimationFrames}
            />
        </>
    )
}

export default AnimationControls
