import { IExtent } from '@esri/arcgis-rest-request';
import { StoreDispatch } from '../../configureStore';
import { batch } from 'react-redux';
import { isDownloadDialogOpenToggled } from './reducer';

type AddToDownloadListParams = {
    releaseNumber: number;
    zoomLevel: number;
    extent: IExtent;
};

export const addToDownloadList =
    ({ releaseNumber, zoomLevel, extent }: AddToDownloadListParams) =>
    (
        dispatch: StoreDispatch
        // getState: StoreGetState
    ) => {
        batch(() => {
            dispatch(isDownloadDialogOpenToggled());
        });
    };
