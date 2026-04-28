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

import MapView from '@arcgis/core/views/MapView';
import { APP_FULL_EXTENT_CENTER, APP_FULL_EXTENT_ZOOM } from '@constants/map';
import { usePrevious } from '@hooks/usePrevious';
import { useAppSelector } from '@store/configureStore';
import { selectMapMode } from '@store/Map/reducer';
import React, { useEffect } from 'react';

export const useZoomToWorldExtent = (mapView: MapView) => {
    const mode = useAppSelector(selectMapMode);

    const prevMode = usePrevious(mode);

    // Track whether we've already zoomed to the world extent during this session
    // We should only do this once when the user first switches to the updates mode, and not every time they switch back to it
    const [hasZoomedToWorldExtent, setHasZoomedToWorldExtent] =
        React.useState(false);

    const zoomToWorldExtent = async () => {
        if (!mapView) return;

        await mapView.when();

        mapView.goTo({
            center: APP_FULL_EXTENT_CENTER,
            zoom: APP_FULL_EXTENT_ZOOM,
        });

        // Set the flag to indicate that we've zoomed to the world extent
        // This prevents future automatic zooms when switching back to the updates mode
        setHasZoomedToWorldExtent(true);
    };

    useEffect(() => {
        if (!mapView) return;

        if (hasZoomedToWorldExtent) return;

        if (prevMode && prevMode !== 'updates' && mode === 'updates') {
            zoomToWorldExtent();
        }
    }, [mode, prevMode, hasZoomedToWorldExtent]);
};
