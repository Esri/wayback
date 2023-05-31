import React, { useEffect, useRef } from 'react';

import MapView from '@arcgis/core/views/MapView';
import Zoom from '@arcgis/core/widgets/Zoom';

type Props = {
    mapView?: MapView;
};

const SearchWidget: React.FC<Props> = ({ mapView }: Props) => {
    const containerRef = useRef<HTMLDivElement>();

    const init = () => {
        const zoom = new Zoom({
            view: mapView,
            container: containerRef.current,
        });
    };

    useEffect(() => {
        if (mapView) {
            init();
        }
    }, [mapView]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 50,
                left: 15,
            }}
        ></div>
    );
};

export default SearchWidget;
