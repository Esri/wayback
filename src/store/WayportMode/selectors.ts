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
//     state.WayportMode.isDownloadDialogOpen;

// export const selectIsAddingNewDownloadJob = (state: RootState) =>
//     state.WayportMode.isAddingNewDownloadJob;

export const selectNewDownloadJob = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (state: RootState) => state.WayportMode.idOfJobBeingCreated,
    (jobs, idOfJobBeingCreated) => {
        const { byId } = jobs;
        const newDownloadJob = idOfJobBeingCreated
            ? byId[idOfJobBeingCreated]
            : null;

        if (!newDownloadJob || newDownloadJob.status !== 'not started') {
            return null;
        }

        return newDownloadJob;
    }
);

/**
 * Selects stale download jobs that should be cleared from the store.
 * A job is considered stale if its status is still 'not started' and it is
 * not the job currently being created by the user.
 */
export const selectStaleDownloadJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (state: RootState) => state.WayportMode.idOfJobBeingCreated,
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

// export const selectDownloadJobs = createSelector(
//     (state: RootState) => state.WayportMode.jobs,
//     (jobs) => {
//         const { byId, ids } = jobs;
//         return ids.map((id) => byId[id]);
//     }
// );

export const selectDownloadJobById = (state: RootState, id: string) =>
    state.WayportMode.jobs.byId[id];

export const selectNumOfDownloadJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => jobs.ids.length
);

export const selectNumOfPendingDownloadJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        return ids.filter((id) => byId[id].status === 'pending').length;
    }
);

export const selectHasReachedLimitOfConcurrentDownloadJobs = createSelector(
    selectNumOfPendingDownloadJobs,
    (numOfPendingJobs) => numOfPendingJobs >= 5
);

export const selectFinishedDownloadJobsWithoutPackageInfo = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const finishedDownloadJobIds = ids.filter((id) => {
            const { status } = byId[id] || {};
            return (
                status === 'finished' &&
                byId[id].outputTilePackageInfo === undefined
            );
        });

        const finishedDownloadJobs = finishedDownloadJobIds.map(
            (id) => byId[id]
        );

        return finishedDownloadJobs;
    }
);

export const selectNumOfFinishedDownloadJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        return ids.filter((id) => {
            const { status } = byId[id];
            return status === 'finished' || status === 'downloaded';
        }).length;
    }
);

export const selectPendingDownloadJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const idOfPendingJobs = ids.filter(
            (id) => byId[id].status === 'pending'
        );

        return idOfPendingJobs.map((id) => byId[id]);
    }
);

export const selectDownloadJobsThatHaveBeenStarted = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const idOfStartedJobs = ids.filter(
            (id) => byId[id].status !== 'not started'
        );

        return idOfStartedJobs.map((id) => byId[id]);
    }
);

export const selectDownloadJobsThatHaveFinished = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const idOfFinishedJobs = ids.filter((id) => {
            const { status } = byId[id];
            return (
                status === 'finished' ||
                status === 'downloaded' ||
                status === 'failed'
            );
        });

        return idOfFinishedJobs.map((id) => byId[id]);
    }
);

export const selectDownloadJobToShowExtentOnMap = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (state: RootState) => state.WayportMode.idOfJobToShowExtentOnMap,
    (jobs, idOfJobToShowExtentOnMap) => {
        if (!idOfJobToShowExtentOnMap) return null;
        return jobs.byId[idOfJobToShowExtentOnMap];
    }
);

export const selectTimestampOfZoomToDownloadJobExtentRequest = (
    state: RootState
) => state.WayportMode.timestampOfZoomToDownloadJobExtentRequest;

export const selectIdOfJobToShowExtentOnMap = (state: RootState) =>
    state.WayportMode.idOfJobToShowExtentOnMap;
