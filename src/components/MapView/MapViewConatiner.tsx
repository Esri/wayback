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
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@store/configureStore';

import {
    isMapUpdatingToggled,
    // mapCenterUpdated,
    // isReferenceLayerVisibleSelector,
    mapExtentSelector,
    mapExtentUpdated,
    selectMapCenterAndZoom,
    selectMapMode,
    // zoomUpdated,
    mapCenterAndZoomUpdated,
} from '@store/Map/reducer';

// import {
//     isLoadingWaybackItemsToggled,
//     // activeWaybackItemSelector,
//     releaseNum4ItemsWithLocalChangesUpdated,
//     // previewWaybackItemSelector
// } from '@store/Wayback/reducer';

import MapView from './MapView';

// import AppConfig from '../../app-config';
import { IExtentGeomety, IMapPointInfo } from '@typings/index';
// import { getDefaultExtent } from '@utils/LocalStorage';
import { saveMapCenterToHashParams } from '@utils/urlParams';
// import { getWaybackItemsWithLocalChanges } from '@esri/wayback-core';
import {
    // isAnimationModeOnSelector,
    selectAnimationStatus,
    // selectAnimationStatus,
} from '@store/AnimationMode/reducer';
import { queryLocalChanges } from '@store/Wayback/thunks';
// import { Point } from '@arcgis/core/geometry';
import { MapActionButtonGroup } from './MapActionButtonGroup';

type Props = {
    children?: React.ReactNode;
};

const MapViewConatiner: React.FC<Props> = ({ children }) => {
    const dispatch = useAppDispatch();

    const mapExtent = useAppSelector(mapExtentSelector);

    const animationStatus = useAppSelector(selectAnimationStatus);

    const { center, zoom } = useAppSelector(selectMapCenterAndZoom) || {};

    // still need to use default map extent as some old urls may still have it
    const defaultMapExtent = useMemo((): IExtentGeomety => {
        // no need to use default map extent if center and zoom are already defined
        if (center && zoom) {
            return null;
        }

        return mapExtent;
    }, []);

    // const [queryLocation, setQueryLocation] = useState<IMapPointInfo>(null);

    const appMode = useAppSelector(selectMapMode);

    useEffect(() => {
        if (!center || !zoom) {
            return;
        }

        if (
            appMode === 'updates' ||
            appMode === 'wayport' ||
            appMode === 'save-webmap'
        ) {
            return;
        }

        const { lat, lon } = center;

        dispatch(
            queryLocalChanges({
                longitude: lon,
                latitude: lat,
                zoom,
            })
        );
    }, [center, zoom, appMode]);

    useEffect(() => {
        if (!center || !zoom) {
            return;
        }

        saveMapCenterToHashParams(center, zoom);
    }, [center, zoom]);

    useEffect(() => {
        // adding this class will hide map zoom widget when animation is playing or loading
        document.body.classList.toggle(
            'hide-map-control',
            animationStatus !== null
        );
    }, [animationStatus]);

    return (
        <div className="relative shrink-0 grow bg-black">
            <MapView
                initialExtent={defaultMapExtent}
                center={center}
                zoom={zoom}
                onStationary={({ mapCenterPointInfo, mapExtent }) => {
                    // queryVersionsWithLocalChanges(mapCenterPoint);
                    // setQueryLocation(mapCenterPointInfo);

                    // dispatch(
                    //     mapCenterUpdated({
                    //         lon: mapCenterPointInfo.longitude,
                    //         lat: mapCenterPointInfo.latitude,
                    //     })
                    // );

                    // dispatch(zoomUpdated(mapCenterPointInfo.zoom));

                    dispatch(
                        mapCenterAndZoomUpdated({
                            center: {
                                lon: mapCenterPointInfo.longitude,
                                lat: mapCenterPointInfo.latitude,
                            },
                            zoom: mapCenterPointInfo.zoom,
                        })
                    );

                    dispatch(mapExtentUpdated(mapExtent));

                    // set is map updating to false when map is stationary, after map center, zoom and extent are updated.
                    dispatch(isMapUpdatingToggled(false));
                }}
                // onExtentChange={onExtentChange}
                onUpdating={(isUpdating: boolean) => {
                    // no need to do anything when isUpdating is false,
                    // as it will be handled in onStationary event where we will update the map center, zoom and extent, and also query local changes based on the new map center and zoom.
                    if (!isUpdating) {
                        return;
                    }

                    dispatch(isMapUpdatingToggled(true));
                }}
            >
                {children}

                <MapActionButtonGroup />
            </MapView>
        </div>
    );
};

export default MapViewConatiner;
