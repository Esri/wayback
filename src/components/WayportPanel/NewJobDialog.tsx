import { CalciteButton, CalciteIcon } from '@esri/calcite-components-react';
import { MAX_NUMBER_TO_TILES_PER_WAYPORT_EXPORT } from '@services/export-wayback-bundle/getTileEstimationsInOutputBundle';
import { DownloadJob } from '@store/DownloadMode/reducer';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type NewJobDialogProps = {
    job: DownloadJob | null;
    disabled: boolean;
};

export const NewJobDialog: FC<NewJobDialogProps> = ({ job, disabled }) => {
    const { t } = useTranslation();

    const { tileEstimations, levels } = job || {};

    // calculate total tiles based on levels selected
    const countOfTotalTiles = useMemo(() => {
        if (!tileEstimations || !tileEstimations.length) {
            return 0;
        }

        if (!levels || levels.length !== 2) {
            return 0;
        }

        let total = 0;

        const [minZoom, maxZoom] = levels;

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
    }, [tileEstimations, levels]);

    const shouldDisableCreateButton = useMemo(() => {
        if (disabled) {
            return true;
        }

        if (
            !countOfTotalTiles ||
            countOfTotalTiles <= 0 ||
            countOfTotalTiles > MAX_NUMBER_TO_TILES_PER_WAYPORT_EXPORT
        ) {
            return true;
        }

        return false;
    }, [countOfTotalTiles, disabled]);

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
                <div className="flex justify-center items-center mb-4">
                    <CalciteIcon
                        icon="information"
                        scale="s"
                        class="text-custom-theme-blue-light mr-2"
                    />
                    <span className=" text-custom-theme-blue-light font-light">
                        {t('new_wayport_job_header', {
                            releaseDate:
                                job?.waybackItem?.releaseDateLabel || 'Unknown',
                        })}
                    </span>
                </div>

                <div>
                    <CalciteButton
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
