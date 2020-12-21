import React, {
    useContext,
    useEffect
} from 'react';

import {
    useSelector,
    useDispatch,
    batch
} from 'react-redux';

import {
    isReferenceLayerVisibleSelector,
    mapExtentSelector,
    mapExtentUpdated
} from '../../store/reducers/Map';

import {
    activeWaybackItemSelector,
    releaseNum4ItemsWithLocalChangesUpdated,
    // previewWaybackItemSelector
} from '../../store/reducers/WaybackItems';

import MapView from './MapView';
import ReferenceLayer from '../ReferenceLayer/ReferenceLayer';
import SearchWidget from '../SearchWidget/SearchWidget';
import WaybackLayer from '../WaybackLayer/WaybackLayer';
import TilePreviewWindow from '../PreviewWindow/PreviewWindowContainer';
import MetadataPopup from '../PopUp/MetadataPopupContainer';
import MetadataQueryTask from '../MetadataQueryTask/MetadataQueryTaskContainer';
import SwipeWidget from '../SwipeWidget/SwipeWidgetContainer';

import AppConfig from '../../app-config'
import { IExtentGeomety, IMapPointInfo } from '../../types';
import { getDefaultExtent } from '../../utils/LocalStorage';
import { AppContext } from '../../contexts/AppContextProvider';
import { saveMapExtentInURLQueryParam, saveReleaseNum4ActiveWaybackItemInURLQueryParam } from '../../utils/UrlSearchParam';

const MapViewConatiner = () => {

    const dispatch = useDispatch();

    const { waybackManager } = useContext(AppContext)

    const activeWaybackItem = useSelector(activeWaybackItemSelector);

    const isReferenceLayerVisible = useSelector(isReferenceLayerVisibleSelector);

    const mapExtentFromURL = useSelector(mapExtentSelector);

    const getInitialExtent = ():IExtentGeomety=>{

        const defaultExtentFromLocalStorage = getDefaultExtent() //getDefaultExtent();

        return (
            mapExtentFromURL || 
            defaultExtentFromLocalStorage || 
            AppConfig.defaultMapExtent 
        );
    };

    const queryVersionsWithLocalChanges = async(mapCenterPoint: IMapPointInfo)=>{
        try {
            const rNums = await waybackManager.getLocalChanges(mapCenterPoint);
            // console.log(rNums);
            dispatch(releaseNum4ItemsWithLocalChangesUpdated(rNums));
        } catch (err) {
            console.error('failed to query local changes', err);
        }
    };

    const onExtentChange = (extent:IExtentGeomety)=>{
        dispatch(mapExtentUpdated(extent));
        saveMapExtentInURLQueryParam(extent)
    }

    useEffect(() => {
        saveReleaseNum4ActiveWaybackItemInURLQueryParam(activeWaybackItem.releaseNum)
    }, [activeWaybackItem])

    return (
        <MapView
            initialExtent={getInitialExtent()}
            onUpdateEnd={queryVersionsWithLocalChanges}
            onExtentChange={onExtentChange}
        >
            <WaybackLayer 
                activeWaybackItem={activeWaybackItem}
            />

            <ReferenceLayer 
                isVisible={isReferenceLayerVisible}
            />

            <SearchWidget 
                position={'top-left'}
            />

            <TilePreviewWindow />

            <MetadataPopup />

            <MetadataQueryTask />

            <SwipeWidget />

        </MapView>
    )
}

export default MapViewConatiner
