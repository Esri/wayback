import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/configureStore';

export const selectUpdatesModeCategory = (state: RootState) =>
    state.UpdatesMode.category;

export const selectUpdatesModeRegion = (state: RootState) =>
    state.UpdatesMode.region;

export const selectUpdatesModeStatus = (state: RootState) =>
    state.UpdatesMode.status;

export const selectUpdatesModeDate = (state: RootState) =>
    state.UpdatesMode.dateFilter;

export const selectUpdatesModeCustomDateRange = (state: RootState) =>
    state.UpdatesMode.customDateRange;

export const selectWorldImageryUpdatesOutStatistics = (state: RootState) =>
    state.UpdatesMode.outStatistics;

export const selectUpdatesModeState = (state: RootState) => state.UpdatesMode;

export const selectShouldZoomToSelectedRegion = (state: RootState) =>
    state.UpdatesMode.shouldZoomToSelectedRegion;

export const selectIsLoadingExtentForSelectedRegion = (state: RootState) =>
    state.UpdatesMode.isLoadingExtentForSelectedRegion;
