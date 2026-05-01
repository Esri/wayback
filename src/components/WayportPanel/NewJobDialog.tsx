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

import { CalciteButton, CalciteIcon } from '@esri/calcite-components-react';
import { MAX_NUMBER_TO_TILES_PER_WAYPORT_EXPORT } from '@services/wayport/getTileEstimationsInOutputBundle';
import { WayportJob } from '@store/WayportMode/reducer';
import { numberWithCommas } from '@utils/snippets/numbers';
import classNames from 'classnames';
import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWaybackItem } from '@typings/index';
import { Slider, SliderHandleType } from './Slider';
import { TilePreviewCard } from './TilePreviewCard';
import { useAppSelector } from '@store/configureStore';
import { selectIsThereAnyOngoingJobs } from '@store/WayportMode/selectors';

type NewJobDialogProps = {
    job: WayportJob | null;
    /**
     * If true, the new job dialog will be in a disabled as the user is either not signed in or signed in with an ArcGIS public account, which does not have the privileges to create new export jobs
     */
    disabled: boolean;
    /**
     * Emit when user changes the zoom levels selection in the new job dialog, with the selected min and max zoom levels as the parameters.
     * @param minZoom
     * @param maxZoom
     * @returns
     */
    levelsOnChange: (minZoom: number, maxZoom: number) => void;
    /**
     * Emits when user clicks the remove button in the new job dialog to remove the current new download job that is being created.
     * This will reset the new job dialog and allow users to start over on creating a new download job.
     * @param job
     * @returns
     */
    onRemove: (job: WayportJob) => void;
    /**
     * Emits when user clicks the create button in the new job dialog to create a new download job based on the current job state
     * which contains the user input such as selected zoom levels for the new job.
     * @param job
     * @returns
     */
    onSubmit: (job: WayportJob) => void;
    // /**
    //  * Emit when user clicks the action in the prompt message to create a new job for the current map extent and selected zoom levels.
    //  * @returns
    //  */
    // onInitiateNewJob: () => void;
    // /**
    //  * Emit when user clicks the button to zoom to the job extent on the map in the new job dialog.
    //  * @returns
    //  */
    // onZoomToExtentRequested: () => void;
};

export const NewJobDialog: FC<NewJobDialogProps> = ({
    job,
    disabled,
    // activeWaybackItem,
    levelsOnChange,
    onRemove,
    onSubmit,
    // onInitiateNewJob,
    // onZoomToExtentRequested,
}) => {
    const { t } = useTranslation();

    const { tileEstimations, levels } = job || {};

    const [minZoom, maxZoom] = levels || [];

    const [handleOnDragging, setHandleOnDragging] =
        useState<SliderHandleType>(null);

    const hasOngoingJob = useAppSelector(selectIsThereAnyOngoingJobs);

    // calculate total tiles based on levels selected
    const countOfTotalTiles: number = useMemo(() => {
        if (!tileEstimations || !tileEstimations.length) {
            return 0;
        }

        // if levels is not set, it means user has not made a selection on zoom levels for the job,
        // we will treat it as 0 to avoid confusion and potential issues with the export tool when creating a job with no zoom level selected
        if (minZoom === undefined || maxZoom === undefined) {
            return 0;
        }

        // if (!levels || levels.length !== 2) {
        //     return 0;
        // }

        let total = 0;

        // const [minZoom, maxZoom] = levels || [-1, -1];

        for (const { count, level } of tileEstimations) {
            if (level < minZoom) {
                continue;
            }

            if (level > maxZoom) {
                break;
            }

            total += count;
        }

        return total;
    }, [tileEstimations, minZoom, maxZoom]);

    /**
     * The export tool has a hard limit of maximum number of tiles allowed in a wayport export request.
     * If the user selected extent and zoom levels will result in an estimation of total tiles that exceeds the limit,
     * we will disable the create button and show a warning message to users to adjust the extent or zoom levels.
     */
    const exceedsMaxTileLimit = useMemo(() => {
        if (!countOfTotalTiles) {
            return false;
        }

        return countOfTotalTiles > MAX_NUMBER_TO_TILES_PER_WAYPORT_EXPORT;
    }, [countOfTotalTiles]);

    const shouldDisableCreateButton = useMemo(() => {
        return disabled || exceedsMaxTileLimit || hasOngoingJob;
    }, [exceedsMaxTileLimit, disabled, hasOngoingJob]);

    const maxAvailableTileLevel = useMemo(() => {
        if (!tileEstimations || !tileEstimations.length) {
            return null;
        }

        const last = tileEstimations[tileEstimations.length - 1];

        return last.level;
    }, [tileEstimations]);

    const getContent = () => {
        // if (!job) {
        //     return (
        //         <div className="text-white font-light text-sm">
        //             <Trans
        //                 i18nKey="no_new_wayport_job"
        //                 values={{
        //                     waybackReleaseDate:
        //                         activeWaybackItem?.releaseDateLabel ||
        //                         'Unknown',
        //                 }}
        //                 components={{
        //                     action: (
        //                         <button
        //                             className="font-semibold underline cursor-pointer text-custom-theme-blue-light"
        //                             onClick={onInitiateNewJob}
        //                         />
        //                     ),
        //                 }}
        //             />
        //         </div>
        //     );
        // }

        return (
            <div>
                <div className="relative w-full">
                    <TilePreviewCard
                        handleOnDragging={handleOnDragging}
                        levels={levels}
                        // maxAvailableTileLevel={maxAvailableTileLevel}
                        // releaseNumOfActiveWaybackItem={activeWaybackItem?.releaseNum}
                    />

                    <div className="w-full relative mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CalciteIcon
                                    icon="information"
                                    scale="s"
                                    class="text-custom-theme-blue-light mr-2"
                                />

                                <span className=" text-custom-theme-blue-light font-light">
                                    {t('new_wayport_job_header', {
                                        releaseDate:
                                            job?.waybackItem
                                                ?.releaseDateLabel || 'Unknown',
                                    })}
                                </span>
                            </div>

                            <div className="flex items-center">
                                {/* <CalciteButton
                                    class="ml-1"
                                    scale="s"
                                    iconEnd="search"
                                    appearance="transparent"
                                    kind="neutral"
                                    onClick={onZoomToExtentRequested}
                                /> */}

                                <CalciteButton
                                    width="full"
                                    appearance="transparent"
                                    scale="s"
                                    iconEnd="x"
                                    onClick={onRemove.bind(null, job)}
                                ></CalciteButton>
                            </div>
                        </div>
                    </div>

                    <div
                        className={classNames('w-full', {
                            disabled,
                        })}
                    >
                        <ul className="text-sm list-disc ml-5 pb-1 mb-2">
                            <li className="mb-2">
                                {t('download_job_instruction_1')}
                            </li>
                            <li className="mb-2">
                                {t('download_job_instruction_2')}
                            </li>
                            {/* <li className="mb-2">
                                {t('download_job_instruction_3')}
                            </li> */}
                        </ul>
                    </div>
                </div>

                <div
                    className={classNames('w-full', {
                        disabled,
                    })}
                >
                    <Slider
                        // minValue={minZoom}
                        // maxValue={maxZoom}
                        defaultStart={minZoom}
                        defaultEnd={maxZoom}
                        onChange={(
                            userSelectedMinZoom,
                            userSelectedMaxZoom
                        ) => {
                            levelsOnChange(
                                userSelectedMinZoom,
                                userSelectedMaxZoom
                            );
                        }}
                        draggedHandleOnChange={(handle) => {
                            // console.log('Handle on dragging changed to: ', handle);
                            setHandleOnDragging(handle);
                        }}
                    />

                    <div
                        className={classNames('flex items-center mb-2', {
                            hidden: disabled,
                        })}
                    >
                        <div className="mr-2">
                            {exceedsMaxTileLimit ? (
                                <CalciteIcon
                                    icon="exclamation-mark-circle"
                                    scale="s"
                                    class="text-red-500"
                                />
                            ) : (
                                <CalciteIcon
                                    icon="check-circle"
                                    scale="s"
                                    class="text-green-500"
                                />
                            )}
                        </div>

                        <p className="text-sm ">
                            {exceedsMaxTileLimit
                                ? t(
                                      'estimated_number_of_tiles_exceeded_max_limit',
                                      {
                                          total: numberWithCommas(
                                              countOfTotalTiles
                                          ),
                                          maxLimit: numberWithCommas(
                                              MAX_NUMBER_TO_TILES_PER_WAYPORT_EXPORT
                                          ),
                                          minZoomLevel: minZoom,
                                          maxZoomLevel: maxZoom,
                                      }
                                  )
                                : t('estimated_number_of_tiles', {
                                      total: numberWithCommas(
                                          countOfTotalTiles
                                      ),
                                      minZoomLevel: minZoom,
                                      maxZoomLevel: maxZoom,
                                  })}
                        </p>
                    </div>

                    {maxAvailableTileLevel !== null &&
                        maxZoom !== undefined &&
                        maxZoom > maxAvailableTileLevel &&
                        disabled === false && (
                            <div className="flex items-center mb-2">
                                <div className="mr-2">
                                    <CalciteIcon
                                        icon="exclamation-mark-triangle"
                                        scale="s"
                                        class="text-yellow-500"
                                    />
                                </div>

                                <p className="text-sm ">
                                    {t(
                                        'wayport_max_zoom_level_exceeded_warning',
                                        {
                                            maxZoomLevel: maxAvailableTileLevel,
                                        }
                                    )}
                                </p>
                            </div>
                        )}

                    {hasOngoingJob && (
                        <div className="flex items-center mb-2">
                            <div className="mr-2">
                                <CalciteIcon
                                    icon="exclamation-mark-triangle"
                                    scale="s"
                                    class="text-yellow-500"
                                />
                            </div>

                            <p className="text-sm ">
                                {t('wayport_ongoing_job_warning')}
                            </p>
                        </div>
                    )}

                    <div>
                        <CalciteButton
                            class="mt-2"
                            width="full"
                            disabled={shouldDisableCreateButton}
                            appearance="solid"
                            color="blue"
                            onClick={() => {
                                onSubmit(job);
                            }}
                        >
                            {t('create_tile_package')}
                        </CalciteButton>
                    </div>
                </div>
            </div>
        );
    };

    if (!job) {
        return null;
    }

    return (
        <div
            className={classNames(
                'relative bg-white bg-opacity-10 p-2 w-full mb-2'
            )}
        >
            {getContent()}
        </div>
    );
};
