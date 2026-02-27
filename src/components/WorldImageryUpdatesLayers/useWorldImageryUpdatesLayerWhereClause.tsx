import {
    WORLD_IMAGERY_UPDATES_LAYER_FIELDS,
    WorldImageryUpdatesStatusEnum,
} from '@services/world-imagery-updates/config';
import { useAppSelector } from '@store/configureStore';
import { UpdatesModeDateFilter } from '@store/UpdatesMode/reducer';
import {
    // selectUpdatesModeCustomDateRange,
    selectUpdatesModeDate,
    selectUpdatesModeRegion,
    // selectUpdatesModeStatus,
} from '@store/UpdatesMode/selectors';
import React, { useMemo } from 'react';

const daysToSubtract: Record<UpdatesModeDateFilter, number> = {
    'last-week': 7,
    'last-month': 30,
    'last-3-months': 90,
    'last-6-months': 180,
    'last-year': 365,
    pending: 0, // This value is arbitrary since pending updates will be included regardless of the date filter
    // custom: 0,
};

/**
 * This hook generates the where clause for the world imagery updates layer based on state of the redux stor.
 * @returns where clause for the world imagery updates layer
 */
export const useWorldImageryUpdatesLayerWhereClause = (
    shouldIgnoreRegionFilter = false
) => {
    // const status = useAppSelector(selectUpdatesModeStatus);

    const dateFilter = useAppSelector(selectUpdatesModeDate);

    // const customDateRange = useAppSelector(selectUpdatesModeCustomDateRange);

    const region = useAppSelector(selectUpdatesModeRegion);

    const whereClause: string = useMemo(() => {
        console.log(
            'Generating where clause with dateFilter:',
            dateFilter,
            'region:',
            region,
            'shouldIgnoreRegionFilter:',
            shouldIgnoreRegionFilter
        );

        const whereClauses: string[] = [
            `${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_DATE} IS NOT NULL`,
        ];

        if (
            region &&
            region !== null &&
            region !== '' &&
            shouldIgnoreRegionFilter === false
        ) {
            whereClauses.push(
                `${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.COUNTRY_NAME} = '${region}'`
            );
        }

        if (dateFilter) {
            // Add date filter if it's not 'pending'
            if (dateFilter !== 'pending') {
                const dateQuery = `(${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_DATE} BETWEEN CURRENT_TIMESTAMP - ${daysToSubtract[dateFilter]} AND CURRENT_TIMESTAMP)`;
                whereClauses.push(dateQuery);
            }

            // Add status filter based on date filter
            const statusQuery =
                dateFilter === 'pending'
                    ? `(${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE} = '${WorldImageryUpdatesStatusEnum.pending}')`
                    : `(${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE} = '${WorldImageryUpdatesStatusEnum.published}')`;

            whereClauses.push(statusQuery);
        }

        return whereClauses.map((clause) => `(${clause})`).join(' AND ');
    }, [dateFilter, region]);

    return whereClause;
};
