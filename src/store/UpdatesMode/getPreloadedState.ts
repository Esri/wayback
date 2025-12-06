import { getHashParamValueByKey, updateHashParams } from '@utils/urlParams';
import { UpdatesModeState, initialUpdatesModeState } from './reducer';
import { WorldImageryUpdatesStatusEnum } from '@services/world-imagery-updates/config';

export const getUpdatesModeFromHashParams = (
    hashParams: URLSearchParams
): UpdatesModeState => {
    const value = getHashParamValueByKey('updatesLayer', hashParams);

    if (!value) {
        return initialUpdatesModeState;
    }

    const [status, category, region] = value.split('|');

    return {
        ...initialUpdatesModeState,
        status: status
            .split(',')
            .filter((s) =>
                Object.values(WorldImageryUpdatesStatusEnum).includes(
                    s as WorldImageryUpdatesStatusEnum
                )
            ) // filter out invalid values
            .map((s) => s as WorldImageryUpdatesStatusEnum),
        category:
            (category as UpdatesModeState['category']) ||
            initialUpdatesModeState.category,
        region:
            (region as UpdatesModeState['region']) ||
            initialUpdatesModeState.region,
    };
};

export const getPreloadedState4UpdatesMode = (
    hashParams: URLSearchParams
): UpdatesModeState => {
    return getUpdatesModeFromHashParams(hashParams) || initialUpdatesModeState;
};
