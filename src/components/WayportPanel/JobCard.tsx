import { CalciteButton } from '@esri/calcite-components-react';
import { WayportJob, WayportJobStatus } from '@store/WayportMode/reducer';
import classNames from 'classnames';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

type JobCardProps = {
    job: WayportJob;
    idOfJobToShowExtentOnMap: string | null;
    shouldDisableZoomToButton: boolean;
    wayportJobStatusLabel: Record<WayportJobStatus, string>;
    onRemove: (job: WayportJob) => void;
    onZoomTo: (job: WayportJob) => void;
    downlaodTilePackageButtonOnClick: (job: WayportJob) => void;
    publishTileLayerButtonOnClick: (jobId: string) => void;
};

export const JobCard: FC<JobCardProps> = ({
    job,
    idOfJobToShowExtentOnMap,
    shouldDisableZoomToButton,
    wayportJobStatusLabel,
    onRemove,
    onZoomTo,
    downlaodTilePackageButtonOnClick,
    publishTileLayerButtonOnClick,
}) => {
    const { t } = useTranslation();

    const { waybackItem, status, progressInfo, publishWayportTileLayerStatus } =
        job || {};

    const { releaseDateLabel } = waybackItem;

    const progressPercentage =
        status === 'pending' && progressInfo
            ? `${progressInfo?.progressPercentage || 0}`
            : '';

    // remove button should be disabled when the job is in progress (pending or waiting to start) or when the tile layer is being published or updated,
    // to prevent users from removing a job that is in the middle of being processed
    const shouldRemoveButtonBeDisabled =
        status === 'pending' ||
        status === 'waiting to start' ||
        publishWayportTileLayerStatus === 'adding tile package item' ||
        publishWayportTileLayerStatus === 'publishing tile layer' ||
        publishWayportTileLayerStatus === 'updating tiles';

    return (
        <div
            key={job.id}
            className={classNames(
                'bg-white bg-opacity-10 py-2 pr-2 w-full flex items-center justify-between text-sm mb-2 border-l-4',
                {
                    'border-white': idOfJobToShowExtentOnMap === job.id, // highlight the job card if its extent is being shown on the map
                    'border-transparent': idOfJobToShowExtentOnMap !== job.id,
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
                    disabled={shouldRemoveButtonBeDisabled}
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

            {!publishWayportTileLayerStatus && (
                <>
                    {status !== 'finished' && (
                        <div className="flex items-center">
                            <span className="italic opacity-80">
                                {wayportJobStatusLabel[status] +
                                    (progressPercentage
                                        ? ` (${progressPercentage}%)`
                                        : '')}
                            </span>
                        </div>
                    )}

                    {status === 'finished' && (
                        <div>
                            <CalciteButton
                                scale="s"
                                appearance="solid"
                                iconStart="download-to"
                                width="full"
                                onClick={downlaodTilePackageButtonOnClick.bind(
                                    null,
                                    job
                                )}
                                label={t('download_tile_package')}
                                // disabled={!job.outputTilePackageInfo?.url}
                            >
                                {t('download_tile_package')}
                            </CalciteButton>

                            <CalciteButton
                                class="mt-2"
                                scale="s"
                                appearance="outline"
                                iconStart="tile-layer"
                                width="full"
                                onClick={publishTileLayerButtonOnClick.bind(
                                    null,
                                    job.id
                                )}
                            >
                                Publish Tile Layer
                            </CalciteButton>
                        </div>
                    )}
                </>
            )}

            {publishWayportTileLayerStatus && (
                <>
                    {publishWayportTileLayerStatus !== 'finished' && (
                        <div className="flex items-center">
                            <span className="italic opacity-80">
                                {publishWayportTileLayerStatus}
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
