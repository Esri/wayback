import {
    WORLD_IMAGERY_UPDATES_LAYER_FIELDS,
    WorldImageryUpdatesStatusEnum,
} from '@services/world-imagery-updates/config';
import { useAppSelector } from '@store/configureStore';
import { UpdatesModeDateFilter } from '@store/UpdatesMode/reducer';
import {
    selectUpdatesModeDate,
    selectUpdatesModeRegion,
    selectUpdatesModeStatus,
} from '@store/UpdatesMode/selectors';
import React, { useMemo } from 'react';

const daysToSubtract: Record<UpdatesModeDateFilter, number> = {
    'last-week': 7,
    'last-month': 30,
    'last-3-months': 90,
    'last-6-months': 180,
    'last-year-and-pending': 365,
    custom: 0,
};

/**
 * This hook generates the where clause for the world imagery updates layer based on state of the redux stor.
 * @returns where clause for the world imagery updates layer
 */
export const useWorldImageryUpdatesLayerWhereClause = () => {
    const status = useAppSelector(selectUpdatesModeStatus);

    const dateFilter = useAppSelector(selectUpdatesModeDate);

    const region = useAppSelector(selectUpdatesModeRegion);

    const whereClause: string = useMemo(() => {
        const whereClauses: string[] = [];

        if (status && status.length > 0) {
            whereClauses.push(
                `${
                    WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE
                } in ('${status.join("','")}')`
            );
        } else {
            whereClauses.push(
                `${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE} IS NULL`
            );
        }

        if (region && region !== null && region !== '') {
            whereClauses.push(
                `${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.COUNTRY_NAME} = '${region}'`
            );
        }

        if (
            dateFilter &&
            dateFilter !== 'custom' &&
            daysToSubtract[dateFilter] !== undefined
        ) {
            console.log('dateFilter', dateFilter);

            const dateQuery = `(${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_DATE} BETWEEN CURRENT_TIMESTAMP - ${daysToSubtract[dateFilter]} AND CURRENT_TIMESTAMP)`;

            if (status.includes(WorldImageryUpdatesStatusEnum.pending)) {
                whereClauses.push(
                    `${dateQuery} OR ${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE} = '${WorldImageryUpdatesStatusEnum.pending}'`
                );
            } else if (
                status.includes(WorldImageryUpdatesStatusEnum.published)
            ) {
                whereClauses.push(dateQuery);
            }
        }

        return whereClauses.map((clause) => `(${clause})`).join(' AND ');
    }, [status, dateFilter, region]);

    return whereClause;
};
