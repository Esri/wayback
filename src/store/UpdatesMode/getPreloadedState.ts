import { getHashParamValueByKey, updateHashParams } from '@utils/urlParams';
import { UpdatesModeState, initialUpdatesModeState } from './reducer';
import { WorldImageryUpdatesStatusEnum } from '@services/world-imagery-updates/config';
import {
    isValidUpdatesModeCategory,
    isValidUpdatesModeDateFilter,
} from './helpers';
import { is } from 'date-fns/locale';

export const getUpdatesModeFromHashParams = (
    hashParams: URLSearchParams
): UpdatesModeState => {
    const value = getHashParamValueByKey('updatesMode', hashParams);

    if (!value) {
        return initialUpdatesModeState;
    }

    const [
        // status,
        category,
        dateFilter,
        region,
    ] = value.split('|');

    return {
        ...initialUpdatesModeState,
        // status: status
        //     .split(',')
        //     .filter((s) =>
        //         Object.values(WorldImageryUpdatesStatusEnum).includes(
        //             s as WorldImageryUpdatesStatusEnum
        //         )
        //     ) // filter out invalid values
        //     .map((s) => s as WorldImageryUpdatesStatusEnum),
        category:
            category && isValidUpdatesModeCategory(category)
                ? (category as UpdatesModeState['category'])
                : initialUpdatesModeState.category,
        region:
            (region as UpdatesModeState['region']) ||
            initialUpdatesModeState.region,
        dateFilter:
            dateFilter && isValidUpdatesModeDateFilter(dateFilter)
                ? (dateFilter as UpdatesModeState['dateFilter'])
                : initialUpdatesModeState.dateFilter,
    };
};

export const getPreloadedState4UpdatesMode = (
    hashParams: URLSearchParams
): UpdatesModeState => {
    return getUpdatesModeFromHashParams(hashParams) || initialUpdatesModeState;
};
