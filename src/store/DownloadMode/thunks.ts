import { IExtent } from '@esri/arcgis-rest-request';
import { StoreDispatch, StoreGetState } from '../configureStore';
import { batch } from 'react-redux';
import {
    DownloadJob,
    downloadJobCreated,
    isDownloadDialogOpenToggled,
} from './reducer';
import { generate } from 'shortid';

type AddToDownloadListParams = {
    releaseNum: number;
    zoomLevel: number;
    extent: IExtent;
};

export const addToDownloadList =
    ({ releaseNum, zoomLevel, extent }: AddToDownloadListParams) =>
    (dispatch: StoreDispatch, getState: StoreGetState) => {
        // console.log(waybackItem, zoomLevel, extent);

        const { WaybackItems } = getState();

        const { byReleaseNumber } = WaybackItems;

        const downloadJob: DownloadJob = {
            id: generate(),
            waybackItem: byReleaseNumber[releaseNum],
            minZoomLevel: zoomLevel,
            maxZoomLevel: zoomLevel + 5,
            levels: [zoomLevel, zoomLevel],
            extent,
            status: 'not started',
            createdTime: new Date().getTime(),
        };

        batch(() => {
            dispatch(downloadJobCreated(downloadJob));
            dispatch(isDownloadDialogOpenToggled());
        });
    };
