import {
    WORLD_IMAGERY_UPDATES_LAYER_FIELDS,
    WorldImageryUpdatesStatusEnum,
} from '@services/world-imagery-updates/config';
import { useAppSelector } from '@store/configureStore';
import { UpdatesModeDateFilter } from '@store/UpdatesMode/reducer';
import {
    selectIsPendingOptionsSelected,
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
    'next-week': 0, // This value is arbitrary since pending updates will be included regardless of the date filter
    'next-month': 0,
    'next-3-months': 0,
};

const daysToAdd: Record<UpdatesModeDateFilter, number> = {
    'last-week': 0,
    'last-month': 0,
    'last-3-months': 0,
    'last-6-months': 0,
    'last-year': 0,
    'next-week': 7,
    'next-month': 30,
    'next-3-months': 90,
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

    const isPendingOptionsSelected = useAppSelector(
        selectIsPendingOptionsSelected
    );

    const whereClause: string = useMemo(() => {
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
                `${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.COUNTRY_CODE} = '${region}'`
            );
        }

        if (dateFilter) {
            const daysToSubtractForPublished = daysToSubtract[dateFilter];
            const daysToAddForPending = daysToAdd[dateFilter];

            // Add date filter for published updates if a "last" option is selected and the number of days to subtract is greater than 0
            if (!isPendingOptionsSelected && daysToSubtractForPublished > 0) {
                const dateQuery = `(${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_DATE} BETWEEN CURRENT_TIMESTAMP - ${daysToSubtractForPublished} AND CURRENT_TIMESTAMP)`;
                whereClauses.push(dateQuery);
            }

            // Add date filter for pending updates if a "next" option is selected and the number of days to add is greater than 0
            if (isPendingOptionsSelected && daysToAddForPending > 0) {
                const pendingDateQuery = `(${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_DATE} BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + ${daysToAddForPending})`;
                whereClauses.push(pendingDateQuery);
            }

            // Add status filter based on date filter
            const statusQuery = isPendingOptionsSelected
                ? `(${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE} = '${WorldImageryUpdatesStatusEnum.pending}')`
                : `(${WORLD_IMAGERY_UPDATES_LAYER_FIELDS.PUB_STATE} = '${WorldImageryUpdatesStatusEnum.published}')`;

            whereClauses.push(statusQuery);
        }

        return whereClauses.map((clause) => `(${clause})`).join(' AND ');
    }, [dateFilter, region, isPendingOptionsSelected]);

    return whereClause;
};
