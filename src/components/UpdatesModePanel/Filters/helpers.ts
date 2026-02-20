export const formatArea = (areaInSqKm: number, appLanguage: string) => {
    if (appLanguage !== 'en') {
        // For non-English languages, just return the area with no formatting
        return `${areaInSqKm.toFixed(0)}`;
    }

    if (areaInSqKm >= 1000000) {
        return `${(areaInSqKm / 1000000).toFixed(1)}M`;
    }

    if (areaInSqKm >= 1000) {
        return `${(areaInSqKm / 1000).toFixed(0)}K`;
    }

    return `${areaInSqKm.toFixed(0)}`;
};
