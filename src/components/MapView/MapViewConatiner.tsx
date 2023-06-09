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
import { AppContext } from '@contexts/AppContextProvider';
import {
    saveMapCenterToHashParams,
    saveMapExtentInURLQueryParam,
} from '@utils/UrlSearchParam';
import { batch } from 'react-redux';

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

    const { waybackManager } = useContext(AppContext);

    // const activeWaybackItem = useSelector(activeWaybackItemSelector);

    // const isReferenceLayerVisible = useSelector(isReferenceLayerVisibleSelector);

    const mapExtent = useSelector(mapExtentSelector);

    const { center, zoom } = useSelector(selectMapCenterAndZoom);

    const initialMapExtent = useMemo((): IExtentGeomety => {
        const defaultExtentFromLocalStorage = getDefaultExtent(); //getDefaultExtent();

        // console.log(mapExtent)

        return (
            mapExtent ||
            defaultExtentFromLocalStorage ||
            AppConfig.defaultMapExtent
        );
    }, []);

    const queryVersionsWithLocalChanges = async (
        mapCenterPoint: IMapPointInfo
    ) => {
        try {
            const rNums = await waybackManager.getLocalChanges(mapCenterPoint);
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
        if (center === null || zoom === null) {
            return;
        }

        saveMapCenterToHashParams(center, zoom);
    }, [center, zoom]);

    return (
        <FlexGrowItemWapper>
            <MapView
                initialExtent={initialMapExtent}
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
