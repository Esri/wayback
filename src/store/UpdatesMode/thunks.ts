import { StoreDispatch, StoreGetState } from '@store/configureStore';
import {
    shouldZoomToSelectedRegionChanged,
    updatesModeRegionChanged,
} from './reducer';
import { MapMode, selectMapMode } from '@store/Map/reducer';
import { updateMapMode } from '@store/Map/thunks';

export const changeSelectedRegionForUpdatesMode =
    (region: string) => (dispatch: StoreDispatch, getState: StoreGetState) => {
        // set the flag to zoom to the selected region
        dispatch(shouldZoomToSelectedRegionChanged(true));

        dispatch(updatesModeRegionChanged(region));
    };

/**
 * Toggles between 'updates' mode and 'explore' mode.
 * @returns A thunk that toggles between 'updates' mode and 'explore' mode.
 */
export const toggleUpdatesMode =
    () => (dispatch: StoreDispatch, getState: StoreGetState) => {
        const mode = selectMapMode(getState());

        const newMode: MapMode = mode === 'updates' ? 'explore' : 'updates';

        dispatch(updateMapMode(newMode));
    };
