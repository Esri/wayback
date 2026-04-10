import { ReferenceLayerLanguage } from '@constants/map';
import { StoreDispatch, StoreGetState } from '../configureStore';
// import { setPreferredReferenceLayerLocale } from '@utils/LocalStorage';
import {
    MapMode,
    mapModeChanged,
    referenceLayerLocaleUpdated,
} from './reducer';
import { activeDialogUpdated } from '@store/UI/reducer';
import { setPreferredReferenceLayerLocale } from '@utils/LocalStorage';

/**
 * THIS IS THE LEGACY CODE THAT WILL BE USED TEMPORARILY UNTIL WE ARE READY TO RELEASE THE APP LANGUAGE FEATURE.
 */
export const updateReferenceLayerLocale =
    (locale: ReferenceLayerLanguage) =>
    (dispatch: StoreDispatch, getState: StoreGetState) => {
        setPreferredReferenceLayerLocale(locale);
        dispatch(referenceLayerLocaleUpdated(locale));
    };

export const updateMapMode = (mode: MapMode) => (dispatch: StoreDispatch) => {
    dispatch(mapModeChanged(mode));
    // close any active dialog when switching map mode
    dispatch(activeDialogUpdated());
};

// export const toggleSaveWebmapMode =
//     () => (dispatch: StoreDispatch, getState: StoreGetState) => {
//         const currentMode = getState().Map.mode;
//         const newMode =
//             currentMode === 'save-webmap' ? 'explore' : 'save-webmap';
//         dispatch(updateMapMode(newMode));
//     };
