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

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/configureStore';

export const selectUpdatesModeCategory = (state: RootState) =>
    state.UpdatesMode.category;

export const selectUpdatesModeRegion = (state: RootState) =>
    state.UpdatesMode.region;

// export const selectUpdatesModeStatus = (state: RootState) =>
//     state.UpdatesMode.status;

export const selectUpdatesModeDate = (state: RootState) =>
    state.UpdatesMode.dateFilter;

// export const selectUpdatesModeCustomDateRange = (state: RootState) =>
//     state.UpdatesMode.customDateRange;

export const selectWorldImageryUpdatesOutStatistics = (state: RootState) =>
    state.UpdatesMode.outStatistics;

export const selectUpdatesModeState = (state: RootState) => state.UpdatesMode;

export const selectShouldZoomToSelectedRegion = (state: RootState) =>
    state.UpdatesMode.shouldZoomToSelectedRegion;

export const selectIsLoadingExtentForSelectedRegion = (state: RootState) =>
    state.UpdatesMode.isLoadingExtentForSelectedRegion;

export const selectIsPendingOptionsSelected = createSelector(
    selectUpdatesModeDate,
    (dateFilter) =>
        dateFilter === 'next-week' ||
        dateFilter === 'next-month' ||
        dateFilter === 'next-3-months'
);
