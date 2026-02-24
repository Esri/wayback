import Extent from '@arcgis/core/geometry/Extent';
import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import GraphicLayer from '@arcgis/core/layers/GraphicsLayer';
import React, { FC, useEffect, useRef } from 'react';
import { IExtent } from '@typings/index';

type Props = {
    mapView: MapView;
    extent: IExtent | null;
    visible: boolean;
};

export const WayportExtentLayer: FC<Props> = ({ mapView, extent, visible }) => {
    const graphicLayer = useRef<GraphicLayer>(null);

    useEffect(() => {
        if (!mapView) return;

        const layer = new GraphicLayer({
            id: 'wayport-extent-layer',
            visible,

            effect: `drop-shadow(2px, 2px, 4px)`,
        });

        mapView.map.add(layer);

        graphicLayer.current = layer;

        return () => {
            mapView.map.remove(layer);
        };
    }, [mapView]);

    useEffect(() => {
        if (!graphicLayer.current) return;

        graphicLayer.current.visible = visible;

        graphicLayer.current.removeAll();

        if (extent && visible) {
            const geometry = new Extent({
                xmin: extent.xmin,
                ymin: extent.ymin,
                xmax: extent.xmax,
                ymax: extent.ymax,
                spatialReference: extent.spatialReference,
            });

            const graphic = new Graphic({
                geometry,
                symbol: {
                    type: 'simple-fill',
                    color: [0, 0, 0, 0],
                    outline: {
                        color: [255, 255, 255, 1],
                        width: 2,
                    },
                },
            });

            graphicLayer.current.add(graphic);

            // zoom to the extent with some padding
            // so that the extent boundary can be fully shown on the map
            mapView.goTo(geometry.expand(1.5), {
                duration: 1000,
            });
        }
    }, [extent, visible]);

    return null;
};
