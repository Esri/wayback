import '@arcgis/core/assets/esri/themes/light/main.css';
import React, { useEffect } from 'react';

// import { loadModules, loadCss } from 'esri-loader';
// import IMapView from 'esri/views/MapView';
// import IMap from 'esri/Map';
// import IWatchUtils from 'esri/core/watchUtils';
// import IWebMercatorUtils from 'esri/geometry/support/webMercatorUtils';
// import IExtent from 'esri/geometry/Extent';

import MapView from '@arcgis/core/views/MapView';
import EsriMap from '@arcgis/core/Map';
import { whenTrue } from '@arcgis/core/core/watchUtils';
import { webMercatorToGeographic } from '@arcgis/core/geometry/support/webMercatorUtils';
import Extent from '@arcgis/core/geometry/Extent';

import { IExtentGeomety, IMapPointInfo } from '../../types';

import { WAYBACK_LAYER_ID } from '../WaybackLayer/getWaybackLayer'
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
import LOD from '@arcgis/core/layers/support/LOD';

interface Props {
    initialExtent: IExtentGeomety;
    onUpdateEnd: (centerPoint: IMapPointInfo) => void;
    onExtentChange: (extent: IExtentGeomety) => void;
    children?: React.ReactNode;
}

const MapViewComponent: React.FC<Props> = ({
    initialExtent,
    onUpdateEnd,
    onExtentChange,
    children,
}: Props) => {
    const mapDivRef = React.useRef<HTMLDivElement>();

    const [mapView, setMapView] = React.useState<MapView>(null);

    const initMapView = () => {
        // type Modules = [typeof IMapView, typeof IMap, typeof IExtent];

        // try {
        //     const [MapView, Map, Extent] = await (loadModules([
        //         'esri/views/MapView',
        //         'esri/Map',
        //         'esri/geometry/Extent'
        //     ]) as Promise<Modules>);

        //     const view = new MapView({
        //         container: mapDivRef.current,
        //         map: new Map(),
        //         extent: new Extent({
        //             ...initialExtent
        //         })
        //     });

        //     setMapView(view);

        // } catch (err) {
        //     console.error(err);
        // }

        const view = new MapView({
            container: mapDivRef.current,
            map: new EsriMap(),
            extent: new Extent({
                ...initialExtent,
            }),
        });

        setMapView(view);
    };

    const initWatchUtils = async () => {
        // try {
        //     type Modules = [typeof IWatchUtils];

        //     const [watchUtils] = await (loadModules([
        //         'esri/core/watchUtils',
        //     ]) as Promise<Modules>);

        //     watchUtils.whenTrue(mapView, 'stationary', mapViewUpdateEndHandler);
        // } catch (err) {
        //     console.error(err);
        // }

        whenTrue(mapView, 'stationary', mapViewUpdateEndHandler);
    };

    const mapViewUpdateEndHandler = async () => {
        // try {
        //     type Modules = [typeof IWebMercatorUtils];

        //     const [webMercatorUtils] = await (loadModules([
        //         'esri/geometry/support/webMercatorUtils',
        //     ]) as Promise<Modules>);

        //     const center = mapView.center;

        //     if(!center){
        //         return;
        //     }

        //     const extent = webMercatorUtils.webMercatorToGeographic(
        //         mapView.extent
        //     );

        //     // console.log('mapview update ended', center);

        //     const mapViewCenterPointInfo: IMapPointInfo = {
        //         latitude: center.latitude,
        //         longitude: center.longitude,
        //         zoom: mapView.zoom,
        //         geometry: center.toJSON(),
        //     };

        //     onUpdateEnd(mapViewCenterPointInfo);

        //     onExtentChange(extent.toJSON());

        // } catch (err) {
        //     console.error(err);
        // }

        const center = mapView.center;

        if (!center) {
            return;
        }

        const extent = webMercatorToGeographic(mapView.extent);

        // console.log('mapview update ended', center);

        const mapViewCenterPointInfo: IMapPointInfo = {
            latitude: center.latitude,
            longitude: center.longitude,
            zoom: getCurrZoomLevel(),
            geometry: center.toJSON(),
        };

        onUpdateEnd(mapViewCenterPointInfo);

        onExtentChange(extent.toJSON());
    };

    // calculate current zoom level using current map scale and tile infos from Wayback WMTS layer
    const getCurrZoomLevel = ():number =>{

        const mapScale = mapView.scale;

        // get active sublayer from wayback WMTS layer
        const { activeLayer } = mapView.map.findLayerById(WAYBACK_LAYER_ID) as WMTSLayer;

        // A TileLayer has a number of LODs (Levels of Detail). 
        // Each LOD corresponds to a map at a given scale or resolution.
        const LODS = activeLayer.tileMatrixSets.getItemAt(0).tileInfo.lods as LOD[];

        for(let LOD of LODS){
            const { level, scale } = LOD;

            if(scale < (mapScale * Math.sqrt(2)) && scale > (mapScale / Math.sqrt(2))){
                return level;
            }
        }

        return -1;
    }

    useEffect(() => {
        // loadCss();
        initMapView();
    }, []);

    useEffect(() => {
        if (mapView) {
            initWatchUtils();
        }
    }, [mapView]);

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
                ref={mapDivRef}
            ></div>

            {mapView
                ? React.Children.map(children, (child) => {
                      return React.cloneElement(
                          child as React.ReactElement<any>,
                          {
                              mapView,
                          }
                      );
                  })
                : null}
        </>
    );
};

export default MapViewComponent;
