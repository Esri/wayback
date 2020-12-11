import React, {
    useEffect
} from 'react';
import {
    useSelector,
    useDispatch,
    batch
} from 'react-redux';

import {
    allWaybackItemsSelector,
    activeWaybackItemSelector,
    releaseNum4ItemsWithLocalChangesSelector,
    setActiveWaybackItem,
    setPreviewWaybackItem
} from '../../store/reducers/WaybackItems';

import {
    shouldOnlyShowItemsWithLocalChangeSelector,
    // shouldShowPreviewItemTitleToggled
} from '../../store/reducers/UI';

import BarChart from './index';
import { IWaybackItem } from '../../types';

const BarChartContainer:React.FC = () => {

    const dispatch = useDispatch();

    const waybackItems: IWaybackItem[] = useSelector(allWaybackItemsSelector);

    const activeWaybackItem: IWaybackItem = useSelector(activeWaybackItemSelector);
    
    const rNum4WaybackItemsWithLocalChanges: number[] = useSelector(releaseNum4ItemsWithLocalChangesSelector);

    const shouldOnlyShowItemsWithLocalChange: boolean = useSelector(shouldOnlyShowItemsWithLocalChangeSelector);

    const onClickHandler = (releaseNum: number)=>{
        dispatch(setActiveWaybackItem(releaseNum));
    }

    const onMouseEnterHandler = (        
        releaseNum: number
    )=>{
        dispatch(setPreviewWaybackItem(releaseNum));
    }

    const onMouseOutHandler = ()=>{
        dispatch(setPreviewWaybackItem());
    }

    return (
        <BarChart
            waybackItems={waybackItems}
            activeWaybackItem={activeWaybackItem}
            rNum4WaybackItemsWithLocalChanges={
                rNum4WaybackItemsWithLocalChanges
            }
            shouldOnlyShowItemsWithLocalChange={
                shouldOnlyShowItemsWithLocalChange
            }
            onClick={onClickHandler}
            onMouseEnter={onMouseEnterHandler}
            onMouseOut={onMouseOutHandler}
        />
    )
}

export default BarChartContainer
