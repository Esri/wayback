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

import React, { useEffect, useRef } from 'react';

import MapView from '@arcgis/core/views/MapView';
import '@arcgis/map-components/components/arcgis-zoom';

type Props = {
    mapView?: MapView;
};

const ZoomWidget: React.FC<Props> = ({ mapView }: Props) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: 50,
                left: 15,
                zIndex: 10,
            }}
        >
            <arcgis-zoom layout="vertical" view={mapView}></arcgis-zoom>
        </div>
    );
};

export default ZoomWidget;
