/* Copyright 2024-2026 Esri
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

import React, { use, useContext, useMemo } from 'react';
import { WayportIntroduction } from './WayportIntroduction';
import { AppContext } from '@contexts/AppContextProvider';
import { getPortalBaseUrl, getSignedInUser, signIn } from '@utils/Esri-OAuth';
import { NewJobDialog } from './NewJobDialog';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    selectWayportJobsThatHaveBeenStarted,
    selectIdOfJobToShowExtentOnMap,
    selectNewWayportJob,
    selectIdsOfOngoingWayportJobs,
} from '@store/WayportMode/selectors';
import {
    clearStartedWayportJobs,
    deleteWayportJobs,
    removeNewWayportJob,
    // downloadOutputTilePackage,
    // initiateNewWayportJob,
    // publishWayportTilePackageAsTileLayer,
    startWayportJob,
    updateIdOfWayportJobToShowExtentOnMap,
    updateNewWayportJob,
    updateWayportJob,
    // updateWayportJobStatus,
} from '@store/WayportMode/thunks';
import { JobsList } from './JobsList';
// import { activeWaybackItemSelector } from '@store/Wayback/reducer';
// import { IWaybackItem } from '@typings/index';
// import { mapExtentSelector } from '@store/Map/reducer';
import { WayportJob } from '@store/WayportMode/reducer';
import { publishWayportTilePackageAsTileLayer } from '@store/WayportMode/publishTileLayerThunks';
import { updateMapMode } from '@store/Map/thunks';

export const WayportPanelContainer = () => {
    const dispatch = useAppDispatch();

    const { notSignedIn, signedInWithArcGISPublicAccount } =
        useContext(AppContext);

    const portalUser = getSignedInUser();

    /**
     * Determine if the user has the privileges to publish tile layers, which is required to be able to publish the exported tile package as a hosted tile layer in ArcGIS Online.
     * @see https://doc.arcgis.com/en/arcgis-online/manage-data/publish-tiles.htm
     * @see https://developers.arcgis.com/rest/users-groups-and-items/privileges/
     */
    const canPublishTileLayer = useMemo(() => {
        if (signedInWithArcGISPublicAccount || notSignedIn || !portalUser) {
            return false;
        }

        const role = portalUser?.role;

        // only allow users with admin or publisher role to publish tile layers, since publishing tile layers can consume credits, and we want to prevent users with viewer role from publishing tile layers and consuming credits without their knowledge
        if (role === 'org_admin' || role === 'org_publisher') {
            return true;
        }

        // for custom roles, check if the user has the privileges to create items and publish hosted layers,
        // since publishing tile layers requires both privileges, if the user is missing either of the privileges, they will not be able to publish tile layers
        const privileges = portalUser?.privileges || [];

        const canCreateContent = privileges.some((privilege) =>
            privilege.endsWith('createItem')
        );
        const canPublishTiles = privileges.some((privilege) =>
            privilege.endsWith('publishTiles')
        );

        return canCreateContent && canPublishTiles;
    }, [signedInWithArcGISPublicAccount, notSignedIn, portalUser]);

    // const activeWaybackItem: IWaybackItem = useAppSelector(
    //     activeWaybackItemSelector
    // );

    // const mapExtent = useAppSelector(mapExtentSelector);

    const newDownloadJob = useAppSelector(selectNewWayportJob);

    const jobsHasStarted = useAppSelector(selectWayportJobsThatHaveBeenStarted);

    const idOfJobToShowExtentOnMap = useAppSelector(
        selectIdOfJobToShowExtentOnMap
    );

    const idsOfOngoingJobs = useAppSelector(selectIdsOfOngoingWayportJobs);

    /**
     * Download the output tile package for the given job.
     * This will open the tile package url in a new tab to trigger the download,
     * and also update the job status to "downloaded" to provide feedback
     * in the UI that the download is in progress.
     * @param job The download job for which to download the tile package.
     * @returns void
     */
    const downloadTilePackage = async (job: WayportJob) => {
        // dispatch(downloadOutputTilePackage(jobId));

        if (
            !job ||
            !job?.outputTilePackageInfo ||
            !job?.outputTilePackageInfo?.url
        ) {
            console.warn('No output tile package url found for job: ', job);
            return;
        }

        try {
            // make a HEAD request to the tile package url to check if the tile package is still available
            // before triggering the download, since the tile package can expire one hour after it is generated.
            const res = await fetch(job.outputTilePackageInfo.url, {
                method: 'HEAD',
            });

            if (!res.ok) {
                throw new Error(
                    `Failed to access tile package url. Server responded with status ${res.status}: ${res.statusText}`
                );
            }

            window.open(job.outputTilePackageInfo.url, '_blank');

            // set the job status to "downloaded" immediately to provide feedback in the UI that the job is being downloaded,
            // dispatch(updateWayportJobStatus(job.id, 'wayport job downloaded'));
            dispatch(
                updateWayportJob({
                    jobId: job.id,
                    partialJobData: { status: 'wayport job downloaded' },
                })
            );
        } catch (error) {
            // console.error('Error downloading tile package: ', error);

            dispatch(
                updateWayportJob({
                    jobId: job.id,
                    partialJobData: { status: 'wayport job expired' },
                })
            );
        }
    };

    const openPublishedTileLayer = (job: WayportJob) => {
        const portalRoot = getPortalBaseUrl();

        if (!job?.wayportTileLayerServiceItemId) {
            console.warn(
                'No published tile layer item id found for job: ',
                job
            );
            return;
        }

        const itemId = job?.wayportTileLayerServiceItemId;

        const url = `${portalRoot}/home/item.html?id=${itemId}`;

        window.open(url, '_blank');
    };

    return (
        <div
            className="p-2 pb-4 flex flex-col gap-1 overflow-y-auto fancy-scrollbar"
            style={{
                maxHeight: 'calc(100vh - 60px)',
                '--calcite-button-text-color': '#fff',
            }}
        >
            <WayportIntroduction
                promptToSignIn={notSignedIn}
                promptToSignInWithOrgAccount={signedInWithArcGISPublicAccount}
                promptToSelectVersionToExport={
                    !newDownloadJob && idsOfOngoingJobs.length === 0
                } // only prompt to select a wayback item to export when there is no new download job that has not been started and there is no ongoing job, since both of these scenarios indicate that the user has not selected any wayback item to export
                signInButtonOnClick={() => {
                    signIn();
                }}
                openExploreModeButtonOnClick={() => {
                    dispatch(updateMapMode('explore'));
                }}
            />

            <NewJobDialog
                // disabled={disabled}
                job={newDownloadJob}
                notSignedIn={notSignedIn}
                signedInUsingPublicAccount={signedInWithArcGISPublicAccount}
                // activeWaybackItem={activeWaybackItem}
                onRemove={() => {
                    dispatch(removeNewWayportJob());
                }}
                onSubmit={() => {
                    // console.log('create new download job with state: ', job);
                    dispatch(startWayportJob());
                }}
                levelsOnChange={(minZoom, maxZoom) => {
                    // console.log('Updating job levels to: ', minZoom, maxZoom);
                    // update the levels in the job state
                    // we can directly dispatch the action here since the state update is simple and doesn't require any async operations
                    dispatch(
                        updateNewWayportJob({
                            levels: [minZoom, maxZoom],
                        })
                    );
                }}
                // onInitiateNewJob={() => {
                //     // // console.log('User initiates to create a new job for the current map extent and selected zoom levels');
                //     dispatch(
                //         initiateNewWayportJob({
                //             releaseNum: activeWaybackItem.releaseNum,
                //             extent: mapExtent,
                //         })
                //     );
                // }}
                // onZoomToExtentRequested={() => {
                //     // console.log('User requests to zoom to the job extent on the map, this will trigger the map to zoom to the job extent');
                //     dispatch(
                //         timestampOfZoomToDownloadJobExtentRequestUpdated(
                //             Date.now()
                //         )
                //     );
                // }}
            />

            <JobsList
                jobs={jobsHasStarted}
                notSignedIn={notSignedIn}
                canPublishTileLayer={canPublishTileLayer}
                idsOfOngoingJobs={idsOfOngoingJobs}
                idOfJobToShowExtentOnMap={idOfJobToShowExtentOnMap}
                shouldDisableZoomToButton={!!newDownloadJob} // disable zoom to button when there is a job that has not been started, to avoid confusion about whether user should click the create button for the new job or zoom to the existing job
                onRemove={(job) => {
                    dispatch(deleteWayportJobs([job]));
                }}
                onZoomTo={(job) => {
                    // zoom to the job's extent in the map
                    dispatch(updateIdOfWayportJobToShowExtentOnMap(job.id));
                }}
                downlaodTilePackageButtonOnClick={downloadTilePackage}
                publishTileLayerButtonOnClick={(jobId) => {
                    // console.log('Publish hosted tile layer for job with id: ', jobId);
                    dispatch(publishWayportTilePackageAsTileLayer(jobId));
                }}
                openPublishedTileLayerOnClick={openPublishedTileLayer}
                clearAllButtonOnClick={() => {
                    dispatch(clearStartedWayportJobs());
                }}
            />
        </div>
    );
};
