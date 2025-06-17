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

import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import {
    IExtentGeomety,
    IScreenPoint,
    IWaybackMetadataQueryResult,
} from '@typings/index';

import { RootState } from '../configureStore';
import { ReferenceLayerLanguage } from '@constants/map';

export type MapCenter = {
    lon: number;
    lat: number;
};

export type MapMode = 'explore' | 'swipe' | 'animation' | 'updates';

export type MapState = {
    mode: MapMode;
    mapExtent: IExtentGeomety;
    /**
     * if true, it is in process of querying metadata
     */
    isQueryingMetadata: boolean;
    metadataQueryResult: IWaybackMetadataQueryResult;
    metadataPopupAnchor: IScreenPoint;
    isReferenceLayerVisible: boolean;
    /**
     * Represents the level of detail (LOD) at the center of the view.
     */
    zoom?: number;
    /**
     * Represents the view's center point
     */
    center?: MapCenter;
    /**
     * The locale of the reference layer that is set by the user
     */
    referenceLayerLocale: ReferenceLayerLanguage;
    /**
     * The locale of the reference layer that is suggested by the app
     */
    suggestedReferenceLayerLocale: ReferenceLayerLanguage | null;
    /**
     * if true, the reference layer switcher is open
     */
    isReferenceLayerSwitcherOpen: boolean;
};

export const initialMapState: MapState = {
    mode: 'explore',
    mapExtent: null,
    isQueryingMetadata: false,
    metadataQueryResult: null,
    metadataPopupAnchor: null,
    isReferenceLayerVisible: true,
    zoom: null,
    center: null,
    referenceLayerLocale: ReferenceLayerLanguage.EnglishUS,
    suggestedReferenceLayerLocale: null,
    isReferenceLayerSwitcherOpen: false,
};

const slice = createSlice({
    name: 'Map',
    initialState: initialMapState,
    reducers: {
        mapModeChanged: (state: MapState, action: PayloadAction<MapMode>) => {
            state.mode = action.payload;
        },
        mapExtentUpdated: (
            state: MapState,
            action: PayloadAction<IExtentGeomety>
        ) => {
            state.mapExtent = action.payload;
        },
        metadataQueryResultUpdated: (
            state: MapState,
            action: PayloadAction<IWaybackMetadataQueryResult>
        ) => {
            state.metadataQueryResult = action.payload;
            state.isQueryingMetadata = false;
        },
        metadataPopupAnchorUpdated: (
            state: MapState,
            action: PayloadAction<IScreenPoint>
        ) => {
            state.metadataPopupAnchor = action.payload;
        },
        isReferenceLayerVisibleToggled: (state: MapState) => {
            state.isReferenceLayerVisible = !state.isReferenceLayerVisible;
        },
        isQueryingMetadataToggled: (
            state: MapState,
            action: PayloadAction<boolean>
        ) => {
            state.isQueryingMetadata = action.payload;
        },
        mapCenterUpdated: (state, action: PayloadAction<MapCenter>) => {
            state.center = action.payload;
        },
        zoomUpdated: (state, action: PayloadAction<number>) => {
            state.zoom = action.payload;
        },
        referenceLayerLocaleUpdated: (
            state,
            action: PayloadAction<ReferenceLayerLanguage>
        ) => {
            state.referenceLayerLocale = action.payload;
        },
        suggestedReferenceLayerLocaleUpdated: (
            state,
            action: PayloadAction<ReferenceLayerLanguage | null>
        ) => {
            state.suggestedReferenceLayerLocale = action.payload;
        },
        isReferenceLayerSwitcherOpenToggled: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.isReferenceLayerSwitcherOpen = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    mapModeChanged,
    mapExtentUpdated,
    metadataQueryResultUpdated,
    metadataPopupAnchorUpdated,
    isReferenceLayerVisibleToggled,
    isQueryingMetadataToggled,
    mapCenterUpdated,
    zoomUpdated,
    referenceLayerLocaleUpdated,
    suggestedReferenceLayerLocaleUpdated,
    isReferenceLayerSwitcherOpenToggled,
} = slice.actions;

export const selectMapMode = (state: RootState) => state.Map.mode;

export const mapExtentSelector = (state: RootState) => state.Map.mapExtent;

export const isReferenceLayerVisibleSelector = (state: RootState) =>
    state.Map.isReferenceLayerVisible;

export const selectIsQueringMetadata = (state: RootState) =>
    state.Map.isQueryingMetadata;

export const metadataQueryResultSelector = (state: RootState) =>
    state.Map.metadataQueryResult;

export const metadataPopupAnchorSelector = (state: RootState) =>
    state.Map.metadataPopupAnchor;

export const selectMapCenter = (state: RootState) => state.Map.center;

export const selectReferenceLayerLocale = (state: RootState) =>
    state.Map.referenceLayerLocale;

export const selectSuggestedReferenceLayerLocale = (state: RootState) =>
    state.Map.suggestedReferenceLayerLocale;

export const selectIsReferenceLayerSwitcherOpen = (state: RootState) =>
    state.Map.isReferenceLayerSwitcherOpen;

/**
 * Select center and zoom of the map
 *
 * @return `{ zoom: number, cenetr: {lat: number, lon: number} }`
 */
export const selectMapCenterAndZoom = createSelector(
    (state: RootState) => state.Map.zoom,
    (state: RootState) => state.Map.center,
    (zoom, center) => {
        return {
            zoom,
            center,
        };
    }
);

export default reducer;
