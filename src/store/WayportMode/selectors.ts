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
import { se } from 'date-fns/locale';

// export const selectIsDownloadDialogOpen = (state: RootState) =>
//     state.WayportMode.isDownloadDialogOpen;

// export const selectIsAddingNewDownloadJob = (state: RootState) =>
//     state.WayportMode.isAddingNewDownloadJob;

export const selectNewWayportJob = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (state: RootState) => state.WayportMode.idOfJobBeingCreated,
    (jobs, idOfJobBeingCreated) => {
        const { byId } = jobs;
        const newDownloadJob = idOfJobBeingCreated
            ? byId[idOfJobBeingCreated]
            : null;

        if (
            !newDownloadJob ||
            newDownloadJob.status !== 'wayport job not started'
        ) {
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
export const selectStaleWayportJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (state: RootState) => state.WayportMode.idOfJobBeingCreated,
    (jobs, idOfJobBeingCreated) => {
        const { byId, ids } = jobs;

        const staleDownloadJobIds = ids.filter((id) => {
            return (
                byId[id].status === 'wayport job not started' &&
                id !== idOfJobBeingCreated
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

export const selectWayportJobById = (state: RootState, id: string) =>
    state.WayportMode.jobs.byId[id];

export const selectNumOfWayportJobsNotStarted = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        if (ids.length === 0) {
            return 0;
        }

        return ids.filter((id) => byId[id].status === 'wayport job not started')
            .length;
    }
);

export const selectNumOfDownloadJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => jobs.ids.length
);

export const selectNumOfPendingWayportJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        return ids.filter((id) => byId[id].status === 'wayport job pending')
            .length;
    }
);

// export const selectHasReachedLimitOfConcurrentWayportJobs = createSelector(
//     selectNumOfPendingWayportJobs,
//     (numOfPendingJobs) => numOfPendingJobs >= 5
// );

// export const selectFinishedWayportobsWithoutPackageInfo = createSelector(
//     (state: RootState) => state.WayportMode.jobs,
//     (jobs) => {
//         const { byId, ids } = jobs;

//         const finishedDownloadJobIds = ids.filter((id) => {
//             const { status } = byId[id] || {};
//             return (
//                 status === 'wayport job finished' &&
//                 byId[id].outputTilePackageInfo === undefined
//             );
//         });

//         const finishedDownloadJobs = finishedDownloadJobIds.map(
//             (id) => byId[id]
//         );

//         return finishedDownloadJobs;
//     }
// );

export const selectNumOfFinishedWayportJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        return ids.filter((id) => {
            const { status } = byId[id];
            return (
                status === 'wayport job downloaded' ||
                status === 'publishing job finished'
            );
        }).length;
    }
);

export const selectIdsOfOngoingWayportJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const ongoingJobIds = ids.filter((id) => {
            const { status } = byId[id];
            return (
                status !== 'wayport job not started' &&
                status !== 'wayport job failed' &&
                status !== 'wayport job downloaded' &&
                status !== 'wayport job expired' &&
                status !== 'publishing job finished' &&
                status !== 'publishing job failed'
            );
        });

        return ongoingJobIds;
    }
);

export const selectNumOfOngoingJobs = createSelector(
    selectIdsOfOngoingWayportJobs,
    (idsOfOngoingJobs) => idsOfOngoingJobs.length
);

export const selectIsThereAnyOngoingJobs = createSelector(
    selectNumOfOngoingJobs,
    (numOfOngoingJobs) => numOfOngoingJobs > 0
);

export const selectPendingWayportJobs = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const idOfPendingJobs = ids.filter(
            (id) => byId[id].status === 'wayport job pending'
        );

        return idOfPendingJobs.map((id) => byId[id]);
    }
);

export const selectWayportJobsThatHaveBeenStarted = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const idOfStartedJobs = ids.filter(
            (id) => byId[id].status !== 'wayport job not started'
        );

        return idOfStartedJobs.map((id) => byId[id]);
    }
);

export const selectWayportJobsThatHaveFinished = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const idOfFinishedJobs = ids.filter((id) => {
            const { status } = byId[id];
            return (
                status === 'wayport job finished' ||
                status === 'wayport job downloaded' ||
                status === 'wayport job failed'
            );
        });

        return idOfFinishedJobs.map((id) => byId[id]);
    }
);

export const selectWayportJobToShowExtentOnMap = createSelector(
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

export const selectWayportJobWaiting4TilePackageToBeAdded = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const tilePackageItemWaitingToBeAddedJobIds = ids.filter((id) => {
            const { status } = byId[id];
            return status === 'publishing job adding tile package';
        });

        if (tilePackageItemWaitingToBeAddedJobIds.length === 0) {
            return null;
        }

        // there should be only one job at a time in 'publishing job adding tile package' status, but in case there are multiple jobs in this status, we will just return the first one.
        const jobId = tilePackageItemWaitingToBeAddedJobIds[0];

        return byId[jobId];
    }
);

export const selectWayportJobReadyToBePublished = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const tilePackageItemReadyToBePublishedJobIds = ids.filter((id) => {
            const { status } = byId[id];
            return status === 'publishing job added tile package';
        });

        if (tilePackageItemReadyToBePublishedJobIds.length === 0) {
            return null;
        }

        // there should be only one job at a time in 'publishing job added tile package' status, but in case there are multiple jobs in this status, we will just return the first one.
        const jobId = tilePackageItemReadyToBePublishedJobIds[0];

        return byId[jobId];
    }
);

export const selectWayportJobReadyToHaveTilesUpdated = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const tileLayerReadyToHaveTilesUpdatedJobIds = ids.filter((id) => {
            const { status } = byId[id];
            return status === 'publishing job added tile layer';
        });

        if (tileLayerReadyToHaveTilesUpdatedJobIds.length === 0) {
            return null;
        }

        // there should be only one job at a time in 'publishing job added tile layer' status, but in case there are multiple jobs in this status, we will just return the first one.
        const jobId = tileLayerReadyToHaveTilesUpdatedJobIds[0];

        return byId[jobId];
    }
);

export const selectWayportJobUpdatingTiles = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const jobWaitingToHaveTilesUpdatedIds = ids.filter((id) => {
            const { status } = byId[id];
            return status === 'publishing job updating tiles';
        });

        if (jobWaitingToHaveTilesUpdatedIds.length === 0) {
            return null;
        }

        // there should be only one job at a time in 'publishing job waiting to update tiles' status, but in case there are multiple jobs in this status, we will just return the first one.
        const jobId = jobWaitingToHaveTilesUpdatedIds[0];

        return byId[jobId];
    }
);

export const selectReadyToBeDownloadedWayportJob = createSelector(
    (state: RootState) => state.WayportMode.jobs,
    (jobs) => {
        const { byId, ids } = jobs;

        const readyToBeDownloadedJobIds = ids.filter((id) => {
            const { status } = byId[id];
            return status === 'wayport job finished';
        });

        if (readyToBeDownloadedJobIds.length === 0) {
            return null;
        }

        // there should be only one job at a time in 'wayport job finished' status, but in case there are multiple jobs in this status, we will just return the first one.
        const jobId = readyToBeDownloadedJobIds[0];

        return byId[jobId];
    }
);
