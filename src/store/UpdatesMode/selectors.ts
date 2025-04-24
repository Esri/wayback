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
