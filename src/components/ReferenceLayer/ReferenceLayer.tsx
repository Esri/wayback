import React, {
    useEffect, useRef
} from 'react'

import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IVectorTileLayer from 'esri/layers/VectorTileLayer';

import {
    REFERENCE_LAYER_ITEM_ID
} from './constants';

type Props = {
    isVisible: boolean;
    mapView?: IMapView;
}

const ReferenceLayer:React.FC<Props> = ({
    isVisible,
    mapView
}) => {

    const referenceLayerRef = useRef<IVectorTileLayer>();

    const init = async()=>{
        try {

            type Modules = [
                typeof IVectorTileLayer
            ];

            const [VectorTileLayer] = await (loadModules([
                'esri/layers/VectorTileLayer',
            ]) as Promise<Modules>);

            referenceLayerRef.current = new VectorTileLayer({
                portalItem: {
                    id: REFERENCE_LAYER_ITEM_ID,
                },
                visible: isVisible
            });
            
            mapView.map.add(referenceLayerRef.current)

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        console.log(mapView)
        if (mapView) {
            init();
        }
    }, [ mapView ]);

    useEffect(() => {
        if (mapView && referenceLayerRef.current) {
            referenceLayerRef.current.visible = isVisible
        }
    }, [ isVisible ]);

    return null;
}

export default ReferenceLayer
