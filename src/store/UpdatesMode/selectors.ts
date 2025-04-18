import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/configureStore';

export const selectUpdatesModeCategory = (state: RootState) =>
    state.UpdatesMode.category;
