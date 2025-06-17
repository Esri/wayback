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

import { activeWaybackItemSelector } from '@store/Wayback/reducer';

import {
    isSwipeWidgetOpenSelector,
    swipePositionSelector,
    swipeWidgetLeadingLayerSelector,
    swipeWidgetTrailingLayerSelector,
} from '@store/Swipe/reducer';

import {
    metadataQueryResultUpdated,
    metadataPopupAnchorUpdated,
    isQueryingMetadataToggled,
    selectMapMode,
} from '@store/Map/reducer';

import MetadataQueryTask from './MetadataQueryTask';

// import IMapView from 'esri/views/MapView';
import MapView from '@arcgis/core/views/MapView';

type Props = {
    mapView?: MapView;
};

const MetadataQueryTaskContainer: React.FC<Props> = ({ mapView }: Props) => {
    const disptach = useAppDispatch();

    const activeWaybackItem = useAppSelector(activeWaybackItemSelector);

    const isSwipeWidgetOpen = useAppSelector(isSwipeWidgetOpenSelector);
    const swipeWidgetPosition = useAppSelector(swipePositionSelector);
    const swipeWidgetLeadingLayer = useAppSelector(
        swipeWidgetLeadingLayerSelector
    );
    const swipeWidgetTrailingLayer = useAppSelector(
        swipeWidgetTrailingLayerSelector
    );

    const mode = useAppSelector(selectMapMode);

    return (
        <MetadataQueryTask
            mapView={mapView}
            activeWaybackItem={activeWaybackItem}
            swipeWidgetLeadingLayer={swipeWidgetLeadingLayer}
            swipeWidgetTrailingLayer={swipeWidgetTrailingLayer}
            isSwipeWidgetOpen={isSwipeWidgetOpen}
            swipeWidgetPosition={swipeWidgetPosition}
            disabled={mode !== 'explore' && mode !== 'swipe'}
            metadataQueryOnStart={() => {
                disptach(isQueryingMetadataToggled(true));
            }}
            metadataOnChange={(metadata) => {
                // console.log(metadata)
                disptach(metadataQueryResultUpdated(metadata));
            }}
            anchorPointOnChange={(anchorPoint) => {
                // console.log(anchorPoint)
                disptach(metadataPopupAnchorUpdated(anchorPoint));
            }}
        />
    );
};

export default MetadataQueryTaskContainer;
