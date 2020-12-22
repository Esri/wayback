import React, {
    useEffect
} from 'react'

import {
    useSelector,
} from 'react-redux';

import {
    activeWaybackItemSelector,
} from '../../store/reducers/WaybackItems';
import { saveReleaseNum4ActiveWaybackItemInURLQueryParam } from '../../utils/UrlSearchParam';

import WaybackLayer from './WaybackLayer';

import IMapView from 'esri/views/MapView';

type Props = {
    mapView?:IMapView
}

const WaybackLayerContainer:React.FC<Props> = ({
    mapView
}) => {

    const activeWaybackItem = useSelector(activeWaybackItemSelector);

    useEffect(() => {
        saveReleaseNum4ActiveWaybackItemInURLQueryParam(activeWaybackItem.releaseNum)
    }, [activeWaybackItem])

    return (
        <WaybackLayer 
            mapView={mapView}
            activeWaybackItem={activeWaybackItem}
        />
    )
}

export default WaybackLayerContainer
