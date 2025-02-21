import { ReferenceLayerLanguage } from '@constants/map';
import { StoreDispatch, StoreGetState } from '../configureStore';
import { setPreferredReferenceLayerLocale } from '@utils/LocalStorage';
import { referenceLayerLocaleUpdated } from './reducer';

export const updateReferenceLayerLocale =
    (locale: ReferenceLayerLanguage) =>
    (dispatch: StoreDispatch, getState: StoreGetState) => {
        setPreferredReferenceLayerLocale(locale);
        dispatch(referenceLayerLocaleUpdated(locale));
    };
