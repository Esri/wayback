import { CalciteButton } from '@esri/calcite-components-react';
import { DownloadJob, DownloadJobStatus } from '@store/DownloadMode/reducer';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

type JobsListProps = {
    jobs: DownloadJob[];
    onRemove: (job: DownloadJob) => void;
    onZoomTo: (job: DownloadJob) => void;
};

export const JobsList: FC<JobsListProps> = ({ jobs, onRemove, onZoomTo }) => {
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
        <div className="mt-2">
            {jobs.map((job) => {
                const { waybackItem, levels, status } = job;
                const { releaseDateLabel } = waybackItem;

                return (
                    <div
                        key={job.id}
                        className="bg-white bg-opacity-10 p-2 w-full flex items-center justify-between text-sm"
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
