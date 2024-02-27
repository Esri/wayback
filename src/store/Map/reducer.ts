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

export type MapCenter = {
    lon: number;
    lat: number;
};

export type MapMode = 'explore' | 'swipe' | 'animation';

export type MapState = {
    mode: MapMode;
    mapExtent: IExtentGeomety;
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
};

export const initialMapState: MapState = {
    mode: 'explore',
    mapExtent: null,
    metadataQueryResult: null,
    metadataPopupAnchor: null,
    isReferenceLayerVisible: true,
    zoom: null,
    center: null,
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
        mapCenterUpdated: (state, action: PayloadAction<MapCenter>) => {
            state.center = action.payload;
        },
        zoomUpdated: (state, action: PayloadAction<number>) => {
            state.zoom = action.payload;
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
    mapCenterUpdated,
    zoomUpdated,
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

export default reducer;
