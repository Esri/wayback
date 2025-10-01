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
// import { loadModules } from 'esri-loader';

import {
    IWaybackMetadataQueryResult,
    IScreenPoint,
    IWaybackItem,
} from '@typings/index';

// import WaybackManager from '../../services/wayback';

import MapView from '@arcgis/core/views/MapView';
import { watch } from '@arcgis/core/core/reactiveUtils';
import Point from '@arcgis/core/geometry/Point';
import { getMetadata } from '@esri/wayback-core';

type Props = {
    // waybackManager: WaybackManager;
    activeWaybackItem: IWaybackItem;
    swipeWidgetLeadingLayer: IWaybackItem;
    swipeWidgetTrailingLayer: IWaybackItem;
    isSwipeWidgetOpen: boolean;
    swipeWidgetPosition: number;
    mapView?: MapView;
    /**
     * if true, the metadata query task is disabled
     */
    disabled: boolean;
    metadataQueryOnStart: () => void;
    metadataOnChange: (data: IWaybackMetadataQueryResult) => void;
    anchorPointOnChange: (data: IScreenPoint) => void;
};

const MetadataQueryLayer: React.FC<Props> = ({
    // waybackManager,
    activeWaybackItem,
    swipeWidgetLeadingLayer,
    swipeWidgetTrailingLayer,
    isSwipeWidgetOpen,
    swipeWidgetPosition,
    mapView,
    disabled,
    metadataQueryOnStart,
    metadataOnChange,
    anchorPointOnChange,
}) => {
    const anchorPointRef = React.useRef<Point>(null);

    const activeWaybackItemRef = React.useRef<IWaybackItem>(null);
    const swipeWidgetLeadingLayerRef = React.useRef<IWaybackItem>(null);
    const swipeWidgetTrailingLayerRef = React.useRef<IWaybackItem>(null);
    const isSwipeWidgetOpenRef = React.useRef<boolean>(null);
    const swipeWidgetPositionRef = React.useRef<number>(null);

    const disabledRef = React.useRef<boolean>(null);

    const getTargetWaybackItem = (mapPoint: Point): IWaybackItem => {
        if (!isSwipeWidgetOpenRef.current) {
            return activeWaybackItemRef.current;
        }

        const anchorScreenPoint = mapView.toScreen(mapPoint);
        const swipePositionX =
            (swipeWidgetPositionRef.current / 100) * mapView.width;

        return anchorScreenPoint.x <= swipePositionX
            ? swipeWidgetLeadingLayerRef.current
            : swipeWidgetTrailingLayerRef.current;
    };

    const queryMetadata = async (mapPoint: Point) => {
        if (disabledRef.current !== null && disabledRef.current === true) {
            return;
        }

        try {
            anchorPointRef.current = mapPoint;

            const { releaseNum, releaseDateLabel } =
                getTargetWaybackItem(mapPoint);

            // const res = await waybackManager.getMetadata({
            //     releaseNum,
            //     pointGeometry: mapPoint.toJSON(),
            //     zoom: mapView.zoom, // getCurrZoomLevel(mapView)
            // });

            updateScreenPoint4PopupAnchor();

            metadataQueryOnStart();

            const queryLocation = {
                latitude: mapPoint.latitude,
                longitude: mapPoint.longitude,
            };

            const res = await getMetadata(
                queryLocation,
                mapView.zoom, // getCurrZoomLevel(mapView)
                releaseNum
            );
            // console.log(res);

            const metadata: IWaybackMetadataQueryResult = res
                ? {
                      ...res,
                      releaseDate: releaseDateLabel,
                      queryLocation,
                  }
                : null;

            metadataOnChange(metadata);
        } catch (err) {
            console.error(err);
            metadataOnChange(null);
        }
    };

    const updateScreenPoint4PopupAnchor = () => {
        if (!anchorPointRef.current) {
            return;
        }

        const anchorScreenPoint = mapView.toScreen(anchorPointRef.current);
        anchorPointOnChange(anchorScreenPoint);
    };

    const initMapViewEventHandlers = () => {
        mapView.on('click', (evt) => {
            console.log('view on click, should show popup', evt.mapPoint);
            queryMetadata(evt.mapPoint);
        });

        // watch(mapView, 'zoom', () => {
        //     // console.log('view zoom is on updating, should hide the popup', zoom);
        //     metadataOnChange(null);
        // });

        watch(
            () => mapView.zoom,
            () => {
                metadataOnChange(null);
            }
        );

        // watch(mapView, 'center', () => {
        //     // // console.log('view center is on updating, should update the popup position');
        //     // // need to update the screen point for popup anchor since the map center has changed
        //     // updateScreenPoint4PopupAnchor();
        //     metadataOnChange(null);
        // });

        watch(
            () => mapView.center,
            () => {
                metadataOnChange(null);
            }
        );
    };

    React.useEffect(() => {
        if (mapView) {
            initMapViewEventHandlers();
        }
    }, [mapView]);

    React.useEffect(() => {
        activeWaybackItemRef.current = activeWaybackItem;
    }, [activeWaybackItem]);

    React.useEffect(() => {
        swipeWidgetLeadingLayerRef.current = swipeWidgetLeadingLayer;
    }, [swipeWidgetLeadingLayer]);

    React.useEffect(() => {
        swipeWidgetTrailingLayerRef.current = swipeWidgetTrailingLayer;
    }, [swipeWidgetTrailingLayer]);

    React.useEffect(() => {
        isSwipeWidgetOpenRef.current = isSwipeWidgetOpen;
    }, [isSwipeWidgetOpen]);

    React.useEffect(() => {
        swipeWidgetPositionRef.current = swipeWidgetPosition;
    }, [swipeWidgetPosition]);

    React.useEffect(() => {
        disabledRef.current = disabled;
    }, [disabled]);

    return null;
};

export default MetadataQueryLayer;
