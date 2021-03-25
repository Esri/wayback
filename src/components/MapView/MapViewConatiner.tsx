import React, { useContext, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
    // isReferenceLayerVisibleSelector,
    mapExtentSelector,
    mapExtentUpdated,
} from '../../store/reducers/Map';

import {
    // activeWaybackItemSelector,
    releaseNum4ItemsWithLocalChangesUpdated,
    // previewWaybackItemSelector
} from '../../store/reducers/WaybackItems';

import MapView from './MapView';

import AppConfig from '../../app-config';
import { IExtentGeomety, IMapPointInfo } from '../../types';
import { getDefaultExtent } from '../../utils/LocalStorage';
import { AppContext } from '../../contexts/AppContextProvider';
import { saveMapExtentInURLQueryParam } from '../../utils/UrlSearchParam';

// wrap the MapView and it's children into this flex grow container,
// so it can adjust it's width depends on the visibility of swipe widget layers selector components on left and right side
const FlexGrowItemWapper: React.FC = ({ children }) => {
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

const MapViewConatiner: React.FC = ({ children }) => {
    const dispatch = useDispatch();

    const { waybackManager } = useContext(AppContext);

    // const activeWaybackItem = useSelector(activeWaybackItemSelector);

    // const isReferenceLayerVisible = useSelector(isReferenceLayerVisibleSelector);

    const mapExtent = useSelector(mapExtentSelector);

    const getInitialExtent = (): IExtentGeomety => {
        const defaultExtentFromLocalStorage = getDefaultExtent(); //getDefaultExtent();

        return (
            mapExtent ||
            defaultExtentFromLocalStorage ||
            AppConfig.defaultMapExtent
        );
    };

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

    useEffect(() => {
        saveMapExtentInURLQueryParam(mapExtent);
    }, [mapExtent]);

    return (
        <FlexGrowItemWapper>
            <MapView
                initialExtent={getInitialExtent()}
                onUpdateEnd={queryVersionsWithLocalChanges}
                onExtentChange={onExtentChange}
            >
                {children}
            </MapView>
        </FlexGrowItemWapper>
    );
};

export default MapViewConatiner;
