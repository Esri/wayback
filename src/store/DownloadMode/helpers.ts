import { DownloadJob } from './reducer';

const TEMP_NEW_DOWNLOAD_JOB_SESSION_STORAGE_KEY = 'wayback_new_download_job';

/**
 * This helper function saves the new download job that is being created to session storage,
 * This happens when the user is not signed in and creates a new download job, we want to save the job to session storage so that when the user signs in and comes back to the app,
 * we can restore the job they were creating instead of losing all the information they have inputed and making them start from scratch on creating a new job after signing in.
 * @param job
 */
export const saveNewDownloadJobToSessionStorage = (job: DownloadJob) => {
    sessionStorage.setItem(
        TEMP_NEW_DOWNLOAD_JOB_SESSION_STORAGE_KEY,
        JSON.stringify(job)
    );
};

/**
 * This helper function retrieves the new download job that is being created from session storage.
 * It also assigns the userId to the job since the job is created when the user is not signed in,
 * we need to assign the userId to the job after the user signs in and we retrieve the job from session storage, so that when we create the job in the backend, we can associate the job with the correct user.
 * @returns
 */
export const getNewDownloadJobFromSessionStorage = (
    userId: string
): DownloadJob | null => {
    const jobString = sessionStorage.getItem(
        TEMP_NEW_DOWNLOAD_JOB_SESSION_STORAGE_KEY
    );

    // clean up the session storage after retrieving the job since we only want to restore the job once after the user signs in,
    // if we keep the job in session storage, it will keep restoring the same job every time the user refreshes the page or comes back to the app
    sessionStorage.removeItem(TEMP_NEW_DOWNLOAD_JOB_SESSION_STORAGE_KEY);

    // if not signed in or userId is not available, we should not retrieve the job from session storage since we won't be able to associate the job with the correct user when creating the job in the backend
    if (!userId) {
        return null;
    }

    let job: DownloadJob | null = null;

    if (jobString) {
        try {
            job = JSON.parse(jobString);
        } catch (error) {
            console.error(
                'Error parsing new download job from session storage: ',
                error
            );
        }
    }

    if (!job) {
        return null;
    }

    // assign the userId to the job before returning it, since the job is created when the user is not signed in,
    // we need to assign the userId to the job after the user signs in and we retrieve the job from session storage, so that when we create the job in the backend, we can associate the job with the correct user.
    return {
        ...job,
        userId,
    };
};
