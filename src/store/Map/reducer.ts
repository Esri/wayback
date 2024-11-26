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

export type MapMode = 'explore' | 'swipe' | 'animation';

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
    referenceLayerLocale: ReferenceLayerLanguage.English,
    suggestedReferenceLayerLocale: null,
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
} = slice.actions;

export const selectMapMode = createSelector(
    (state: RootState) => state.Map.mode,
    (mode) => mode
);

export const mapExtentSelector = createSelector(
    (state: RootState) => state.Map.mapExtent,
    (mapExtent) => mapExtent
);

export const isReferenceLayerVisibleSelector = createSelector(
    (state: RootState) => state.Map.isReferenceLayerVisible,
    (isReferenceLayerVisible) => isReferenceLayerVisible
);

export const selectIsQueringMetadata = createSelector(
    (state: RootState) => state.Map.isQueryingMetadata,
    (isQueryingMetadata) => isQueryingMetadata
);

export const metadataQueryResultSelector = createSelector(
    (state: RootState) => state.Map.metadataQueryResult,
    (metadataQueryResult) => metadataQueryResult
);

export const metadataPopupAnchorSelector = createSelector(
    (state: RootState) => state.Map.metadataPopupAnchor,
    (metadataPopupAnchor) => metadataPopupAnchor
);

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

export const selectMapCenter = createSelector(
    (state: RootState) => state.Map.center,
    (center) => center
);

export const selectReferenceLayerLocale = createSelector(
    (state: RootState) => state.Map.referenceLayerLocale,
    (referenceLayerLocale) => referenceLayerLocale
);

export const selectSuggestedReferenceLayerLocale = createSelector(
    (state: RootState) => state.Map.suggestedReferenceLayerLocale,
    (suggestedReferenceLayerLocale) => suggestedReferenceLayerLocale
);

export default reducer;
