import React, { use, useContext } from 'react';
import { WayportIntroduction } from './WayportIntroduction';
import { AppContext } from '@contexts/AppContextProvider';
import { getPortalBaseUrl, signIn } from '@utils/Esri-OAuth';
import { NewJobDialog } from './NewJobDialog';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    selectWayportJobsThatHaveBeenStarted,
    selectIdOfJobToShowExtentOnMap,
    selectNewWayportJob,
} from '@store/WayportMode/selectors';
import {
    deleteWayportJobs,
    // downloadOutputTilePackage,
    initiateNewWayportJob,
    // publishWayportTilePackageAsTileLayer,
    startWayportJob,
    updateIdOfWayportJobToShowExtentOnMap,
    updateNewWayportJob,
    updateWayportJob,
    // updateWayportJobStatus,
} from '@store/WayportMode/thunks';
import { JobsList } from './JobsList';
import { activeWaybackItemSelector } from '@store/Wayback/reducer';
import { IWaybackItem } from '@typings/index';
import { mapExtentSelector } from '@store/Map/reducer';
import { WayportJob } from '@store/WayportMode/reducer';
import { publishWayportTilePackageAsTileLayer } from '@store/WayportMode/publishTileLayerThunks';

export const WayportPanelContainer = () => {
    const dispatch = useAppDispatch();

    const { notSignedIn, signedInWithArcGISPublicAccount } =
        useContext(AppContext);

    const activeWaybackItem: IWaybackItem = useAppSelector(
        activeWaybackItemSelector
    );

    const mapExtent = useAppSelector(mapExtentSelector);

    const newDownloadJob = useAppSelector(selectNewWayportJob);

    const jobsHasStarted = useAppSelector(selectWayportJobsThatHaveBeenStarted);

    const idOfJobToShowExtentOnMap = useAppSelector(
        selectIdOfJobToShowExtentOnMap
    );

    /**
     * Download the output tile package for the given job.
     * This will open the tile package url in a new tab to trigger the download,
     * and also update the job status to "downloaded" to provide feedback
     * in the UI that the download is in progress.
     * @param job The download job for which to download the tile package.
     * @returns void
     */
    const downloadTilePackage = (job: WayportJob) => {
        // dispatch(downloadOutputTilePackage(jobId));

        if (
            !job ||
            !job?.outputTilePackageInfo ||
            !job?.outputTilePackageInfo?.url
        ) {
            console.warn('No output tile package url found for job: ', job);
            return;
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
                signInButtonOnClick={() => {
                    signIn();
                }}
            />

            <NewJobDialog
                // disabled={disabled}
                job={newDownloadJob}
                notSignedIn={notSignedIn}
                signedInUsingPublicAccount={signedInWithArcGISPublicAccount}
                activeWaybackItem={activeWaybackItem}
                onRemove={(job) => {
                    dispatch(deleteWayportJobs([job]));
                }}
                onSubmit={(job) => {
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
                onInitiateNewJob={() => {
                    // // console.log('User initiates to create a new job for the current map extent and selected zoom levels');
                    dispatch(
                        initiateNewWayportJob({
                            releaseNum: activeWaybackItem.releaseNum,
                            extent: mapExtent,
                        })
                    );
                }}
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
            />
        </div>
    );
};
