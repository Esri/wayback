import { IExtent } from '@typings/index';
import { DownloadJob, DownloadJobProgressInfo } from './reducer';
import { Extent } from '@arcgis/core/geometry';
import { CheckJobStatusResponse } from '@services/wayport/wayportGPService';

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
export const getNewDownloadJobFromSessionStorage = (): DownloadJob | null => {
    const jobString = sessionStorage.getItem(
        TEMP_NEW_DOWNLOAD_JOB_SESSION_STORAGE_KEY
    );
    // console.log('retrieving new download job from session storage: ', jobString);

    // clean up the session storage after retrieving the job since we only want to restore the job once after the user signs in,
    // if we keep the job in session storage, it will keep restoring the same job every time the user refreshes the page or comes back to the app
    sessionStorage.removeItem(TEMP_NEW_DOWNLOAD_JOB_SESSION_STORAGE_KEY);

    let job: DownloadJob | null = null;

    if (jobString) {
        try {
            job = JSON.parse(jobString);
            console.log('parsed new download job from session storage: ', job);
        } catch (error) {
            console.error(
                'Error parsing new download job from session storage: ',
                error
            );
        }
    }

    return job;
};

/**
 * Normalizes an extent by scaling it inward by 25%.
 *
 * This function takes a map extent and shrinks it to 75% of its original size,
 * effectively creating a normalized/adjusted extent. This is useful to ensure
 * the user can see the entire extent in the sketch view model without the extent being too close to the edges of the view.
 *
 * @param inputExtent - The extent object to normalize
 * @param scaleFactor - The factor by which to scale the extent inward (default is 0.75 for 75% of original size)
 * @returns A new extent scaled inward by 25% (75% of original size) with the same spatial reference
 */
export const normalizeExtent = (
    inputExtent: IExtent,
    scaleFactor = 0.75
): IExtent => {
    // const scaleFactor = 0.75;

    const extentObj = new Extent({
        xmin: inputExtent.xmin,
        ymin: inputExtent.ymin,
        xmax: inputExtent.xmax,
        ymax: inputExtent.ymax,
        spatialReference: inputExtent.spatialReference,
    });

    const normalizedExtent = extentObj.expand(scaleFactor);

    return normalizedExtent.toJSON() as IExtent;
};
