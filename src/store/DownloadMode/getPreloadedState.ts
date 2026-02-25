import { wayportJobsStore } from '@utils/wayportJobsStore';
import {
    DownloadJob,
    DownloadModeState,
    initialDownloadModeState,
} from './reducer';
import { getSignedInUser } from '@utils/Esri-OAuth';

/**
 * This function gets the preloaded state for DownloadMode by querying the IndexedDB for download jobs created by the current signed in user.
 * If no signed in user is found, or if there's an error during the IndexedDB query, it returns the initial state with an empty list of jobs.
 *
 * @returns A promise that resolves to the preloaded state for DownloadMode
 */
export const getPreloadedState4Downloadmode =
    async (): Promise<DownloadModeState> => {
        // get the signed in user information, which will be used to query the IndexedDB for download jobs created by this user.
        // If no signed in user is found, we will return the initial state with empty jobs.
        const signedInUser = getSignedInUser();

        if (!signedInUser || !signedInUser?.username) {
            console.warn(
                'No signed in user found. DownloadMode will be initialized with empty state.'
            );
            return initialDownloadModeState;
        }

        try {
            const jobs: DownloadJob[] = await wayportJobsStore.getJobsByUserId(
                signedInUser?.username
            );
            console.log(
                `Found ${jobs.length} download jobs for user ${signedInUser.username} in IndexedDB.`
            );

            const byId: { [key: string]: DownloadJob } = {};
            const ids: string[] = [];

            let idOfSelectedJob: string | null = null;

            for (const job of jobs) {
                const { id } = job;
                byId[id] = job;
                ids.push(id);

                // if there's a job that is not started, we will set it as the selected job by default, so that its extent can be displayed on the map.
                if (job.status === 'not started' && !idOfSelectedJob) {
                    idOfSelectedJob = id;
                }
            }

            const state: DownloadModeState = {
                ...initialDownloadModeState,
                jobs: {
                    byId,
                    ids,
                },
                idOfSelectedJob,
            };

            return state;
        } catch (err) {
            console.error(
                'Failed to get preloaded state for DownloadMode:',
                err
            );
            return initialDownloadModeState;
        }
    };
