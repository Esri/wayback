import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { IExtentGeomety, IScreenPoint, IWaybackMetadataQueryResult } from '../../types';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export type MapState = {
    mapExtent: IExtentGeomety;
    metadataQueryResult: IWaybackMetadataQueryResult;
    metadataPopupAnchor: IScreenPoint;
    isReferenceLayerVisible: boolean;
};

export const initialMapState:MapState = {
    mapExtent: null,
    metadataQueryResult: null,
    metadataPopupAnchor: null,
    isReferenceLayerVisible: true
};

const slice = createSlice({
    name: 'Map',
    initialState: initialMapState,
    reducers: {
        mapExtentUpdated: (state:MapState, action:PayloadAction<IExtentGeomety>)=>{
            state.mapExtent = action.payload;
        },
        metadataQueryResultUpdated: (state:MapState, action:PayloadAction<IWaybackMetadataQueryResult>)=>{
            state.metadataQueryResult = action.payload
        },
        metadataPopupAnchorUpdated: (state:MapState, action:PayloadAction<IScreenPoint>)=>{
            state.metadataPopupAnchor = action.payload
        },
        isReferenceLayerVisibleToggled: (state:MapState)=>{
            state.isReferenceLayerVisible = !state.isReferenceLayerVisible
        }
    }
});

const { reducer } = slice;

export const {
    mapExtentUpdated,
    metadataQueryResultUpdated,
    metadataPopupAnchorUpdated,
    isReferenceLayerVisibleToggled
} = slice.actions;

export const mapExtentSelector = createSelector(
    (state: RootState) => state.Map.mapExtent,
    mapExtent=>mapExtent
)

export const isReferenceLayerVisibleSelector = createSelector(
    (state: RootState) => state.Map.isReferenceLayerVisible,
    isReferenceLayerVisible=>isReferenceLayerVisible
)

export default reducer;