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
