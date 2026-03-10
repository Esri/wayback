import React, { use, useContext } from 'react';
import { WayportIntroduction } from './WayportIntroduction';
import { AppContext } from '@contexts/AppContextProvider';
import { signIn } from '@utils/Esri-OAuth';
import { NewJobDialog } from './NewJobDialog';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    selectDownloadJobsThatHaveBeenStarted,
    selectNewDownloadJob,
} from '@store/DownloadMode/selectors';
import {
    deleteDownloadJobs,
    downloadOutputTilePackage,
    initiateNewDownloadJob,
    startDownloadJob,
    updateIdOfWayportJobToShowExtentOnMap,
    updateNewDownloadJob,
} from '@store/DownloadMode/thunks';
import { JobsList } from './JobsList';
import { activeWaybackItemSelector } from '@store/Wayback/reducer';
import { IWaybackItem } from '@typings/index';
import { mapExtentSelector } from '@store/Map/reducer';
import { release } from 'os';
import { timestampOfZoomToDownloadJobExtentRequestUpdated } from '@store/DownloadMode/reducer';

export const WayportPanelContainer = () => {
    const dispatch = useAppDispatch();

    const { notSignedIn, signedInWithArcGISPublicAccount } =
        useContext(AppContext);

    const activeWaybackItem: IWaybackItem = useAppSelector(
        activeWaybackItemSelector
    );

    const mapExtent = useAppSelector(mapExtentSelector);

    const newDownloadJob = useAppSelector(selectNewDownloadJob);

    const jobsHasStarted = useAppSelector(
        selectDownloadJobsThatHaveBeenStarted
    );

    const idOfJobToShowExtentOnMap = useAppSelector(
        (state) => state.DownloadMode.idOfJobToShowExtentOnMap
    );

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
                    dispatch(deleteDownloadJobs([job]));
                }}
                onSubmit={(job) => {
                    // console.log('create new download job with state: ', job);
                    dispatch(startDownloadJob());
                }}
                levelsOnChange={(minZoom, maxZoom) => {
                    // console.log('Updating job levels to: ', minZoom, maxZoom);
                    // update the levels in the job state
                    // we can directly dispatch the action here since the state update is simple and doesn't require any async operations
                    dispatch(
                        updateNewDownloadJob({
                            levels: [minZoom, maxZoom],
                        })
                    );
                }}
                onInitiateNewJob={() => {
                    // // console.log('User initiates to create a new job for the current map extent and selected zoom levels');
                    dispatch(
                        initiateNewDownloadJob({
                            releaseNum: activeWaybackItem.releaseNum,
                            extent: mapExtent,
                        })
                    );
                }}
                onZoomToExtentRequested={() => {
                    // console.log('User requests to zoom to the job extent on the map, this will trigger the map to zoom to the job extent');
                    dispatch(
                        timestampOfZoomToDownloadJobExtentRequestUpdated(
                            Date.now()
                        )
                    );
                }}
            />

            <JobsList
                jobs={jobsHasStarted}
                idOfJobToShowExtentOnMap={idOfJobToShowExtentOnMap}
                shouldDisableZoomToButton={!!newDownloadJob} // disable zoom to button when there is a job that has not been started, to avoid confusion about whether user should click the create button for the new job or zoom to the existing job
                onRemove={(job) => {
                    dispatch(deleteDownloadJobs([job]));
                }}
                onZoomTo={(job) => {
                    // zoom to the job's extent in the map
                    dispatch(updateIdOfWayportJobToShowExtentOnMap(job.id));
                }}
                downlaodTilePackageButtonOnClick={(jobId) => {
                    // console.log('Download tile package for job with id: ', jobId);
                    dispatch(downloadOutputTilePackage(jobId));
                }}
            />
        </div>
    );
};
