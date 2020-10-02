import * as React from 'react';
import { loadModules } from 'esri-loader';

import {
    IWaybackMetadataQueryResult,
    IScreenPoint,
    IWaybackItem,
} from '../../types';

import IMapView from 'esri/views/MapView';
import IWatchUtils from 'esri/core/watchUtils';
import IPoint from 'esri/geometry/Point';
import WaybackManager from '../../core/WaybackManager';

type Props = {
    waybackManager: WaybackManager
    activeWaybackItem: IWaybackItem;
    swipeWidgetLeadingLayer: IWaybackItem;
    swipeWidgetTrailingLayer: IWaybackItem;
    mapView?:IMapView,

    metadataOnChange: (data:IWaybackMetadataQueryResult)=>void;
    anchorPointOnChange: (data: IScreenPoint)=>void;
}

const MetadataQueryLayer:React.FC<Props> = ({
    waybackManager,
    activeWaybackItem,
    swipeWidgetLeadingLayer,
    swipeWidgetTrailingLayer,
    mapView,
    metadataOnChange,
    anchorPointOnChange
}) => {

    const anchorPointRef = React.useRef<IPoint>();
    const targetLayerRef= React.useRef<IWaybackItem>();

    const queryMetadata = async(mapPoint:IPoint)=>{

        if(!targetLayerRef.current){
            return;
        }

        try {
            anchorPointRef.current = mapPoint;

            const { releaseNum, releaseDateLabel } = targetLayerRef.current

            const res = await waybackManager.getMetadata({
                releaseNum,
                pointGeometry: mapPoint.toJSON(),
                zoom: mapView.zoom,
            });

            const metadata:IWaybackMetadataQueryResult = {
                ...res,
                releaseDate: releaseDateLabel
            }

            updateScreenPoint4PopupAnchor();

            metadataOnChange(metadata);

        } catch (err) {
            console.error(err);

        }
    }

    const updateScreenPoint4PopupAnchor = ()=>{

        if(!anchorPointRef.current){
            return;
        }

        const anchorScreenPoint = mapView.toScreen(anchorPointRef.current) 
        anchorPointOnChange(anchorScreenPoint);
    }

    const initMapViewEventHandlers = async()=>{

        try {
            type Modules = [typeof IWatchUtils];

            const [watchUtils] = await (loadModules([
                'esri/core/watchUtils',
            ]) as Promise<Modules>);

            mapView.on('click', (evt) => {
                console.log('view on click, should show popup', evt.mapPoint);
                queryMetadata(evt.mapPoint);
            });

            watchUtils.watch(mapView, 'zoom', () => {
                // console.log('view zoom is on updating, should hide the popup', zoom);
                metadataOnChange(null);
            });

            watchUtils.watch(mapView, 'center', () => {
                // console.log('view center is on updating, should update the popup position');
                // need to update the screen point for popup anchor since the map center has changed
                updateScreenPoint4PopupAnchor();
            });
        } catch (err) {
            console.error(err);
        }
    }

    React.useEffect(()=>{

        if(mapView){
            initMapViewEventHandlers()
        }

    }, [mapView])

    React.useEffect(()=>{

        targetLayerRef.current = activeWaybackItem;

    }, [
        activeWaybackItem, 
        swipeWidgetLeadingLayer,
        swipeWidgetTrailingLayer
    ]);

    return null
}

export default MetadataQueryLayer
