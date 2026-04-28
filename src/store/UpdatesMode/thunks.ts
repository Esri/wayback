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

// /**
//  * Toggles between 'updates' mode and 'explore' mode.
//  * @returns A thunk that toggles between 'updates' mode and 'explore' mode.
//  */
// export const toggleUpdatesMode =
//     () => (dispatch: StoreDispatch, getState: StoreGetState) => {
//         const mode = selectMapMode(getState());

//         const newMode: MapMode = mode === 'updates' ? 'explore' : 'updates';

//         dispatch(updateMapMode(newMode));
//     };
