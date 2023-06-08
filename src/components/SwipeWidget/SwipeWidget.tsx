import React, { useRef, useEffect } from 'react';

// import { loadModules } from 'esri-loader';
// import IMapView from 'esri/views/MapView';
// import ISwipe from 'esri/widgets/Swipe';
// import IWebTileLayer from 'esri/layers/WebTileLayer';
// import IWatchUtils from 'esri/core/watchUtils';
import { IWaybackItem } from '@typings/index';

import MapView from '@arcgis/core/views/MapView';
import Swipe from '@arcgis/core/widgets/Swipe';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import { watch } from '@arcgis/core/core/watchUtils';

import { getWaybackLayer } from '../WaybackLayer/getWaybackLayer';

type Props = {
    waybackItem4LeadingLayer: IWaybackItem;
    waybackItem4TrailingLayer: IWaybackItem;
    isOpen: boolean;
    mapView?: MapView;

    positionOnChange: (position: number) => void;
    // onLoaded:()=>void;
};

type SwipeWidgetLayer = 'leading' | 'trailing';

const SwipeWidget: React.FC<Props> = ({
    waybackItem4LeadingLayer,
    waybackItem4TrailingLayer,
    isOpen,
    mapView,
    positionOnChange,
    // onLoaded
}) => {
    const swipeWidgetRef = useRef<Swipe>();
    const layersRef = useRef<WebTileLayer[]>([]);

    const init = async () => {
        if (swipeWidgetRef.current) {
            show();
        } else {
            const leadingLayer = getWaybackLayer(waybackItem4LeadingLayer);
            const trailingLayer = getWaybackLayer(waybackItem4TrailingLayer);

            layersRef.current = [leadingLayer, trailingLayer];

            mapView.map.addMany(layersRef.current, 1);

            const swipe = new Swipe({
                view: mapView,
                leadingLayers: [leadingLayer],
                trailingLayers: [trailingLayer],
                direction: 'horizontal',
                position: 50, // position set to middle of the view (50%)
            });

            swipeWidgetRef.current = swipe;

            mapView.ui.add(swipe);

            addEventHandlers(swipe);

            // onLoaded();
        }

        // type Modules = [
        //     typeof ISwipe,
        // ];

        // try {
        //     const [ Swipe ] = await (loadModules([
        //         'esri/widgets/Swipe',
        //     ]) as Promise<Modules>);

        //     if(swipeWidgetRef.current){
        //         show();
        //     } else {

        //         const leadingLayer = await getWaybackLayer(waybackItem4LeadingLayer);
        //         const trailingLayer = await getWaybackLayer(waybackItem4TrailingLayer);

        //         layersRef.current = [leadingLayer, trailingLayer];

        //         mapView.map.addMany(layersRef.current, 1);

        //         const swipe = new Swipe({
        //             view: mapView,
        //             leadingLayers: [leadingLayer],
        //             trailingLayers: [trailingLayer],
        //             direction: "horizontal",
        //             position: 50 // position set to middle of the view (50%)
        //         });

        //         swipeWidgetRef.current = swipe;

        //         mapView.ui.add(swipe);

        //         addEventHandlers(swipe);

        //         // onLoaded();
        //     }

        // } catch(err){
        //     console.error(err);
        //     init();
        // }
    };

    const addEventHandlers = (swipeWidget: Swipe) => {
        // try {
        //     type Modules = [typeof IWatchUtils];

        //     const [watchUtils] = await (loadModules([
        //         'esri/core/watchUtils',
        //     ]) as Promise<Modules>);

        //     watch(swipeWidget, 'position', (position:number) => {
        //         // console.log('position changes for swipe widget', position);
        //         positionOnChange(position);
        //     });

        // } catch (err) {
        //     console.error(err);
        // }

        watch(swipeWidget, 'position', (position: number) => {
            // console.log('position changes for swipe widget', position);
            positionOnChange(position);
        });
    };

    const show = () => {
        mapView.ui.add(swipeWidgetRef.current);

        layersRef.current.forEach((layer) => {
            layer.visible = true;
        });
    };

    const hide = () => {
        if (swipeWidgetRef.current) {
            mapView.ui.remove(swipeWidgetRef.current);
        }

        layersRef.current.forEach((layer) => {
            layer.visible = false;
        });
    };

    const setLayer = async (
        layerItem: IWaybackItem,
        layerType: SwipeWidgetLayer
    ) => {
        if (!mapView) {
            return;
        }

        const layerIndex = layerType === 'leading' ? 0 : 1;

        const existingLayer = layersRef.current[layerIndex];

        if (existingLayer) {
            mapView.map.remove(existingLayer);
        }

        const newLayer = await getWaybackLayer(layerItem);
        layersRef.current[layerIndex] = newLayer;
        mapView.map.add(newLayer, 1);

        if (layerType === 'leading') {
            swipeWidgetRef.current.leadingLayers.removeAll();
            swipeWidgetRef.current.leadingLayers.add(newLayer);
        } else {
            swipeWidgetRef.current.trailingLayers.removeAll();
            swipeWidgetRef.current.trailingLayers.add(newLayer);
        }
    };

    // const getWaybackLayer=async(data:IWaybackItem)=>{

    //     if(!data){
    //         return null;
    //     }

    //     try {
    //         type Modules = [typeof IWebTileLayer];

    //         const [WebTileLayer] = await (loadModules([
    //             'esri/layers/WebTileLayer',
    //         ]) as Promise<Modules>);

    //         const waybackLayer = new WebTileLayer({
    //             urlTemplate: data.itemURL,
    //         });

    //         return waybackLayer;

    //     } catch (err) {
    //         return null;
    //     }
    // }

    useEffect(() => {
        isOpen && mapView ? init() : hide();
    }, [isOpen, mapView]);

    useEffect(() => {
        if (waybackItem4LeadingLayer && swipeWidgetRef.current) {
            setLayer(waybackItem4LeadingLayer, 'leading');
        }
    }, [waybackItem4LeadingLayer]);

    useEffect(() => {
        if (waybackItem4TrailingLayer && swipeWidgetRef.current) {
            setLayer(waybackItem4TrailingLayer, 'trailing');
        }
    }, [waybackItem4TrailingLayer]);

    return null;
};

export default SwipeWidget;
