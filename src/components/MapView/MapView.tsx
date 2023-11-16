import React, { useEffect, useRef } from 'react';

import MapView from '@arcgis/core/views/MapView';
import EsriMap from '@arcgis/core/Map';
import { when } from '@arcgis/core/core/reactiveUtils';
import { webMercatorToGeographic } from '@arcgis/core/geometry/support/webMercatorUtils';
import Extent from '@arcgis/core/geometry/Extent';
import TileInfo from '@arcgis/core/layers/support/TileInfo';

import { IExtentGeomety, IMapPointInfo } from '@typings/index';
import { MapCenter } from '@store/Map/reducer';

// import { WAYBACK_LAYER_ID } from '../WaybackLayer/getWaybackLayer'
// import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
// import LOD from '@arcgis/core/layers/support/LOD';

interface Props {
    initialExtent: IExtentGeomety;
    /**
     * Coordinate pair `{longitude, latitude}` that represent the default center of the map view
     */
    center?: MapCenter;
    /**
     * deafult zoom level
     */
    zoom?: number;
    onUpdateEnd: (centerPoint: IMapPointInfo) => void;
    onExtentChange: (extent: IExtentGeomety) => void;
    children?: React.ReactNode;
}

const MapViewComponent: React.FC<Props> = ({
    initialExtent,
    center,
    zoom,
    onUpdateEnd,
    onExtentChange,
    children,
}: Props) => {
    // const stringifiedMapExtentRef = useRef<string>();

    const mapDivRef = React.useRef<HTMLDivElement>();

    const [mapView, setMapView] = React.useState<MapView>(null);

    const initMapView = () => {
        const extent = initialExtent
            ? new Extent({
                  ...initialExtent,
              })
            : null;

        const view = new MapView({
            container: mapDivRef.current,
            map: new EsriMap(),
            extent,
            center: center ? [center.lon, center.lat] : null,
            zoom,
            constraints: {
                /**
                 * The MapView's constraints.effectiveLODs will be null if the following statements are true
                 * - The map doesn't have a basemap, or
                 * - the basemap does not have a TileInfo,
                 * - AND the first layer added to the map does not have a TileInfo.
                 *
                 * If the effectiveLODs are null, it is not possible to set zoom on the MapView because the conversion is not possible.
                 * The zoom value will be -1 in this case. Setting scale will work.
                 * To address this, the MapView's constraints.lods can be defined at the time of its initialization by calling `TileInfo.create().lods`.
                 * @see https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html
                 */
                lods: TileInfo.create().lods,
                rotationEnabled: false,
            },
        });

        view.ui.remove(['zoom']);

        setMapView(view);

        view.when(() => {
            initEventHandlers(view);
        });
    };

    const initEventHandlers = async (view: MapView) => {
        // whenTrue(mapView, 'stationary', mapViewUpdateEndHandler);
        when(
            () => view.stationary === true,
            () => {
                const center = view?.center;

                if (!center) {
                    return;
                }

                const extent = webMercatorToGeographic(view.extent);

                // console.log('mapview update ended', center);

                const mapViewCenterPointInfo: IMapPointInfo = {
                    latitude: center.latitude,
                    longitude: center.longitude,
                    zoom: view.zoom, //getCurrZoomLevel(mapView),
                    geometry: center.toJSON(),
                };

                onUpdateEnd(mapViewCenterPointInfo);

                onExtentChange(extent.toJSON());
            }
        );
    };

    // const mapViewUpdateEndHandler = async () => {
    //     const center = mapView.center;

    //     if (!center) {
    //         return;
    //     }

    //     const extent = webMercatorToGeographic(mapView.extent);

    //     // console.log('mapview update ended', center);

    //     const mapViewCenterPointInfo: IMapPointInfo = {
    //         latitude: center.latitude,
    //         longitude: center.longitude,
    //         zoom: mapView.zoom, //getCurrZoomLevel(mapView),
    //         geometry: center.toJSON(),
    //     };

    //     onUpdateEnd(mapViewCenterPointInfo);

    //     onExtentChange(extent.toJSON());
    // };

    useEffect(() => {
        // loadCss();
        initMapView();
    }, []);

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

// // calculate current zoom level using current map scale and tile infos from Wayback WMTS layer
// export const getCurrZoomLevel = (mapView:MapView):number =>{

//     const mapScale = mapView.scale;

//     // get active sublayer from wayback WMTS layer
//     const { activeLayer } = mapView.map.findLayerById(WAYBACK_LAYER_ID) as WMTSLayer;

//     // A TileLayer has a number of LODs (Levels of Detail).
//     // Each LOD corresponds to a map at a given scale or resolution.
//     const LODS = activeLayer.tileMatrixSets.getItemAt(0).tileInfo.lods as LOD[];

//     for(let LOD of LODS){
//         const { level, scale } = LOD;

//         if(scale < (mapScale * Math.sqrt(2)) && scale > (mapScale / Math.sqrt(2))){
//             return level;
//         }
//     }

//     return -1;
// }

export default MapViewComponent;
