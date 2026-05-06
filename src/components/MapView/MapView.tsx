/* Copyright 2024-2026 Esri
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

import React, { useEffect, useRef, useState } from 'react';

import ArcGISMapView from '@arcgis/core/views/MapView';
import { watch, when } from '@arcgis/core/core/reactiveUtils';
import { webMercatorToGeographic } from '@arcgis/core/geometry/support/webMercatorUtils';
import Extent from '@arcgis/core/geometry/Extent';
import TileInfo from '@arcgis/core/layers/support/TileInfo';
import MapViewConstraints from '@arcgis/core/views/2d/MapViewConstraints';
import '@arcgis/map-components/components/arcgis-map';

import { IExtentGeomety, IMapPointInfo } from '@typings/index';
import { MapCenter } from '@store/Map/reducer';

interface Props {
    /**
     * Coordinate pair `{longitude, latitude}` that represent the default center of the map view
     */
    center?: MapCenter;
    /**
     * default zoom level
     */
    zoom?: number;
    /**
     * Emitted when the MapView's stationary event is triggered, which indicates the end of a view navigation such as zooming or panning. The event payload includes the current center point information and the map extent.
     */
    onStationary: (payload: {
        mapCenterPointInfo: IMapPointInfo;
        mapExtent: IExtentGeomety;
        mapScale: number;
        mapResolution: number;
    }) => void;
    onUpdating: (isUpdating: boolean) => void;
    children?: React.ReactNode;
}

const MapViewComponent: React.FC<Props> = ({
    center,
    zoom,
    onStationary,
    onUpdating,
    children,
}: Props) => {
    const [mapView, setMapView] = useState<ArcGISMapView>(null);

    // Capture initial center/zoom once — never pass updated values to arcgis-map.
    // The web component treats every prop write as a goTo() call, which could create
    // an infinite loop: onStationary → Redux update → re-render → goTo() → onStationary.
    const initialCenterRef = useRef<[number, number]>(
        center ? [center.lon, center.lat] : null
    );
    const initialZoomRef = useRef(zoom);

    const initEventHandlers = (view: ArcGISMapView) => {
        when(
            () => view.stationary === true,
            () => {
                console.log(
                    'MapView is stationary, updating map center, zoom and extent in the store, and query local changes based on the new map center and zoom level'
                );

                const center = view?.center;

                if (!center) {
                    return;
                }

                const extent = webMercatorToGeographic(view.extent);

                const mapViewCenterPointInfo: IMapPointInfo = {
                    latitude: center.latitude,
                    longitude: center.longitude,
                    zoom: view.zoom,
                };

                onStationary({
                    mapCenterPointInfo: mapViewCenterPointInfo,
                    mapExtent: extent.toJSON(),
                    mapScale: view.scale,
                    mapResolution: view.resolution,
                });
            }
        );

        watch(
            () => view.updating,
            (updating) => {
                onUpdating(updating);
            }
        );
    };

    useEffect(() => {
        const arcgisMapElement = document.querySelector('arcgis-map') as any;

        const view = arcgisMapElement.view;

        if (!(view instanceof ArcGISMapView)) {
            console.error('The view is not an instance of ArcGISMapView');
            return;
        }

        initEventHandlers(view);

        setMapView(view);
    }, []);

    // // Handle center and zoom changes from outside the map view (e.g. fly-to or reset)
    // useEffect(() => {
    //     if (!mapView || !center) {
    //         return;
    //     }

    //     const { lon: longitude, lat: latitude } = center;

    //     if (
    //         mapView.center.longitude.toFixed(6) === longitude.toFixed(6) &&
    //         mapView.center.latitude.toFixed(6) === latitude.toFixed(6) &&
    //         mapView.zoom.toFixed(3) === zoom.toFixed(3)
    //     ) {
    //         // console.log('MapView center and zoom are already at the target values, no need to call goTo()');
    //         return;
    //     }

    //     mapView.goTo({ center: [longitude, latitude], zoom });
    // }, [center, zoom]);

    return (
        <>
            <div
                className="absolute top-0 left-0 w-full bottom-0"
                data-testid="map-view-container"
            >
                <arcgis-map
                    center={initialCenterRef.current}
                    zoom={initialZoomRef.current}
                    popupDisabled={true}
                    constraints={
                        new MapViewConstraints({
                            lods: TileInfo.create().lods,
                            snapToZoom: true,
                            rotationEnabled: false,
                        })
                    }
                ></arcgis-map>
            </div>
            {mapView
                ? React.Children.map(children, (child) => {
                      if (!child) {
                          return null;
                      }

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

export default MapViewComponent;
