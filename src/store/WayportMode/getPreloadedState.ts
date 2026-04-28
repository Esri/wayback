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

import { wayportJobsStore } from '@utils/wayportJobsStore';
import {
    WayportJob,
    WayportModeState,
    initialWayportModeState,
} from './reducer';
import { getSignedInUser } from '@utils/Esri-OAuth';

/**
 * Cutoff time in hours for considering download jobs as outdated.
 * Jobs in 'not started' status are retained for this duration before being deleted,
 * allowing users to return and start their jobs without premature removal.
 */
const CUTOFF_IN_HOURS_FOR_OUTDATED_JOBS = 2;

/**
 * This function gets the preloaded state for DownloadMode by querying the IndexedDB for download jobs created by the current signed in user.
 * If no signed in user is found, or if there's an error during the IndexedDB query, it returns the initial state with an empty list of jobs.
 *
 * @returns A promise that resolves to the preloaded state for DownloadMode
 */
export const getPreloadedState4Wayportmode =
    async (): Promise<WayportModeState> => {
        // get the signed in user information, which will be used to query the IndexedDB for download jobs created by this user.
        // If no signed in user is found, we will return the initial state with empty jobs.
        const signedInUser = getSignedInUser();

        const userId = signedInUser?.username;

        if (!userId) {
            console.warn(
                'No signed in user found. DownloadMode will be initialized with empty state.'
            );
            return initialWayportModeState;
        }

        try {
            // Clear out outdated jobs for this user before getting the jobs from IndexedDB. This ensures that we don't show outdated jobs in the UI.
            await wayportJobsStore.clearOutdatedJobs(
                userId,
                CUTOFF_IN_HOURS_FOR_OUTDATED_JOBS
            );

            const jobs: WayportJob[] =
                await wayportJobsStore.getJobsByUserId(userId);

            const byId: { [key: string]: WayportJob } = {};
            const ids: string[] = [];

            let idOfJobBeingCreated: string | null = null;

            for (const job of jobs) {
                const { id } = job;
                byId[id] = job;
                ids.push(id);

                if (job.status === 'wayport job not started') {
                    idOfJobBeingCreated = id;
                }
            }

            const state: WayportModeState = {
                ...initialWayportModeState,
                jobs: {
                    byId,
                    ids,
                },
                idOfJobBeingCreated,
            };

            return state;
        } catch (err) {
            console.error(
                'Failed to get preloaded state for DownloadMode:',
                err
            );
            return initialWayportModeState;
        }
    };
