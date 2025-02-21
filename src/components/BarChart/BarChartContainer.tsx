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

import React from 'react';
import { useAppDispatch, useAppSelector } from '@store/configureStore';

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

// import { MobileHide } from '../MobileVisibility';

const BarChartContainer: React.FC = () => {
    const dispatch = useAppDispatch();

    const waybackItems: IWaybackItem[] = useAppSelector(
        allWaybackItemsSelector
    );

    const activeWaybackItem: IWaybackItem = useAppSelector(
        activeWaybackItemSelector
    );

    const rNum4WaybackItemsWithLocalChanges: number[] = useAppSelector(
        releaseNum4ItemsWithLocalChangesSelector
    );

    const shouldOnlyShowItemsWithLocalChange: boolean = useAppSelector(
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
        <div className="hidden md:block">
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
        </div>
    );
};

export default BarChartContainer;
