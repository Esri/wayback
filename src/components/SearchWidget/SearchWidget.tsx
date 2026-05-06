/* Copyright 2025 Esri
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

import React, { useRef, useEffect } from 'react';

import MapView from '@arcgis/core/views/MapView';
import Extent from '@arcgis/core/geometry/Extent';
import Graphic from '@arcgis/core/Graphic';
import classNames from 'classnames';
import type { ArcgisSearch } from '@arcgis/map-components/dist/components/arcgis-search';
import '@arcgis/map-components/components/arcgis-search';

type SearchResult = {
    extent?: Extent;
    feature?: Graphic;
    name?: string;
    target?: Graphic;
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
    const searchRef = useRef<ArcgisSearch>(null);

    useEffect(() => {
        if (!mapView || !searchRef.current) {
            return;
        }

        const searchEl = searchRef.current as any;
        searchEl.view = mapView;

        if (!searchCompletedHandler) {
            return;
        }

        const handleSearchComplete = (evt: CustomEvent) => {
            const results = evt.detail?.results;
            if (results?.[0]?.results?.[0]) {
                searchCompletedHandler(results[0].results[0] as SearchResult);
            }
        };

        searchEl.addEventListener('arcgisSearchComplete', handleSearchComplete);

        return () => {
            searchEl.removeEventListener(
                'arcgisSearchComplete',
                handleSearchComplete
            );
        };
    }, [mapView]);

    return (
        <div
            style={{
                position: 'absolute',
                top: 15,
                left: 15,
                zIndex: 20,
            }}
        >
            <arcgis-search
                ref={searchRef}
                resultGraphicDisabled={true}
                popupDisabled={true}
            ></arcgis-search>
        </div>
    );
};

export default SearchWidget;
