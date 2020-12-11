import React, {
    useEffect, useRef
} from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IWebTileLayer from 'esri/layers/WebTileLayer';
import { IWaybackItem } from '../../types';

type Props = {
    activeWaybackItem: IWaybackItem;
    mapView?: IMapView;
}

const WaybackLayer:React.FC<Props> = ({
    activeWaybackItem,
    mapView
}) => {

    const waybackLayerRef = useRef<IWebTileLayer>();

    const updateWaybackLayer = async()=> {

        if (waybackLayerRef.current) {
            mapView.map.remove(waybackLayerRef.current);
        }

        waybackLayerRef.current = await getWaybackLayer();

        // always add as the bottom most layer
        mapView.map.add(waybackLayerRef.current, 0);
    }

    const getWaybackLayer = async()=>{

        try {
            type Modules = [typeof IWebTileLayer];

            const [WebTileLayer] = await (loadModules([
                'esri/layers/WebTileLayer',
            ]) as Promise<Modules>);

            const waybackLayer = new WebTileLayer({
                urlTemplate: activeWaybackItem.itemURL,
            });

            return waybackLayer;

        } catch (err) {
            console.error(err)
            return null;
        }
    }

    useEffect(()=>{
        if(mapView && activeWaybackItem){
            updateWaybackLayer()
        }
    }, [mapView, activeWaybackItem])

    return null;
}

export default WaybackLayer
