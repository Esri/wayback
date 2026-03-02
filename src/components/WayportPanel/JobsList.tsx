import { CalciteButton } from '@esri/calcite-components-react';
import { DownloadJob, DownloadJobStatus } from '@store/DownloadMode/reducer';
import classNames from 'classnames';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

type JobsListProps = {
    jobs: DownloadJob[];
    /**
     * The id of the job that is currently being shown on the map by having its extent displayed on the map.
     */
    idOfJobToShowExtentOnMap: string | null;
    /**
     * If true, the zoom to button will be disabled and not clickable.
     */
    shouldDisableZoomToButton: boolean;
    onRemove: (job: DownloadJob) => void;
    onZoomTo: (job: DownloadJob) => void;
};

export const JobsList: FC<JobsListProps> = ({
    jobs,
    shouldDisableZoomToButton,
    idOfJobToShowExtentOnMap,
    onRemove,
    onZoomTo,
}) => {
    const { t } = useTranslation();

    const statusLabelText: Record<DownloadJobStatus, string> = {
        'not started': t('not_started_status'),
        'waiting to start': t('waiting_to_start_status'),
        pending: t('pending_status'),
        finished: t('finished_status'),
        failed: t('failed_status'),
        downloaded: t('downloaded_status'),
    };

    if (jobs.length === 0) {
        return null;
    }

    return (
        <div className="mt-4">
            {jobs.map((job) => {
                const { waybackItem, levels, status } = job;
                const { releaseDateLabel } = waybackItem;

                return (
                    <div
                        key={job.id}
                        className={classNames(
                            'bg-white bg-opacity-10 p-2 w-full flex items-center justify-between text-sm mb-2 border-l-4',
                            {
                                'border-white':
                                    idOfJobToShowExtentOnMap === job.id, // highlight the job card if its extent is being shown on the map
                                'border-transparent':
                                    idOfJobToShowExtentOnMap !== job.id,
                            }
                        )}
                    >
                        <div className="flex items-center shrink-0">
                            <CalciteButton
                                scale="s"
                                iconStart="x"
                                appearance="transparent"
                                color="neutral"
                                onClick={onRemove.bind(null, job)}
                                label={t('remove_wayport_job')}
                            ></CalciteButton>

                            <CalciteButton
                                scale="s"
                                iconStart="search"
                                appearance="transparent"
                                color="neutral"
                                onClick={onZoomTo.bind(null, job)}
                                label={t('zoom_to_wayport_job')}
                                disabled={shouldDisableZoomToButton}
                            ></CalciteButton>

                            <span className="ml-1">{releaseDateLabel}</span>
                        </div>

                        <div>
                            <span className="italic opacity-80">
                                {statusLabelText[status]}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
