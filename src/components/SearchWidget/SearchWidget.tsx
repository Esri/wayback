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
import MapView from '@arcgis/core/views/MapView';
import Extent from '@arcgis/core/geometry/Extent';
import Graphic from '@arcgis/core/Graphic';
import Search from '@arcgis/core/widgets/Search';

type SearchResult = {
    extent: Extent;
    feature: Graphic;
    name: string;
    target: string;
};

type Props = {
    containerId?: string;
    portalUrl?: string;
    mapView?: MapView;
    searchCompletedHandler?: (result: SearchResult) => void;
};

const SearchWidget: React.FC<Props> = ({
    mapView,
    searchCompletedHandler,
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const init = () => {
        const searchWidget = new Search({
            view: mapView,
            resultGraphicEnabled: false,
            popupEnabled: false,
            // portal,
            container: containerRef.current,
        });

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
                zIndex: 20,
            }}
        ></div>
    );
};

export default SearchWidget;
