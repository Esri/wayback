import React from 'react'

import {
    useSelector,
    useDispatch,
    batch
} from 'react-redux';

import {
    isReferenceLayerVisibleSelector,
} from '../../store/reducers/Map';

import IMapView from 'esri/views/MapView';

import ReferenceLayer from './ReferenceLayer';

type Props = {
    mapView?:IMapView
}

const ReferenceLayerContainer:React.FC<Props> = ({
    mapView
}) => {
    const isReferenceLayerVisible = useSelector(isReferenceLayerVisibleSelector);

    return (
        <ReferenceLayer 
            mapView={mapView}
            isVisible={isReferenceLayerVisible}
        />
    )
}

export default ReferenceLayerContainer
