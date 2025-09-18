import { StoreDispatch, StoreGetState } from '@store/configureStore';
import {
    shouldZoomToSelectedRegionChanged,
    updatesModeRegionChanged,
} from './reducer';

export const changeSelectedRegionForUpdatesMode =
    (region: string) => (dispatch: StoreDispatch, getState: StoreGetState) => {
        // set the flag to zoom to the selected region
        dispatch(shouldZoomToSelectedRegionChanged(true));

        dispatch(updatesModeRegionChanged(region));
    };
