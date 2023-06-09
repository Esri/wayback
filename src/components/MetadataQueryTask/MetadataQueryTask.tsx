import React from 'react';
// import { loadModules } from 'esri-loader';

import {
    IWaybackMetadataQueryResult,
    IScreenPoint,
    IWaybackItem,
} from '@typings/index';

// import IMapView from 'esri/views/MapView';
// import IWatchUtils from 'esri/core/watchUtils';
// import IPoint from 'esri/geometry/Point';
import WaybackManager from '../../core/wayback';

import MapView from '@arcgis/core/views/MapView';
import { watch } from '@arcgis/core/core/watchUtils';
import Point from '@arcgis/core/geometry/Point';
// import { getCurrZoomLevel } from '../MapView/MapView';

type Props = {
    waybackManager: WaybackManager;
    activeWaybackItem: IWaybackItem;
    swipeWidgetLeadingLayer: IWaybackItem;
    swipeWidgetTrailingLayer: IWaybackItem;
    isSwipeWidgetOpen: boolean;
    swipeWidgetPosition: number;
    mapView?: MapView;

    metadataOnChange: (data: IWaybackMetadataQueryResult) => void;
    anchorPointOnChange: (data: IScreenPoint) => void;
};

const MetadataQueryLayer: React.FC<Props> = ({
    waybackManager,
    activeWaybackItem,
    swipeWidgetLeadingLayer,
    swipeWidgetTrailingLayer,
    isSwipeWidgetOpen,
    swipeWidgetPosition,
    mapView,
    metadataOnChange,
    anchorPointOnChange,
}) => {
    const anchorPointRef = React.useRef<Point>();

    const activeWaybackItemRef = React.useRef<IWaybackItem>();
    const swipeWidgetLeadingLayerRef = React.useRef<IWaybackItem>();
    const swipeWidgetTrailingLayerRef = React.useRef<IWaybackItem>();
    const isSwipeWidgetOpenRef = React.useRef<boolean>();
    const swipeWidgetPositionRef = React.useRef<number>();

    const getTargetWaybackItem = (mapPoint: Point): IWaybackItem => {
        if (!isSwipeWidgetOpenRef.current) {
            return activeWaybackItemRef.current;
        }

        const anchorScreenPoint = mapView.toScreen(mapPoint);
        const swipePositionX =
            (swipeWidgetPositionRef.current / 100) * mapView.width;

        return anchorScreenPoint.x <= swipePositionX
            ? swipeWidgetLeadingLayerRef.current
            : swipeWidgetTrailingLayerRef.current;
    };

    const queryMetadata = async (mapPoint: Point) => {
        try {
            anchorPointRef.current = mapPoint;

            const { releaseNum, releaseDateLabel } =
                getTargetWaybackItem(mapPoint);

            const res = await waybackManager.getMetadata({
                releaseNum,
                pointGeometry: mapPoint.toJSON(),
                zoom: mapView.zoom, // getCurrZoomLevel(mapView)
            });

            const metadata: IWaybackMetadataQueryResult = res
                ? {
                      ...res,
                      releaseDate: releaseDateLabel,
                  }
                : null;

            updateScreenPoint4PopupAnchor();

            metadataOnChange(metadata);
        } catch (err) {
            console.error(err);
        }
    };

    const updateScreenPoint4PopupAnchor = () => {
        if (!anchorPointRef.current) {
            return;
        }

        const anchorScreenPoint = mapView.toScreen(anchorPointRef.current);
        anchorPointOnChange(anchorScreenPoint);
    };

    const initMapViewEventHandlers = () => {
        mapView.on('click', (evt) => {
            console.log('view on click, should show popup', evt.mapPoint);
            queryMetadata(evt.mapPoint);
        });

        watch(mapView, 'zoom', () => {
            // console.log('view zoom is on updating, should hide the popup', zoom);
            metadataOnChange(null);
        });

        watch(mapView, 'center', () => {
            // // console.log('view center is on updating, should update the popup position');
            // // need to update the screen point for popup anchor since the map center has changed
            // updateScreenPoint4PopupAnchor();
            metadataOnChange(null);
        });

        // try {
        //     type Modules = [typeof IWatchUtils];

        //     const [watchUtils] = await (loadModules([
        //         'esri/core/watchUtils',
        //     ]) as Promise<Modules>);

        //     mapView.on('click', (evt) => {
        //         console.log('view on click, should show popup', evt.mapPoint);
        //         queryMetadata(evt.mapPoint);
        //     });

        //     watch(mapView, 'zoom', () => {
        //         // console.log('view zoom is on updating, should hide the popup', zoom);
        //         metadataOnChange(null);
        //     });

        //     watch(mapView, 'center', () => {
        //         // // console.log('view center is on updating, should update the popup position');
        //         // // need to update the screen point for popup anchor since the map center has changed
        //         // updateScreenPoint4PopupAnchor();
        //         metadataOnChange(null);
        //     });
        // } catch (err) {
        //     console.error(err);
        // }
    };

    React.useEffect(() => {
        if (mapView) {
            initMapViewEventHandlers();
        }
    }, [mapView]);

    React.useEffect(() => {
        activeWaybackItemRef.current = activeWaybackItem;
    }, [activeWaybackItem]);

    React.useEffect(() => {
        swipeWidgetLeadingLayerRef.current = swipeWidgetLeadingLayer;
    }, [swipeWidgetLeadingLayer]);

    React.useEffect(() => {
        swipeWidgetTrailingLayerRef.current = swipeWidgetTrailingLayer;
    }, [swipeWidgetTrailingLayer]);

    React.useEffect(() => {
        isSwipeWidgetOpenRef.current = isSwipeWidgetOpen;
    }, [isSwipeWidgetOpen]);

    React.useEffect(() => {
        swipeWidgetPositionRef.current = swipeWidgetPosition;
    }, [swipeWidgetPosition]);

    return null;
};

export default MetadataQueryLayer;
