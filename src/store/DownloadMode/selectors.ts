import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

export const selectIsDownloadDialogOpen = createSelector(
    (state: RootState) => state.DownloadMode.isDownloadDialogOpen,
    (isDownloadDialogOpen) => isDownloadDialogOpen
);

export const selectIsAddingNewDownloadJob = createSelector(
    (state: RootState) => state.DownloadMode.isAddingNewDownloadJob,
    (isAddingNewDownloadJob) => isAddingNewDownloadJob
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
