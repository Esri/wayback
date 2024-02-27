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

import { useSelector, useDispatch } from 'react-redux';

import {
    mapCenterUpdated,
    // isReferenceLayerVisibleSelector,
    mapExtentSelector,
    mapExtentUpdated,
    selectMapCenterAndZoom,
    zoomUpdated,
} from '@store/Map/reducer';

import {
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

type Props = {
    children?: React.ReactNode;
};

type FlexGrowItemWapperProps = {
    children?: React.ReactNode;
};

// wrap the MapView and it's children into this flex grow container,
// so it can adjust it's width depends on the visibility of swipe widget layers selector components on left and right side
const FlexGrowItemWapper: React.FC<FlexGrowItemWapperProps> = ({
    children,
}) => {
    return (
        <div
            style={{
                position: 'relative',
                flexGrow: 1,
                flexShrink: 0,
            }}
        >
            {children}
        </div>
    );
};

const MapViewConatiner: React.FC<Props> = ({ children }) => {
    const dispatch = useDispatch();

    const mapExtent = useSelector(mapExtentSelector);

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const { center, zoom } = useSelector(selectMapCenterAndZoom);

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
            const waybackItems = await getWaybackItemsWithLocalChanges(
                {
                    longitude: mapCenterPoint.longitude,
                    latitude: mapCenterPoint.latitude,
                },
                mapCenterPoint.zoom
            );
            console.log(waybackItems);

            const rNums = waybackItems.map((d) => d.releaseNum);

            // console.log(rNums);
            dispatch(releaseNum4ItemsWithLocalChangesUpdated(rNums));
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
        <FlexGrowItemWapper>
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
        </FlexGrowItemWapper>
    );
};

export default MapViewConatiner;
