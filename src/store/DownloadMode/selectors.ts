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

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

// export const selectIsDownloadDialogOpen = (state: RootState) =>
//     state.DownloadMode.isDownloadDialogOpen;

// export const selectIsAddingNewDownloadJob = (state: RootState) =>
//     state.DownloadMode.isAddingNewDownloadJob;

export const selectNewDownloadJob = createSelector(
    (state: RootState) => state.DownloadMode.jobs,
    (state: RootState) => state.DownloadMode.idOfJobBeingCreated,
    (jobs, idOfJobBeingCreated) => {
        const { byId } = jobs;
        return idOfJobBeingCreated ? byId[idOfJobBeingCreated] : null;
    }
);

/**
 * Selects stale download jobs that should be cleared from the store.
 * A job is considered stale if its status is still 'not started' and it is
 * not the job currently being created by the user.
 */
export const selectStaleDownloadJobs = createSelector(
    (state: RootState) => state.DownloadMode.jobs,
    (state: RootState) => state.DownloadMode.idOfJobBeingCreated,
    (jobs, idOfJobBeingCreated) => {
        const { byId, ids } = jobs;

        const staleDownloadJobIds = ids.filter((id) => {
            return (
                byId[id].status === 'not started' && id !== idOfJobBeingCreated
            );
        });

        const staleDownloadJobs = staleDownloadJobIds.map((id) => byId[id]);

        return staleDownloadJobs;
    }
);

export const selectDownloadJobs = createSelector(
    (state: RootState) => state.DownloadMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;
        return ids.map((id) => byId[id]);
    }
);

export const selectNumOfDownloadJobs = createSelector(
    (state: RootState) => state.DownloadMode.jobs,
    (jobs) => jobs.ids.length
);

export const selectHasReachedLimitOfConcurrentDownloadJobs = createSelector(
    (state: RootState) => state.DownloadMode.jobs,
    (jobs) => jobs.ids.length >= 5
);

export const selectNumOfPendingDownloadJobs = createSelector(
    (state: RootState) => state.DownloadMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        return ids.filter((id) => byId[id].status === 'pending').length;
    }
);

export const selectNumOfFinishedDownloadJobs = createSelector(
    (state: RootState) => state.DownloadMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        return ids.filter((id) => {
            const { status } = byId[id];
            return status !== 'not started' && status !== 'pending'; //byId[id].status === 'finished' || byId[id].status === 'downloaded' || byId[id].status === 'downloading' || byId[id].status === 'failed' ||
        }).length;
    }
);

export const selectPendingDownloadJobs = createSelector(
    (state: RootState) => state.DownloadMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const idOfPendingJobs = ids.filter(
            (id) => byId[id].status === 'pending'
        );

        return idOfPendingJobs.map((id) => byId[id]);
    }
);

// export const selectDownloadJobToDisplayOnMap = createSelector(
//     (state: RootState) => state.DownloadMode.jobs,
//     (state: RootState) => state.DownloadMode.idOfSelectedJob,
//     (jobs, idOfSelectedJob) => {
//         if (!idOfSelectedJob) return null;
//         return jobs.byId[idOfSelectedJob];
//     }
// );
