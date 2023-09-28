import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    allWaybackItemsSelector,
    activeWaybackItemSelector,
    releaseNum4ItemsWithLocalChangesSelector,
    setActiveWaybackItem,
    setPreviewWaybackItem,
} from '@store/Wayback/reducer';

import {
    shouldOnlyShowItemsWithLocalChangeSelector,
    // shouldShowPreviewItemTitleToggled
} from '@store/UI/reducer';

import BarChart from './index';
import { IWaybackItem } from '@typings/index';

import { MobileHide } from '../MobileVisibility';

const BarChartContainer: React.FC = () => {
    const dispatch = useDispatch();

    const waybackItems: IWaybackItem[] = useSelector(allWaybackItemsSelector);

    const activeWaybackItem: IWaybackItem = useSelector(
        activeWaybackItemSelector
    );

    const rNum4WaybackItemsWithLocalChanges: number[] = useSelector(
        releaseNum4ItemsWithLocalChangesSelector
    );

    const shouldOnlyShowItemsWithLocalChange: boolean = useSelector(
        shouldOnlyShowItemsWithLocalChangeSelector
    );

    const onClickHandler = (releaseNum: number) => {
        dispatch(setActiveWaybackItem(releaseNum));
    };

    const onMouseEnterHandler = (releaseNum: number) => {
        dispatch(setPreviewWaybackItem(releaseNum, true));
    };

    const onMouseOutHandler = () => {
        dispatch(setPreviewWaybackItem());
    };

    return (
        <MobileHide>
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
        </MobileHide>
    );
};

export default BarChartContainer;
