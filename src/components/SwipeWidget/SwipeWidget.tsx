import React, {
    useRef,
    useEffect
} from 'react';

import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import ISwipe from 'esri/widgets/Swipe';
import { IWaybackItem } from '../../types';
import { destroyCredentials } from 'esri/identity/IdentityManager';

type Props = {
    isOpen: boolean;
    mapView?: IMapView;
    waybackItem4LeadingLayer?: IWaybackItem;
    waybackItem4TrailingLayer?: IWaybackItem;
}

const SwipeWidget:React.FC<Props> = ({
    isOpen,
    mapView,
    waybackItem4LeadingLayer,
    waybackItem4TrailingLayer
}) => {

    const swipeWidgetRef = useRef<ISwipe>()

    const show = async()=>{

        if(swipeWidgetRef.current){
            mapView.ui.add(swipeWidgetRef.current);
        } else {
            
            type Modules = [
                typeof ISwipe,
            ];
    
            const [ Swipe ] = await (loadModules([
                'esri/widgets/Swipe',
            ]) as Promise<Modules>);
    
            const swipe = new Swipe({
                view: mapView,
                leadingLayers: [],
                trailingLayers: [],
                direction: "horizontal",
                position: 50 // position set to middle of the view (50%)
            });
    
            // console.log(swipe)
    
            swipeWidgetRef.current = swipe;
    
            mapView.ui.add(swipe);
        }

    };

    const hide = ()=>{
        if(swipeWidgetRef.current){
            mapView.ui.remove(swipeWidgetRef.current);
        }
    };

    useEffect(()=>{
        isOpen 
        ? show() 
        : hide();
        
    }, [isOpen])

    return null;
}

export default SwipeWidget
