// import {
//     CalciteButton,
//     CalciteIcon,
//     CalciteLoader,
// } from '@esri/calcite-components-react';
import {
    // PublishWayportTileLayerStatus,
    WayportJob,
    WayportJobStatus,
} from '@store/WayportMode/reducer';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { JobCard } from './JobCard';

type JobsListProps = {
    jobs: WayportJob[];
    /**
     * If true, it means the user is not signed in with an ArcGIS Online account.
     */
    notSignedIn: boolean;
    /**
     * Ids of the jobs that are currently ongoing, which means they cannot be removed.
     */
    idsOfOngoingJobs: string[];
    /**
     * The id of the job that is currently being shown on the map by having its extent displayed on the map.
     */
    idOfJobToShowExtentOnMap: string | null;
    /**
     * If true, the zoom to button will be disabled and not clickable.
     */
    shouldDisableZoomToButton: boolean;
    onRemove: (job: WayportJob) => void;
    onZoomTo: (job: WayportJob) => void;
    downlaodTilePackageButtonOnClick: (job: WayportJob) => void;
    publishTileLayerButtonOnClick: (jobId: string) => void;
    openPublishedTileLayerOnClick: (job: WayportJob) => void;
};

export const JobsList: FC<JobsListProps> = ({
    jobs,
    notSignedIn,
    idsOfOngoingJobs,
    shouldDisableZoomToButton,
    idOfJobToShowExtentOnMap,
    onRemove,
    onZoomTo,
    downlaodTilePackageButtonOnClick,
    publishTileLayerButtonOnClick,
    openPublishedTileLayerOnClick,
}) => {
    const { t } = useTranslation();

    const wayportJobStatusLabel: Record<WayportJobStatus, string> = {
        'wayport job not started': t('wayport_job_not_started_status'),
        'wayport job waiting to start': t(
            'wayport_job_waiting_to_start_status'
        ),
        'wayport job pending': t('wayport_job_pending_status'),
        'wayport job finished': t('wayport_job_finished_status'),
        'wayport job failed': t('wayport_job_failed_status'),
        'wayport job downloaded': t('wayport_job_downloaded_status'),
        'wayport job expired': t('wayport_job_expired_status'),
        'publishing job adding tile package': t(
            'adding_tile_package_item_status'
        ),
        'publishing job adding tile layer': t('publishing_tile_layer_status'),
        'publishing job updating tiles': t('updating_tiles_status'),
        'publishing job finished': t('finished_publishing_tile_layer_status'),
        'publishing job failed': t('failed_publishing_tile_layer_status'),
    };

    // const wayportTileLayerPublishStatusLabel: Record<
    //     PublishWayportTileLayerStatus,
    //     string
    // > = {
    //     'publishing job not started': t('not_started_status'),
    //     'publishing job adding tile package': t(
    //         'adding_tile_package_item_status'
    //     ),
    //     'publishing job adding tile layer': t('publishing_tile_layer_status'),
    //     'publishing job updating tiles': t('updating_tiles_status'),
    //     'publishing job finished': t('finished_publishing_tile_layer_status'),
    //     'publishing job failed': t('failed_publishing_tile_layer_status'),
    // };

    if (jobs.length === 0 && notSignedIn === false) {
        return (
            <div className="text-center opacity-50 mt-2">
                <p className="text-sm">{t('no_wayport_jobs')}</p>
            </div>
        );
    }

    return (
        <div className="mt-2 overflow-x-hidden">
            {jobs.map((job) => {
                const isOngoingJob = idsOfOngoingJobs.includes(job.id);

                return (
                    <JobCard
                        key={job.id}
                        job={job}
                        isOngoingJob={isOngoingJob}
                        wayportJobStatusLabel={wayportJobStatusLabel}
                        // wayportTileLayerPublishStatusLabel={
                        //     wayportTileLayerPublishStatusLabel
                        // }
                        idOfJobToShowExtentOnMap={idOfJobToShowExtentOnMap}
                        shouldDisableZoomToButton={shouldDisableZoomToButton}
                        onRemove={onRemove}
                        onZoomTo={onZoomTo}
                        downlaodTilePackageButtonOnClick={
                            downlaodTilePackageButtonOnClick
                        }
                        publishTileLayerButtonOnClick={
                            publishTileLayerButtonOnClick
                        }
                        openPublishedTileLayerOnClick={
                            openPublishedTileLayerOnClick
                        }
                    />
                );
            })}
        </div>
    );
};
