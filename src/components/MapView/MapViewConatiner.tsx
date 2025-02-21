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
import './CustomMapViewStyle.css';
import React, { useContext, useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@store/configureStore';

import {
    mapCenterUpdated,
    // isReferenceLayerVisibleSelector,
    mapExtentSelector,
    mapExtentUpdated,
    selectMapCenterAndZoom,
    zoomUpdated,
} from '@store/Map/reducer';

import {
    isLoadingWaybackItemsToggled,
    // activeWaybackItemSelector,
    releaseNum4ItemsWithLocalChangesUpdated,
    // previewWaybackItemSelector
} from '@store/Wayback/reducer';

import MapView from './MapView';

import AppConfig from '../../app-config';
import { IExtentGeomety, IMapPointInfo } from '@typings/index';
import { getDefaultExtent } from '@utils/LocalStorage';
import {
    saveMapCenterToHashParams,
    saveMapExtentInURLQueryParam,
} from '@utils/UrlSearchParam';
import { batch } from 'react-redux';
import { getWaybackItemsWithLocalChanges } from '@vannizhang/wayback-core';
import {
    isAnimationModeOnSelector,
    selectAnimationStatus,
} from '@store/AnimationMode/reducer';
import { queryLocalChanges } from '@store/Wayback/thunks';
import { Point } from '@arcgis/core/geometry';

type Props = {
    children?: React.ReactNode;
};

const MapViewConatiner: React.FC<Props> = ({ children }) => {
    const dispatch = useAppDispatch();

    const mapExtent = useAppSelector(mapExtentSelector);

    const isAnimationModeOn = useAppSelector(isAnimationModeOnSelector);

    const { center, zoom } = useAppSelector(selectMapCenterAndZoom);

    const defaultMapExtent = useMemo((): IExtentGeomety => {
        // no need to use default map extent if center and zoom are already defined
        if (center && zoom) {
            return null;
        }

        return mapExtent || getDefaultExtent() || AppConfig.defaultMapExtent;
    }, []);

    const queryVersionsWithLocalChanges = async (
        mapCenterPoint: IMapPointInfo
    ) => {
        try {
            const { longitude, latitude, zoom } = mapCenterPoint;

            const point = new Point({
                longitude,
                latitude,
            });

            dispatch(queryLocalChanges(point, zoom));
        } catch (err) {
            console.error('failed to query local changes', err);
        }
    };

    const onExtentChange = (extent: IExtentGeomety) => {
        dispatch(mapExtentUpdated(extent));
    };

    // useEffect(() => {
    //     saveMapExtentInURLQueryParam(mapExtent);
    // }, [mapExtent]);

    useEffect(() => {
        if (!center || !zoom) {
            return;
        }

        saveMapCenterToHashParams(center, zoom);
    }, [center, zoom]);

    useEffect(() => {
        // adding this class will hide map zoom widget when animation mode is on
        document.body.classList.toggle('hide-map-control', isAnimationModeOn);
    }, [isAnimationModeOn]);

    return (
        <div className=" relative shrink-0 grow">
            <MapView
                initialExtent={defaultMapExtent}
                center={center}
                zoom={zoom}
                onUpdateEnd={(mapCenterPoint: IMapPointInfo) => {
                    queryVersionsWithLocalChanges(mapCenterPoint);

                    batch(() => {
                        dispatch(
                            mapCenterUpdated({
                                lon: mapCenterPoint.longitude,
                                lat: mapCenterPoint.latitude,
                            })
                        );
                        dispatch(zoomUpdated(mapCenterPoint.zoom));
                    });
                }}
                onExtentChange={onExtentChange}
            >
                {children}
            </MapView>
        </div>
    );
};

export default MapViewConatiner;
