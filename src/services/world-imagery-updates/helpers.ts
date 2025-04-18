import {
    COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL,
    ImageryUpdatesCategory,
    VIVID_ADVANCED_FROM_MAXAR_URL,
    VIVID_STANDARD_FROM_MAXAR_URL,
} from './config';

export const getImageryUpdatesUrl = (
    category: ImageryUpdatesCategory
): string => {
    if (category === 'vivid-advanced') {
        return VIVID_ADVANCED_FROM_MAXAR_URL;
    }

    if (category === 'vivid-standard') {
        return VIVID_STANDARD_FROM_MAXAR_URL;
    }

    if (category === 'community-contributed') {
        return COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL;
    }

    throw new Error(
        `Failed to get Imagery Updates Layer URL by category: ${category}`
    );
};
