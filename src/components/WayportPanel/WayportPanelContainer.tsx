import React, { useContext } from 'react';
import { WayportIntroduction } from './WayportIntroduction';
import { AppContext } from '@contexts/AppContextProvider';
import { signIn } from '@utils/Esri-OAuth';
import { NewJobDialog } from './NewJobDialog';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import { selectNewDownloadJob } from '@store/DownloadMode/selectors';
import {
    deleteDownloadJobs,
    updateNewDownloadJob,
} from '@store/DownloadMode/thunks';

export const WayportPanelContainer = () => {
    const dispatch = useAppDispatch();

    const { notSignedIn, signedInWithArcGISPublicAccount } =
        useContext(AppContext);

    // determine if the panel should be disabled or not
    const disabled = notSignedIn || signedInWithArcGISPublicAccount;

    const newDownloadJob = useAppSelector(selectNewDownloadJob);

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
                disabled={disabled}
                job={newDownloadJob}
                onRemove={(job) => {
                    dispatch(deleteDownloadJobs([job]));
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
            />
        </div>
    );
};
