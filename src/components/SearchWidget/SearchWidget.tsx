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

import React, { useEffect, useRef } from 'react';

// import { loadModules } from 'esri-loader';
// import IMapView from 'esri/views/MapView';
// import IExtent from 'esri/geometry/Extent';
// import IGraphic from 'esri/Graphic';
// import ISearchWidget from 'esri/widgets/Search';

import MapView from '@arcgis/core/views/MapView';
import Extent from '@arcgis/core/geometry/Extent';
import Graphic from '@arcgis/core/Graphic';
import Search from '@arcgis/core/widgets/Search';
import Portal from '@arcgis/core/portal/Portal';

// type UIAddPosition =
//     | 'bottom-leading'
//     | 'bottom-left'
//     | 'bottom-right'
//     | 'bottom-trailing'
//     | 'top-leading'
//     | 'top-left'
//     | 'top-right'
//     | 'top-trailing'
//     | 'manual';

type SearchResult = {
    extent: Extent;
    feature: Graphic;
    name: string;
    target: string;
};

type Props = {
    // position?: UIAddPosition;
    containerId?: string;
    portalUrl?: string;
    mapView?: MapView;
    searchCompletedHandler?: (result: SearchResult) => void;
};

const SearchWidget: React.FC<Props> = ({
    // position,
    // containerId,
    // portalUrl,
    mapView,
    searchCompletedHandler,
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const init = () => {
        // if (!position && !containerId) {
        //     return;
        // }

        // const portal = portalUrl ? new Portal({ url: portalUrl }) : null;

        const searchWidget = new Search({
            view: mapView,
            resultGraphicEnabled: false,
            popupEnabled: false,
            // portal,
            container: containerRef.current,
        });

        // if (position && !containerId) {
        //     mapView.ui.add(searchWidget, {
        //         position,
        //         index: 0,
        //     });
        // }

        if (searchCompletedHandler) {
            searchWidget.on('search-complete', () => {
                if (
                    searchWidget.results[0] &&
                    searchWidget?.results[0]?.results[0]
                ) {
                    const searchResult: SearchResult =
                        searchWidget.results[0].results[0];
                    // console.log(searchResultGeom);
                    searchCompletedHandler(searchResult);
                }
            });
        }

        // type Modules = [typeof ISearchWidget];

        // try {
        //     const [Search] = await (loadModules([
        //         'esri/widgets/Search',
        //     ]) as Promise<Modules>);

        //     const searchWidget = new Search({
        //         view: mapView,
        //         resultGraphicEnabled: false,
        //         popupEnabled: false,
        //         container: containerId,
        //     });

        //     if (position && !containerId) {
        //         mapView.ui.add(searchWidget, {
        //             position,
        //             index: 0,
        //         });
        //     }

        //     if (searchCompletedHandler) {
        //         searchWidget.on('search-complete', (evt) => {
        //             if (
        //                 searchWidget.results[0] &&
        //                 searchWidget?.results[0]?.results[0]
        //             ) {
        //                 const searchResult: SearchResult =
        //                     searchWidget.results[0].results[0];
        //                 // console.log(searchResultGeom);
        //                 searchCompletedHandler(searchResult);
        //             }
        //         });
        //     }
        // } catch (err) {
        //     console.error(err);
        // }
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
                top: 15,
                left: 15,
            }}
        ></div>
    );
};

export default SearchWidget;
