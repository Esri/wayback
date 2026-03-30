import {
    CalciteButton,
    CalciteIcon,
    CalciteLoader,
} from '@esri/calcite-components-react';
import { WayportJob, WayportJobStatus } from '@store/WayportMode/reducer';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { JobCard } from './JobCard';

type JobsListProps = {
    jobs: WayportJob[];
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
};

export const JobsList: FC<JobsListProps> = ({
    jobs,
    shouldDisableZoomToButton,
    idOfJobToShowExtentOnMap,
    onRemove,
    onZoomTo,
    downlaodTilePackageButtonOnClick,
    publishTileLayerButtonOnClick,
}) => {
    const { t } = useTranslation();

    const wayportJobStatusLabel: Record<WayportJobStatus, string> = {
        'not started': t('not_started_status'),
        'waiting to start': t('waiting_to_start_status'),
        pending: t('pending_status'),
        finished: t('finished_status'),
        failed: t('failed_status'),
        downloaded: t('downloaded_status'),
    };

    if (jobs.length === 0) {
        return (
            <div className="text-center opacity-50 mt-2">
                <p className="text-sm">{t('no_wayport_jobs')}</p>
            </div>
        );
    }

    return (
        <div className="mt-2 overflow-x-hidden">
            {jobs.map((job) => {
                return (
                    <JobCard
                        key={job.id}
                        job={job}
                        wayportJobStatusLabel={wayportJobStatusLabel}
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
                    />
                );
            })}
        </div>
    );
};
