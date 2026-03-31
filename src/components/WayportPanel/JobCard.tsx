import { CalciteButton } from '@esri/calcite-components-react';
import {
    PublishWayportTileLayerStatus,
    WayportJob,
    WayportJobStatus,
} from '@store/WayportMode/reducer';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { checkShouldDisableRemoveButton } from './jobCardHelpers';

type JobCardProps = {
    job: WayportJob;
    idOfJobToShowExtentOnMap: string | null;
    shouldDisableZoomToButton: boolean;
    /**
     * A mapping of WayportJobStatus values to their corresponding user-friendly labels,
     * used to display the current status of the job in the UI.
     * */
    wayportJobStatusLabel: Record<WayportJobStatus, string>;
    /**
     * A mapping of PublishWayportTileLayerStatus values to their corresponding user-friendly labels,
     * used to display the current status of the tile layer publish/update workflow in the UI.
     */
    wayportTileLayerPublishStatusLabel: Record<
        PublishWayportTileLayerStatus,
        string
    >;
    onRemove: (job: WayportJob) => void;
    onZoomTo: (job: WayportJob) => void;
    downlaodTilePackageButtonOnClick: (job: WayportJob) => void;
    publishTileLayerButtonOnClick: (jobId: string) => void;
    openPublishedTileLayerOnClick: (job: WayportJob) => void;
};

export const JobCard: FC<JobCardProps> = ({
    job,
    idOfJobToShowExtentOnMap,
    shouldDisableZoomToButton,
    wayportJobStatusLabel,
    wayportTileLayerPublishStatusLabel,
    onRemove,
    onZoomTo,
    downlaodTilePackageButtonOnClick,
    publishTileLayerButtonOnClick,
    openPublishedTileLayerOnClick,
}) => {
    const { t } = useTranslation();

    const { waybackItem, status, progressInfo, publishWayportTileLayerStatus } =
        job || {};

    const { releaseDateLabel } = waybackItem;

    const shouldRemoveButtonBeDisabled = checkShouldDisableRemoveButton(job);

    /**
     * Determines the appropriate status label to display for the job based on
     * its current status and publish status.
     */
    const statusLabel = useMemo(() => {
        if (publishWayportTileLayerStatus) {
            return (
                wayportTileLayerPublishStatusLabel[
                    publishWayportTileLayerStatus
                ] || publishWayportTileLayerStatus
            );
        }

        const statusLabel = wayportJobStatusLabel[status] || status;

        if (!statusLabel) {
            return '';
        }

        // get the progress percentage from the job's progressInfo if the job is in pending status, to show alongside the status label
        const progressPercentage =
            status === 'pending' && progressInfo?.progressPercentage
                ? `${progressInfo?.progressPercentage}`
                : '';

        if (progressPercentage) {
            return `${statusLabel} (${progressPercentage}%)`;
        }

        return statusLabel;
    }, [
        status,
        publishWayportTileLayerStatus,
        wayportJobStatusLabel,
        progressInfo?.progressPercentage,
    ]);

    const getActionButtons = () => {
        // if the tile layer is published, show the button to open the published tile layer in ArcGIS Online
        if (publishWayportTileLayerStatus === 'finished') {
            return (
                <div className="mt-2 ml-2">
                    <CalciteButton
                        scale="s"
                        appearance="solid"
                        iconStart="launch"
                        width="full"
                        onClick={openPublishedTileLayerOnClick.bind(null, job)}
                        label={t('open_wayport_tile_layer')}
                        // disabled={!job.outputTilePackageInfo?.url}
                    >
                        {t('open_wayport_tile_layer')}
                    </CalciteButton>
                </div>
            );
        }

        // if the job is finished/or downloaded but the tile layer is not published yet, show the buttons to download the tile package or publish the tile layer
        if (
            (status === 'finished' || status === 'downloaded') &&
            !publishWayportTileLayerStatus
        ) {
            return (
                <div className="mt-2 ml-2">
                    <CalciteButton
                        scale="s"
                        appearance="solid"
                        iconStart="tile-layer"
                        width="full"
                        onClick={publishTileLayerButtonOnClick.bind(
                            null,
                            job.id
                        )}
                    >
                        {t('publish_wayport_tile_layer')}
                    </CalciteButton>

                    <CalciteButton
                        class="mt-2"
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
                        disabled={status === 'downloaded'}
                    >
                        {status === 'downloaded'
                            ? t('downloaded_tile_package')
                            : t('download_tile_package')}
                    </CalciteButton>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            key={job.id}
            className={classNames(
                'bg-white bg-opacity-10 py-2 pr-2 w-full text-sm mb-2 border-l-4',
                {
                    'border-white': idOfJobToShowExtentOnMap === job.id, // highlight the job card if its extent is being shown on the map
                    'border-transparent': idOfJobToShowExtentOnMap !== job.id,
                }
            )}
        >
            <div className="flex items-center justify-between">
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

                {statusLabel && (
                    <div className="italic opacity-80 text-xs">
                        {statusLabel}
                    </div>
                )}
            </div>

            {getActionButtons()}
        </div>
    );
};
