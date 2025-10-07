import { ReferenceLayerLanguage } from '@constants/map';
import { StoreDispatch, StoreGetState } from '../configureStore';
import { setPreferredReferenceLayerLocale } from '@utils/LocalStorage';
import {
    MapMode,
    mapModeChanged,
    referenceLayerLocaleUpdated,
} from './reducer';
import { activeDialogUpdated } from '@store/UI/reducer';

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
