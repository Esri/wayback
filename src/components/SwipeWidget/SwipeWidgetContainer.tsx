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
    isSwipeWidgetOpenSelector,
    swipeWidgetLeadingLayerSelector,
    swipeWidgetTrailingLayerSelector,
    swipePositionUpdated,
} from '@store/Swipe/reducer';

import { metadataQueryResultUpdated } from '@store/Map/reducer';

import SwipeWidget from './SwipeWidget';
// import IMapView from 'esri/views/MapView';
import MapView from '@arcgis/core/views/MapView';
import { IWaybackItem } from '@typings/index';
import { saveSwipeWidgetInfoToHashParams } from '@utils/urlParams';

type Props = {
    mapView?: MapView;
};

const SwipeWidgetContainer: React.FC<Props> = ({ mapView }: Props) => {
    const dispatch = useAppDispatch();

    const isOpen = useAppSelector(isSwipeWidgetOpenSelector);

    const waybackItem4LeadingLayer: IWaybackItem = useAppSelector(
        swipeWidgetLeadingLayerSelector
    );
    const waybackItem4TrailingLayer: IWaybackItem = useAppSelector(
        swipeWidgetTrailingLayerSelector
    );

    const positionOnChangeHandler = useCallback((position: number) => {
        dispatch(swipePositionUpdated(position));
        dispatch(metadataQueryResultUpdated(null));
    }, []);

    useEffect(() => {
        saveSwipeWidgetInfoToHashParams({
            isOpen,
            rNum4SwipeWidgetLeadingLayer: waybackItem4LeadingLayer.releaseNum,
            rNum4SwipeWidgetTrailingLayer: waybackItem4TrailingLayer.releaseNum,
        });
    }, [isOpen, waybackItem4LeadingLayer, waybackItem4TrailingLayer]);

    return (
        <SwipeWidget
            mapView={mapView}
            waybackItem4LeadingLayer={waybackItem4LeadingLayer}
            waybackItem4TrailingLayer={waybackItem4TrailingLayer}
            isOpen={isOpen}
            positionOnChange={positionOnChangeHandler}
        />
    );
};

export default SwipeWidgetContainer;
