import React, {
    useRef,
    useEffect
} from 'react';

import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import ISwipe from 'esri/widgets/Swipe';
import IWebTileLayer from 'esri/layers/WebTileLayer';
import { IWaybackItem } from '../../types';

type Props = {
    waybackItem4LeadingLayer: IWaybackItem;
    waybackItem4TrailingLayer: IWaybackItem;
    isOpen: boolean;
    mapView?: IMapView;
}

const SwipeWidget:React.FC<Props> = ({
    waybackItem4LeadingLayer,
    waybackItem4TrailingLayer,
    isOpen,
    mapView,
}) => {

    const swipeWidgetRef = useRef<ISwipe>();
    const leadeingLayerRef = useRef<IWebTileLayer>();
    const trailingLayerRef = useRef<IWebTileLayer>();

    const init = async()=>{

        if(swipeWidgetRef.current){
            show();
        } else {
            
            type Modules = [
                typeof ISwipe,
            ];
    
            const [ Swipe ] = await (loadModules([
                'esri/widgets/Swipe',
            ]) as Promise<Modules>);

            const leadingLayer = waybackItem4LeadingLayer ? await getWaybackLayer(waybackItem4LeadingLayer) : null;
            const trailingLayer = waybackItem4TrailingLayer ? await getWaybackLayer(waybackItem4TrailingLayer) : null;

            if(leadingLayer){
                mapView.map.add(leadingLayer)
            }

            if(trailingLayer){
                mapView.map.add(trailingLayer)
            }

            const swipe = new Swipe({
                view: mapView,
                leadingLayers: leadingLayer ? [leadingLayer] : [],
                trailingLayers: trailingLayer ? [trailingLayer]: [],
                direction: "horizontal",
                position: 50 // position set to middle of the view (50%)
            });
    
            // console.log(swipe)
    
            swipeWidgetRef.current = swipe;
    
            mapView.ui.add(swipe);
        }

    };

    const show = ()=>{
        mapView.ui.add(swipeWidgetRef.current);

        if(leadeingLayerRef.current){
            leadeingLayerRef.current.visible = true;
        }

        if(trailingLayerRef.current){
            trailingLayerRef.current.visible = true;
        }
    }

    const hide = ()=>{
        if(swipeWidgetRef.current){
            mapView.ui.remove(swipeWidgetRef.current);
        }

        if(leadeingLayerRef.current){
            leadeingLayerRef.current.visible = false;
        }

        if(trailingLayerRef.current){
            trailingLayerRef.current.visible = false;
        }
    };

    const setLeadingLayer = async()=>{

        if(leadeingLayerRef.current){
            mapView.map.remove(leadeingLayerRef.current)
        }

        const leadingLayer = await getWaybackLayer(waybackItem4LeadingLayer);
        leadeingLayerRef.current = leadingLayer;
        mapView.map.add(leadingLayer)

        swipeWidgetRef.current.leadingLayers.removeAll()
        swipeWidgetRef.current.leadingLayers.add(leadingLayer);
    }

    const setTrailingLayer = async()=>{

        if(trailingLayerRef.current){
            mapView.map.remove(trailingLayerRef.current)
        }

        const trailingLayer = await getWaybackLayer(waybackItem4TrailingLayer);
        trailingLayerRef.current = trailingLayer;
        mapView.map.add(trailingLayer)

        swipeWidgetRef.current.trailingLayers.removeAll()
        swipeWidgetRef.current.trailingLayers.add(trailingLayer);
    }

    const getWaybackLayer=async(data:IWaybackItem)=>{

        if(!data){
            return null;
        }

        try {
            type Modules = [typeof IWebTileLayer];

            const [WebTileLayer] = await (loadModules([
                'esri/layers/WebTileLayer',
            ]) as Promise<Modules>);

            const waybackLayer = new WebTileLayer({
                urlTemplate: data.itemURL,
            });

            return waybackLayer;

        } catch (err) {
            return null;
        }
    }

    useEffect(()=>{
        isOpen 
        ? init() 
        : hide();

    }, [isOpen])

    useEffect(()=>{
        if(waybackItem4LeadingLayer){
            setLeadingLayer();
        }
    }, [waybackItem4LeadingLayer]);

    useEffect(()=>{
        if(waybackItem4TrailingLayer){
            setTrailingLayer();
        }
        
    }, [waybackItem4TrailingLayer])

    return null;
}

export default SwipeWidget
