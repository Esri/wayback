/* Copyright 2024-2026 Esri
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

import {
    CalciteButton,
    CalciteIcon,
    CalciteLoader,
} from '@esri/calcite-components-react';
import {
    // PublishWayportTileLayerStatus,
    WayportJob,
    WayportJobStatus,
} from '@store/WayportMode/reducer';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type JobCardProps = {
    job: WayportJob;
    /**
     * If true, it means the job is currently ongoing, which means the remove button for this job should be disabled to prevent user from removing a job that is still ongoing.
     */
    isOngoingJob: boolean;
    idOfJobToShowExtentOnMap: string | null;
    shouldDisableZoomToButton: boolean;
    /**
     * A mapping of WayportJobStatus values to their corresponding user-friendly labels,
     * used to display the current status of the job in the UI.
     * */
    wayportJobStatusLabel: Record<WayportJobStatus, string>;
    /**
     * If true, it means the user has the privileges to publish tile layers to ArcGIS Online, which means the option to publish tile layer will be shown for each job that is finished downloading the tile package.
     */
    canPublishTileLayer: boolean;
    // /**
    //  * A mapping of PublishWayportTileLayerStatus values to their corresponding user-friendly labels,
    //  * used to display the current status of the tile layer publish/update workflow in the UI.
    //  */
    // wayportTileLayerPublishStatusLabel: Record<
    //     PublishWayportTileLayerStatus,
    //     string
    // >;
    onRemove: (job: WayportJob) => void;
    onZoomTo: (job: WayportJob) => void;
    downlaodTilePackageButtonOnClick: (job: WayportJob) => void;
    publishTileLayerButtonOnClick: (jobId: string) => void;
    openPublishedTileLayerOnClick: (job: WayportJob) => void;
};

export const JobCard: FC<JobCardProps> = ({
    job,
    isOngoingJob,
    idOfJobToShowExtentOnMap,
    shouldDisableZoomToButton,
    wayportJobStatusLabel,
    canPublishTileLayer,
    // wayportTileLayerPublishStatusLabel,
    onRemove,
    onZoomTo,
    downlaodTilePackageButtonOnClick,
    publishTileLayerButtonOnClick,
    openPublishedTileLayerOnClick,
}) => {
    const { t } = useTranslation();

    const { waybackItem, status, progressInfo } = job || {};

    const { releaseDateLabel } = waybackItem;

    const showLoadingIndicator = useMemo(() => {
        return isOngoingJob && status !== 'wayport job finished';
    }, [status, isOngoingJob]);

    // const shouldRemoveButtonBeDisabled = checkShouldDisableRemoveButton(job);

    /**
     * Determines the appropriate status label to display for the job based on
     * its current status and publish status.
     */
    const statusLabel = useMemo(() => {
        // if (publishWayportTileLayerStatus) {
        //     return (
        //         wayportTileLayerPublishStatusLabel[
        //             publishWayportTileLayerStatus
        //         ] || publishWayportTileLayerStatus
        //     );
        // }

        const statusLabel = wayportJobStatusLabel[status] || status;

        if (!statusLabel) {
            return '';
        }

        // get the progress percentage from the job's progressInfo if the job is in pending status, to show alongside the status label
        const progressPercentage =
            status === 'wayport job pending' && progressInfo?.progressPercentage
                ? `${progressInfo?.progressPercentage}`
                : '';

        if (progressPercentage) {
            return `${statusLabel} (${progressPercentage}%)`;
        }

        return statusLabel;
    }, [
        status,
        // publishWayportTileLayerStatus,
        wayportJobStatusLabel,
        progressInfo?.progressPercentage,
    ]);

    const getActionButtons = () => {
        // if the tile layer is published, show the button to open the published tile layer in ArcGIS Online
        if (status === 'publishing job finished') {
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

        // if the job is finished but the tile package is not published or downloaded yet, show the buttons to download the tile package or publish the tile layer
        if (status === 'wayport job finished') {
            return (
                <div className="mt-2 ml-2">
                    <CalciteButton
                        // scale="s"
                        appearance="solid"
                        iconStart="tile-layer"
                        width="full"
                        onClick={publishTileLayerButtonOnClick.bind(
                            null,
                            job.id
                        )}
                        disabled={!canPublishTileLayer}
                    >
                        {t('publish_wayport_tile_layer')}
                    </CalciteButton>

                    <CalciteButton
                        class="mt-2"
                        // scale="s"
                        appearance="solid"
                        iconStart="download-to"
                        width="full"
                        onClick={downlaodTilePackageButtonOnClick.bind(
                            null,
                            job
                        )}
                        label={t('download_tile_package')}
                    >
                        {t('download_tile_package')}
                    </CalciteButton>

                    <div className="text-xs mt-2 flex items-center">
                        <CalciteIcon icon="timer" scale="s" />
                        <span className="ml-2">
                            {t('wayport_tile_package_expiration_warning')}
                        </span>
                    </div>

                    {!canPublishTileLayer && (
                        <div className="text-xs mt-2 flex items-center">
                            <CalciteIcon
                                icon="exclamation-mark-triangle"
                                scale="s"
                                className="text-yellow-500"
                            />
                            <span
                                className="ml-2"
                                dangerouslySetInnerHTML={{
                                    __html: t(
                                        'insufficient_privileges_to_publish_tile_layer'
                                    ),
                                }}
                            ></span>
                        </div>
                    )}
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
                <div className="flex items-center shrink-0 pl-1">
                    <div className="w-6 h-6 relative flex items-center justify-center">
                        {showLoadingIndicator ? (
                            <CalciteLoader inline scale="s" />
                        ) : (
                            <CalciteButton
                                scale="s"
                                iconStart="x"
                                appearance="transparent"
                                color="neutral"
                                onClick={onRemove.bind(null, job)}
                                label={t('remove_wayport_job')}
                            ></CalciteButton>
                        )}
                    </div>

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
