import MapView from '@arcgis/core/views/MapView';
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
            zoom: 3,
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
