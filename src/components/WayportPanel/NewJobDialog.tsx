import { CalciteButton, CalciteIcon } from '@esri/calcite-components-react';
import { MAX_NUMBER_TO_TILES_PER_WAYPORT_EXPORT } from '@services/export-wayback-bundle/getTileEstimationsInOutputBundle';
import { DownloadJob } from '@store/DownloadMode/reducer';
import { numberWithCommas } from '@utils/snippets/numbers';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScaleRangeSelector } from './ScaleRangeSelector';
import { dispatch, min } from 'd3';

type NewJobDialogProps = {
    job: DownloadJob | null;
    disabled: boolean;
    levelsOnChange: (minZoom: number, maxZoom: number) => void;
    onRemove: (job: DownloadJob) => void;
};

export const NewJobDialog: FC<NewJobDialogProps> = ({
    job,
    disabled,
    levelsOnChange,
    onRemove,
}) => {
    const { t } = useTranslation();

    const { tileEstimations, levels } = job || {};

    const [minZoom, maxZoom] = levels || [-1, -1];

    // calculate total tiles based on levels selected
    const countOfTotalTiles: number = useMemo(() => {
        if (!tileEstimations || !tileEstimations.length) {
            return 0;
        }

        // if levels is not set, it means user has not made a selection on zoom levels for the job,
        // we will treat it as 0 to avoid confusion and potential issues with the export tool when creating a job with no zoom level selected
        if (minZoom === -1 || maxZoom === -1) {
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
        return disabled || exceedsMaxTileLimit;
    }, [exceedsMaxTileLimit, disabled]);

    const getContent = () => {
        if (!job) {
            return (
                <div className="text-center opacity-50">
                    <p className="text-sm">{t('no_new_wayport_jobs')}</p>
                </div>
            );
        }

        return (
            <div>
                <div className="w-full relative mb-4">
                    <div className="flex justify-center items-center ">
                        <CalciteIcon
                            icon="information"
                            scale="s"
                            class="text-custom-theme-blue-light mr-2"
                        />
                        <span className=" text-custom-theme-blue-light font-light">
                            {t('new_wayport_job_header', {
                                releaseDate:
                                    job?.waybackItem?.releaseDateLabel ||
                                    'Unknown',
                            })}
                        </span>
                    </div>

                    <div className="absolute top-0 right-0">
                        <CalciteButton
                            width="full"
                            disabled={shouldDisableCreateButton}
                            appearance="transparent"
                            scale="s"
                            iconEnd="x"
                            onClick={onRemove.bind(null, job)}
                        ></CalciteButton>
                    </div>
                </div>

                <div>
                    <ul className="text-xs list-disc list-inside mb-4">
                        <li className="mb-2">
                            {t('download_job_instruction_1')}
                        </li>
                        <li className="mb-2">
                            {t('download_job_instruction_2')}
                        </li>
                        <li className="mb-2">
                            {t('download_job_instruction_3')}
                        </li>
                    </ul>
                </div>

                <div>
                    <ScaleRangeSelector
                        minValue={1}
                        maxValue={23}
                        onChange={(
                            userSelectedMinZoom,
                            userSelectedMaxZoom
                        ) => {
                            levelsOnChange(
                                userSelectedMinZoom,
                                userSelectedMaxZoom
                            );
                        }}
                    />
                </div>

                <div className="flex items-center mb-2">
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
                        {t('estimated_number_of_tiles', {
                            total: numberWithCommas(countOfTotalTiles),
                        })}
                    </p>
                </div>

                <div>
                    <CalciteButton
                        class="mt-2"
                        width="full"
                        disabled={shouldDisableCreateButton}
                        appearance="solid"
                        color="blue"
                        // onClick={() => { createNewDownloadJobFromTemplate(job) }}
                    >
                        {t('create_tile_package')}
                    </CalciteButton>
                </div>
            </div>
        );
    };

    return (
        <div
            className={classNames('bg-white bg-opacity-10 p-2 w-full', {
                disabled: disabled,
            })}
        >
            {getContent()}
        </div>
    );
};
