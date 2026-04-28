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
