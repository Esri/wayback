import React, { FC } from 'react';
import { HeaderText } from './HeaderText';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import { WorldImageryUpdatesStatusEnum } from '@services/world-imagery-updates/config';
import {
    selectUpdatesModeStatus,
    selectWorldImageryUpdatesOutStatistics,
} from '@store/UpdatesMode/selectors';
import { updatesModeStatusChanged } from '@store/UpdatesMode/reducer';
import { WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS } from '@constants/UI';
import { numberWithCommas } from 'helper-toolkit-ts/dist/number';
import { CalciteCheckbox } from '@esri/calcite-components-react';

type StatusCheckboxProps = {
    /**
     * The checked state of the checkbox
     */
    checked: boolean;
    /**
     * Status of the data associated with the checkbox.
     */
    status: WorldImageryUpdatesStatusEnum;
    /**
     * The number of sites associated with the checkbox.
     */
    count: number;
    /**
     * The area associated with the checkbox.
     */
    area: number; // in km2
    /**
     * The color associated with the checkbox.
     */
    color: string;
    /**
     * Emits when the checkbox state changes.
     * @returns void
     */
    onChange?: () => void;
};

const formatArea = (areaInSqKm: number) => {
    if (areaInSqKm >= 1000000) {
        return `${(areaInSqKm / 1000000).toFixed(1)}M`;
    }

    if (areaInSqKm >= 1000) {
        return `${(areaInSqKm / 1000).toFixed(0)}K`;
    }

    return `${areaInSqKm.toFixed(0)}`;
};

const StatusCheckbox: FC<StatusCheckboxProps> = ({
    checked,
    status,
    count,
    area,
    color,
    onChange,
}) => {
    const { t } = useTranslation();

    return (
        <div
            className="grid items-center text-xs"
            style={{
                gridTemplateColumns: '24px 1fr',
            }}
        >
            <CalciteCheckbox
                checked={checked}
                onCalciteCheckboxChange={onChange}
            ></CalciteCheckbox>
            <div
                className="grid items-center gap-1 font-bold"
                style={{
                    color: color ? color : 'inherit',
                    gridTemplateColumns: '62px 1fr',
                }}
            >
                <span className="text-sm">{t(status)}</span>
                <div>
                    <span className="ml-1 mr-2">|</span>
                    <span className="text-sm">
                        {t('status_message', {
                            num_sites: numberWithCommas(count),
                            area: formatArea(area),
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const StatusFilter = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const status = useAppSelector(selectUpdatesModeStatus);

    const outStatistics = useAppSelector(
        selectWorldImageryUpdatesOutStatistics
    );

    const onChange = (status2Toggle: WorldImageryUpdatesStatusEnum) => {
        // Toggle the status
        // If the status is already in the list, remove it
        // If the status is not in the list, add it
        const newStatus = status.includes(status2Toggle)
            ? status.filter((s) => s !== status2Toggle)
            : [...status, status2Toggle];

        dispatch(updatesModeStatusChanged(newStatus));
    };

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <HeaderText title={t('status')} />

            <StatusCheckbox
                checked={status.includes(
                    WorldImageryUpdatesStatusEnum.published
                )}
                status={WorldImageryUpdatesStatusEnum.published}
                count={outStatistics?.countOfPublished || 0}
                area={outStatistics?.areaOfPublished || 0}
                color={WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS.published.color}
                onChange={() =>
                    onChange(WorldImageryUpdatesStatusEnum.published)
                }
            />
            <StatusCheckbox
                checked={status.includes(WorldImageryUpdatesStatusEnum.pending)}
                status={WorldImageryUpdatesStatusEnum.pending}
                count={outStatistics?.countOfPending || 0}
                area={outStatistics?.areaOfPending || 0}
                color={WORLD_IMAGERY_UPDATES_LAYER_FILL_COLORS.pending.color}
                onChange={() => onChange(WorldImageryUpdatesStatusEnum.pending)}
            />
        </div>
    );
};
