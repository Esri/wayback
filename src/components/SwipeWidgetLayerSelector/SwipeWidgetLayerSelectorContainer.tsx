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

import React, { useContext } from 'react';

import { useAppDispatch, useAppSelector } from '@store/configureStore';
import { AppContext } from '@contexts/AppContextProvider';

import {
    releaseNum4ItemsWithLocalChangesSelector,
    allWaybackItemsSelector,
    releaseNum4ActiveWaybackItemUpdated,
} from '@store/Wayback/reducer';

import { metadataQueryResultUpdated } from '@store/Map/reducer';

import {
    swipeWidgetLeadingLayerSelector,
    swipeWidgetTrailingLayerSelector,
    releaseNum4LeadingLayerUpdated,
    releaseNum4TrailingLayerUpdated,
    isSwipeWidgetOpenSelector,
    toggleSwipeWidget,
} from '@store/Swipe/reducer';

import { IWaybackItem } from '@typings/index';

import SwipeWidgetLayerSelector, {
    SwipeWidgetLayer,
} from './SwipeWidgetLayerSelector';

type Props = {
    targetLayer: SwipeWidgetLayer;
};

const SwipeWidgetLayerSelectorContainer: React.FC<Props> = ({
    targetLayer,
}: Props) => {
    const dispatch = useAppDispatch();

    const { isMobile } = useContext(AppContext);

    const isSwipeWidgetOpen = useAppSelector(isSwipeWidgetOpenSelector);

    const waybackItems: IWaybackItem[] = useAppSelector(
        allWaybackItemsSelector
    );
    const rNum4WaybackItemsWithLocalChanges: number[] = useAppSelector(
        releaseNum4ItemsWithLocalChangesSelector
    );

    const leadingLayer: IWaybackItem = useAppSelector(
        swipeWidgetLeadingLayerSelector
    );
    const trailingLayer: IWaybackItem = useAppSelector(
        swipeWidgetTrailingLayerSelector
    );

    const closeBtnOnClick =
        targetLayer === 'trailing'
            ? () => {
                  dispatch(toggleSwipeWidget());
              }
            : null;

    return isSwipeWidgetOpen && !isMobile ? (
        <SwipeWidgetLayerSelector
            targetLayerType={targetLayer}
            waybackItems={waybackItems}
            rNum4WaybackItemsWithLocalChanges={
                rNum4WaybackItemsWithLocalChanges
            }
            selectedItem={
                targetLayer === 'leading' ? leadingLayer : trailingLayer
            }
            onSelect={(waybackItem) => {
                const { releaseNum } = waybackItem;

                dispatch(metadataQueryResultUpdated(null));

                if (targetLayer === 'leading') {
                    dispatch(releaseNum4LeadingLayerUpdated(releaseNum));
                    dispatch(releaseNum4ActiveWaybackItemUpdated(releaseNum));
                } else {
                    dispatch(releaseNum4TrailingLayerUpdated(releaseNum));
                }
            }}
            onClose={closeBtnOnClick}
        />
    ) : null;
};

export default SwipeWidgetLayerSelectorContainer;
