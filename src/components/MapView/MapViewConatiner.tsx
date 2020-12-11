import React from 'react';

import {
    useSelector,
    useDispatch,
    batch
} from 'react-redux';

import {
    isReferenceLayerVisibleSelector
} from '../../store/reducers/Map';

import {
    activeWaybackItemSelector
} from '../../store/reducers/WaybackItems';

import MapView from './MapView';
import ReferenceLayer from '../ReferenceLayer/ReferenceLayer';
import SearchWidget from '../SearchWidget/SearchWidget';
import WaybackLayer from '../WaybackLayer/WaybackLayer';

import AppConfig from '../../app-config'
import { IExtentGeomety } from '../../types';

const MapViewConatiner = () => {

    const activeWaybackItem = useSelector(activeWaybackItemSelector);
    const isReferenceLayerVisible = useSelector(isReferenceLayerVisibleSelector);

    const getInitialExtent = ():IExtentGeomety=>{
        return AppConfig.defaultMapExtent
    }

    return (
        <MapView
            initialExtent={getInitialExtent()}
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

        </MapView>
    )
}

export default MapViewConatiner
