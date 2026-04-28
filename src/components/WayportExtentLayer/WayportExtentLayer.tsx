/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Extent from '@arcgis/core/geometry/Extent';
import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import GraphicLayer from '@arcgis/core/layers/GraphicsLayer';
import React, { FC, useEffect, useRef } from 'react';
import { IExtent } from '@typings/index';
import { useAppSelector } from '@store/configureStore';
import { selectTimestampOfZoomToDownloadJobExtentRequest } from '@store/WayportMode/selectors';

type Props = {
    mapView: MapView;
    extent: IExtent | null;
    visible: boolean;
    /**
     * Timestamp of when the zoom to download job extent on map request is made.
     * This is used as a dependency in useEffect to trigger zooming to the extent on the map whenever the user clicks to show the job extent on the map, even if it's the same job as before.
     */
    timestampOfZoomToDownloadJobExtentRequest: number;
};

export const WayportExtentLayer: FC<Props> = ({
    mapView,
    extent,
    visible,
    timestampOfZoomToDownloadJobExtentRequest,
}) => {
    const graphicLayer = useRef<GraphicLayer>(null);

    const init = () => {
        const layer = new GraphicLayer({
            id: 'wayport-extent-layer',
            visible,
            effect: `drop-shadow(2px, 2px, 4px)`,
        });

        mapView.map.add(layer);

        graphicLayer.current = layer;
    };

    useEffect(() => {
        if (!mapView) return;

        if (!graphicLayer.current) {
            init();
        }

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
            mapView.goTo({
                target: geometry,
                duration: 1000,
            });
        }
    }, [extent, visible, mapView, timestampOfZoomToDownloadJobExtentRequest]);

    return null;
};
