import React, {
    useEffect
} from 'react';

import { loadModules, loadCss } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IMap from 'esri/Map';
import IWatchUtils from 'esri/core/watchUtils';
import IWebMercatorUtils from 'esri/geometry/support/webMercatorUtils';
import IExtent from 'esri/geometry/Extent';
import { IExtentGeomety, IMapPointInfo } from '../../types';

interface Props {
    initialExtent: IExtentGeomety;
    onUpdateEnd: (centerPoint: IMapPointInfo) => void;
    onExtentChange: (extent: IExtentGeomety) => void;
    children?: React.ReactNode;
}

const MapView: React.FC<Props> = ({ 
    initialExtent,
    onUpdateEnd,
    onExtentChange,
    children 
}: Props) => {

    const mapDivRef = React.useRef<HTMLDivElement>();

    const [mapView, setMapView] = React.useState<IMapView>(null);

    const initMapView = async () => {
        type Modules = [typeof IMapView, typeof IMap, typeof IExtent];

        try {
            const [MapView, Map, Extent] = await (loadModules([
                'esri/views/MapView',
                'esri/Map',
                'esri/geometry/Extent'
            ]) as Promise<Modules>);

            const view = new MapView({
                container: mapDivRef.current,
                map: new Map(),
                extent: new Extent({
                    ...initialExtent
                })
            });

            setMapView(view);

        } catch (err) {
            console.error(err);
        }
    };

    const initWatchUtils = async()=>{
        try {
            type Modules = [typeof IWatchUtils];

            const [watchUtils] = await (loadModules([
                'esri/core/watchUtils',
            ]) as Promise<Modules>);

            watchUtils.whenTrue(mapView, 'stationary', mapViewUpdateEndHandler);
        } catch (err) {
            console.error(err);
        }
    }

    const mapViewUpdateEndHandler = async()=>{

        try {
            type Modules = [typeof IWebMercatorUtils];

            const [webMercatorUtils] = await (loadModules([
                'esri/geometry/support/webMercatorUtils',
            ]) as Promise<Modules>);

            const center = mapView.center;

            const extent = webMercatorUtils.webMercatorToGeographic(
                mapView.extent
            );

            // console.log('mapview update ended', center);

            const mapViewCenterPointInfo: IMapPointInfo = {
                latitude: center.latitude,
                longitude: center.longitude,
                zoom: mapView.zoom,
                geometry: center.toJSON(),
            };

            onUpdateEnd(mapViewCenterPointInfo);

            onExtentChange(extent.toJSON());

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadCss();
        initMapView();
    }, []);

    useEffect(() => {
        if(mapView){
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

export default MapView;