import { getHashParamValueByKey, updateHashParams } from '@utils/urlParams';
import { UpdatesModeState, initialUpdatesModeState } from './reducer';
import { WorldImageryUpdatesStatusEnum } from '@services/world-imagery-updates/config';

/**
 * Save Updates Mode data in the URL hash params
 * @param data - Updates Mode data to be saved
 * @returns void
 */
export const saveUpdatesModeDataInURLHashParams = (
    data: UpdatesModeState
): void => {
    const { status, category, region } = data;

    const dataToSave = [status.join(','), category, region].join('|');

    updateHashParams('updatesLayer', dataToSave);
};

export const getUpdatesModeFromHashParams = (): UpdatesModeState => {
    const value = getHashParamValueByKey('updatesLayer');

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

export const getPreloadedState4UpdatesMode = (): UpdatesModeState => {
    return getUpdatesModeFromHashParams() || initialUpdatesModeState;
};
