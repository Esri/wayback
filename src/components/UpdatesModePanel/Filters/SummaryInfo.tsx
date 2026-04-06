import React from 'react';
import { HeaderText } from './HeaderText';
import { Trans, useTranslation } from 'react-i18next';
import { useAppSelector } from '@store/configureStore';
import {
    selectIsPendingOptionsSelected,
    selectUpdatesModeDate,
    selectWorldImageryUpdatesOutStatistics,
} from '@store/UpdatesMode/selectors';
import { WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS } from '@constants/UI';
import { formatArea } from './helpers';
import { selectAppLanguage } from '@store/UI/reducer';

export const SummaryInfo = () => {
    const { t } = useTranslation();

    const appLanguage = useAppSelector(selectAppLanguage);

    const updatesModeDateFilter = useAppSelector(selectUpdatesModeDate);

    const outStatistics = useAppSelector(
        selectWorldImageryUpdatesOutStatistics
    );

    const isPending = useAppSelector(selectIsPendingOptionsSelected);

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <div className="mb-2">
                <HeaderText
                    title={t('summary')}
                    tooltip={t('updates_mode_summary_tooltip')}
                />
            </div>

            <div>
                <p className="text-sm font-bolder">
                    {/* {t('updates_mode_summary_info', {
                        sites: outStatistics?.count || 0,
                        areas: formatArea(outStatistics.area, appLanguage),
                    })} */}

                    <Trans
                        i18nKey={
                            isPending
                                ? 'updates_mode_summary_info_pending'
                                : 'updates_mode_summary_info_published'
                        }
                        values={{
                            sites: outStatistics?.count || 0,
                            areas: formatArea(outStatistics.area, appLanguage),
                        }}
                        components={{
                            strong: (
                                <strong
                                    style={{
                                        color: isPending
                                            ? WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                                                  .pending.color
                                            : WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS
                                                  .published.color,
                                    }}
                                />
                            ),
                        }}
                    />
                </p>
            </div>
        </div>
    );
};
