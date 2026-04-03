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

import { StoreDispatch, StoreGetState } from '../configureStore';
import { selectWayportJobById } from './selectors';
// import { isDownloadDialogOpenToggled } from '@store/UI/reducer';
import { getSignedInUser, getToken, signIn } from '@utils/Esri-OAuth';
import { getDataToUpdateTilesOfWayportTileLayer } from './helpers';
import {
    addTilePackageItem,
    checkItemProcessingStatus,
} from '@services/hosted-tile-layer/addTilePackageItem';
import { ARCGIS_PROTAL_ROOT } from '@constants/index';
import {
    publishTiledLayer,
    updatePublishedTileLayer,
} from '@services/hosted-tile-layer/publishTiledLayer';
import {
    checkUpdateTilesStatus,
    updateTiles,
} from '@services/hosted-tile-layer/updateTiles';
import { updateWayportJob } from './thunks';

type AddTilePackageItemParams = {
    jobId: string;
    token: string;
    portalRoot: string;
};

/**
 * Redux thunk that creates a tile package item in ArcGIS and updates the
 * associated Wayport job with the resulting item ID.
 *
 * Steps:
 * 1. Looks up the job by `jobId` from the store.
 * 2. Sets the job status to `'publishing job adding tile package'`.
 * 3. Calls `createTilePackageItemAndWaitForCompletion` using the output tile
 *    package URL (prefers `alternativeUrl` if available).
 * 4. Stores the returned item ID on the job as `wayportTilePackageItemId`.
 *
 * @param params - Parameters required to add the tile package item.
 * @param params.jobId - ID of the Wayport job to publish.
 * @param params.token - ArcGIS authentication token.
 * @param params.username - Username of the signed-in ArcGIS account.
 * @param params.portalRoot - Root URL of the ArcGIS portal.
 * @throws {Error} If no `outputTilePackageInfo` is found on the job.
 */
export const addTilePackageItemThunk =
    ({ jobId, token, portalRoot }: AddTilePackageItemParams) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const jobToBePublished = selectWayportJobById(getState(), jobId);

        const { outputTilePackageInfo, waybackItem } = jobToBePublished || {};

        try {
            if (!outputTilePackageInfo) {
                throw new Error(
                    'No output tile package info found for job ' +
                        jobToBePublished.id
                );
            }

            // update the job status to indicate the publishing process has started, so that the UI can show a loading status for the job while the tile package item is being created
            await dispatch(
                updateWayportJob({
                    jobId: jobToBePublished.id,
                    partialJobData: {
                        status: 'publishing job waiting to start',
                    },
                })
            );

            const tilePackageUrl =
                outputTilePackageInfo.alternativeUrl ||
                outputTilePackageInfo.url;

            // before adding the tile package item, make a request to the tile package url to make sure the tile package is still available,
            // since the tile package can expire one hour after it is generated. If the tile package is no longer available.
            const res = await fetch(tilePackageUrl, {
                method: 'HEAD',
            });

            if (!res.ok) {
                throw new Error(
                    `Failed to access tile package url. Server responded with status ${res.status}: ${res.statusText}`
                );
            }

            const addItemResponse = await addTilePackageItem({
                dataUrl:
                    outputTilePackageInfo.alternativeUrl ||
                    outputTilePackageInfo.url,
                title: `Wayback Tile Package - ${waybackItem.releaseDateLabel}`,
                username: jobToBePublished.userId,
                portalRoot,
                token,
            });

            const tilePackageItemId = addItemResponse.id;

            await dispatch(
                updateWayportJob({
                    jobId: jobToBePublished.id,
                    partialJobData: {
                        status: 'publishing job adding tile package',
                        wayportTilePackageItemId: tilePackageItemId,
                    },
                })
            );
        } catch (err) {
            console.error(
                'Failed to add tile package item for job with id of %s. Error: ',
                jobId,
                err
            );

            await dispatch(
                updateWayportJob({
                    jobId: jobToBePublished.id,
                    partialJobData: {
                        status: 'publishing job failed',
                        errorCaughtWhilePublishWayportTileLayer:
                            err instanceof Error
                                ? err.message
                                : 'Unknown error',
                    },
                })
            );
        }
    };

type WaitTilePackageIsReadyToPublishParams = {
    jobId: string;
    token: string;
    portalRoot: string;
};

export const waitTilePackageIsReadyToPublishThunk =
    ({ jobId, token, portalRoot }: WaitTilePackageIsReadyToPublishParams) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const jobData = selectWayportJobById(getState(), jobId);

        try {
            if (!jobData) {
                throw new Error('cannot find job data with job id of ' + jobId);
            }

            if (jobData.status !== 'publishing job adding tile package') {
                throw new Error(
                    `Job with id of ${jobId} is in status of ${jobData.status}, should only wait for tile package to be ready for publishing when the job status is "adding tile package"`
                );
            }

            const tilePackageItemId = jobData.wayportTilePackageItemId;

            if (!tilePackageItemId) {
                throw new Error(
                    'No tile package item id found for job with id of ' + jobId
                );
            }

            const processingStatusResponse = await checkItemProcessingStatus({
                itemId: tilePackageItemId,
                token,
                portalRoot,
                userId: jobData.userId,
            });

            if (processingStatusResponse.status === 'completed') {
                await dispatch(
                    updateWayportJob({
                        jobId: jobData.id,
                        partialJobData: {
                            status: 'publishing job added tile package',
                        },
                    })
                );
            } else if (processingStatusResponse.status === 'failed') {
                throw new Error(
                    `Tile package item processing failed for item id: ${tilePackageItemId}`
                );
            } else {
                console.log(
                    `Tile package item with id of ${tilePackageItemId} is still processing with status of ${processingStatusResponse.status}`
                );
            }
        } catch (err) {
            console.error(
                'Error while waiting for tile package to be ready for publishing for job with id of %s. Error: ',
                jobId,
                err
            );

            await dispatch(
                updateWayportJob({
                    jobId: jobData.id,
                    partialJobData: {
                        status: 'publishing job failed',
                        errorCaughtWhilePublishWayportTileLayer:
                            err instanceof Error
                                ? err.message
                                : 'Unknown error',
                    },
                })
            );
        }
    };

type PublishTileLayerParams = {
    jobId: string;
    token: string;
    portalRoot: string;
};

/**
 * Redux thunk that publishes a hosted tile layer from a previously created
 * tile package item and updates the associated Wayport job with the resulting
 * service information.
 *
 * Steps:
 * 1. Looks up the job by `jobId` from the store and validates that a
 *    `wayportTilePackageItemId` exists and the job is in the expected status.
 * 2. Sets the job status to `'publishing job adding tile layer'`.
 * 3. Calls `publishTiledLayer` to publish the tile package as a hosted tile layer.
 * 4. Stores the returned `serviceItemId` and `serviceurl` on the job.
 * 5. Calls `updatePublishedTileLayer` to update the service item's metadata.
 *
 * @param params - Parameters required to publish the tile layer.
 * @param params.jobId - ID of the Wayport job to publish.
 * @param params.token - ArcGIS authentication token.
 * @param params.username - Username of the signed-in ArcGIS account.
 * @param params.portalRoot - Root URL of the ArcGIS portal.
 * @throws {Error} If the job is not found, has no tile package item ID, is not
 *   in the expected status, or if the publish response is invalid.
 */
export const publishTileLayerThunk =
    ({ jobId, token, portalRoot }: PublishTileLayerParams) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const jobToBePublished = selectWayportJobById(getState(), jobId);

        try {
            if (!jobToBePublished) {
                throw new Error('cannot find job data with job id of ' + jobId);
            }

            const tilePackageItemId = jobToBePublished.wayportTilePackageItemId;

            if (!tilePackageItemId) {
                throw new Error(
                    'No tile package item id found for job with id of ' + jobId
                );
            }

            if (
                jobToBePublished.status !== 'publishing job added tile package'
            ) {
                throw new Error(
                    `Job with id of ${jobId} is in status of ${jobToBePublished.status}, cannot publish tile layer until the tile package item is added and ready`
                );
            }

            const serviceResult = await publishTiledLayer({
                itemId: tilePackageItemId,
                token,
                username: jobToBePublished.userId,
                portalRoot,
                wayportJobId: jobId,
            });

            if (
                !serviceResult ||
                !serviceResult.serviceItemId ||
                !serviceResult.serviceurl
            ) {
                throw new Error(
                    'Invalid publish service result for job with id of ' + jobId
                );
            }

            await dispatch(
                updateWayportJob({
                    jobId: jobToBePublished.id,
                    partialJobData: {
                        status: 'publishing job added tile layer',
                        wayportTileLayerServiceItemId:
                            serviceResult.serviceItemId,
                        wayportTileLayerServiceUrl: serviceResult.serviceurl,
                    },
                })
            );

            // after the service is published successfully, call update API to update the item information of the published service item
            // to make it easier for users to identify the service item in their content
            await updatePublishedTileLayer({
                serviceItemId: serviceResult.serviceItemId,
                token,
                portalRoot: ARCGIS_PROTAL_ROOT,
                wayprotJob: jobToBePublished,
            });
        } catch (err) {
            console.error(
                'Failed to publish tile layer for job with id of %s. Error: ',
                jobId,
                err
            );

            await dispatch(
                updateWayportJob({
                    jobId: jobToBePublished.id,
                    partialJobData: {
                        status: 'publishing job failed',
                        errorCaughtWhilePublishWayportTileLayer:
                            err instanceof Error
                                ? err.message
                                : 'Unknown error',
                    },
                })
            );
        }
    };

type UpdateTilesOfWayportTileLayerParams = {
    jobId: string;
    token: string;
};

/**
 * Redux thunk that triggers a tile update operation on a previously published
 * Wayport hosted tile layer
 *
 * @param params - Parameters required to update the tiles.
 * @param params.jobId - ID of the Wayport job whose tile layer should be updated.
 * @param params.token - ArcGIS authentication token.
 * @throws {Error} If the job is not found.
 */
export const updateTilesOfWayportTileLayerThunk =
    ({ jobId, token }: UpdateTilesOfWayportTileLayerParams) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const jobToBePublished = selectWayportJobById(getState(), jobId);

        try {
            if (!jobToBePublished) {
                throw new Error('cannot find job data with job id of ' + jobId);
            }

            if (jobToBePublished.status !== 'publishing job added tile layer') {
                throw new Error(
                    `Job with id of ${jobId} is in status of ${jobToBePublished.status}, cannot update tiles until the tile layer is published successfully`
                );
            }

            const { wayportTileLayerServiceUrl } = jobToBePublished;

            const { fullLevelList, extentInWebMercator } =
                getDataToUpdateTilesOfWayportTileLayer(jobToBePublished);

            const res = await updateTiles({
                serviceUrl: wayportTileLayerServiceUrl,
                token,
                levels: fullLevelList,
                extent: extentInWebMercator,
            });

            if (res.status !== 'success') {
                throw new Error(
                    `Failed to update tiles for tile layer with service url of ${wayportTileLayerServiceUrl}. Update tiles API responded with status of ${res.status} and error message of ${res.error?.message}`
                );
            }

            // await updateTilesAndWaitForCompletion({
            //     serviceUrl: wayportTileLayerServiceUrl,
            //     token,
            //     levels: fullLevelList,
            //     extent: extentInWebMercator,
            // });

            await dispatch(
                updateWayportJob({
                    jobId: jobToBePublished.id,
                    partialJobData: {
                        // status: 'publishing job finished',
                        status: 'publishing job updating tiles',
                    },
                })
            );
        } catch (err) {
            console.error(
                'Failed to update tiles of tile layer for job with id of %s. Error: ',
                jobId,
                err
            );

            await dispatch(
                updateWayportJob({
                    jobId: jobToBePublished.id,
                    partialJobData: {
                        status: 'publishing job failed',
                        errorCaughtWhilePublishWayportTileLayer:
                            err instanceof Error
                                ? err.message
                                : 'Unknown error',
                    },
                })
            );
        }
    };

type CheckUpdateTilesStatusParams = {
    jobId: string;
    token: string;
};

export const checkUpdateTilesStatusThunk =
    ({ jobId, token }: CheckUpdateTilesStatusParams) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        const job = selectWayportJobById(getState(), jobId);

        try {
            if (!job) {
                throw new Error(
                    `Cannot find job with id of ${jobId} to check update tiles status`
                );
            }

            if (job.status !== 'publishing job updating tiles') {
                throw new Error(
                    `Job with id of ${jobId} is in status of ${job.status}, should only check update tiles status when the job status is "updating tiles"`
                );
            }

            const serviceUrl = job.wayportTileLayerServiceUrl;

            if (!serviceUrl) {
                throw new Error(
                    `No service url found for job with id of ${jobId} to check update tiles status`
                );
            }

            const isUpdating = await checkUpdateTilesStatus({
                serviceUrl,
                token,
            });

            // if the update tiles operation is still in progress, do nothing and keep waiting; if the update tiles operation has completed, then mark the job as finished
            if (isUpdating) {
                return;
            }

            await dispatch(
                updateWayportJob({
                    jobId: job.id,
                    partialJobData: {
                        status: 'publishing job finished',
                    },
                })
            );
        } catch (err) {
            console.error(
                `Failed to check update tiles status for job ${jobId}. Error: `,
                err
            );

            await dispatch(
                updateWayportJob({
                    jobId: job.id,
                    partialJobData: {
                        status: 'publishing job failed',
                        errorCaughtWhilePublishWayportTileLayer:
                            err instanceof Error
                                ? err.message
                                : 'Unknown error',
                    },
                })
            );
        }
    };

export const publishWayportTilePackageAsTileLayer =
    (jobId: string) =>
    async (dispatch: StoreDispatch, getState: StoreGetState) => {
        // console.log('Publishing tile layer for job with id: ', jobId);

        const jobToBePublished = selectWayportJobById(getState(), jobId);

        if (!jobToBePublished) {
            console.error('cannot find job data with job id of %s', jobId);
            return;
        }

        // get the token to publish tile layer
        const token = getToken();
        if (!token) {
            console.error(
                'No token found, cannot publish tile layer for job with id of %s',
                jobId
            );
            return;
        }

        try {
            // step 1: add tile package item and wait for the item to be created successfully
            await dispatch(
                addTilePackageItemThunk({
                    jobId,
                    token,
                    portalRoot: ARCGIS_PROTAL_ROOT,
                })
            );

            // step 1.1 need to wait for the tile package item to be ready before publishing the tile layer,
            // otherwise the publish operation will likely fail due to the item still being processed and not ready yet.
            const maxWaitTimeInMs = 10 * 60 * 1000; // 10 minute
            const checkIntervalInMs = 30 * 1000; // 30 seconds
            const startTime = Date.now();
            let isTilePackageReady = false;

            while (true) {
                const elapsedTime = Date.now() - startTime;

                if (elapsedTime > maxWaitTimeInMs) {
                    break;
                }

                await new Promise((resolve) =>
                    setTimeout(resolve, checkIntervalInMs)
                );

                await dispatch(
                    waitTilePackageIsReadyToPublishThunk({
                        jobId,
                        token,
                        portalRoot: ARCGIS_PROTAL_ROOT,
                    })
                );

                const updatedJobData = selectWayportJobById(getState(), jobId);

                if (
                    updatedJobData.status ===
                    'publishing job added tile package'
                ) {
                    isTilePackageReady = true;
                    break;
                }
            }

            if (!isTilePackageReady) {
                throw new Error(
                    'Tile package item is not ready for publishing after waiting for 1 minute'
                );
            }

            // step 2: publish tile layer from the created tile package item, and update the job with the published service information
            await dispatch(
                publishTileLayerThunk({
                    jobId,
                    token,
                    portalRoot: ARCGIS_PROTAL_ROOT,
                })
            );

            // step 3: call update tiles API to update the tiles of the published tile layer, and wait for the update operation to be completed before marking the job as completely finished
            await dispatch(
                updateTilesOfWayportTileLayerThunk({
                    jobId,
                    token,
                })
            );

            // step 4: wait for update tiles operation to be completed, then mark the job as completely finished
            const maxWaitTimeInMsForUpdateTiles = 30 * 60 * 1000; // 30 minutes
            const checkIntervalInMsForUpdateTiles = 30 * 1000; // 30 seconds
            const startTimeForUpdateTiles = Date.now();

            while (true) {
                const elapsedTime = Date.now() - startTimeForUpdateTiles;

                if (elapsedTime > maxWaitTimeInMsForUpdateTiles) {
                    break;
                }

                await new Promise((resolve) =>
                    setTimeout(resolve, checkIntervalInMsForUpdateTiles)
                );

                await dispatch(
                    checkUpdateTilesStatusThunk({
                        jobId,
                        token,
                    })
                );

                const updatedJobData = selectWayportJobById(getState(), jobId);

                if (updatedJobData.status !== 'publishing job updating tiles') {
                    break;
                }

                if (
                    Date.now() - startTimeForUpdateTiles >
                    maxWaitTimeInMsForUpdateTiles
                ) {
                    throw new Error(
                        'Update tiles operation is not completed after waiting for 30 minutes'
                    );
                }
            }
        } catch (err) {
            console.error(
                'Failed to publish tile layer for job with id of %s. Error: ',
                jobId,
                err
            );

            dispatch(
                updateWayportJob({
                    jobId: jobToBePublished.id,
                    partialJobData: {
                        status: 'publishing job failed',
                        wayportTileLayerServiceItemId: undefined,
                        wayportTileLayerServiceUrl: undefined,
                        errorCaughtWhilePublishWayportTileLayer:
                            err instanceof Error
                                ? err.message
                                : 'Unknown error',
                    },
                })
            );
        }
    };
