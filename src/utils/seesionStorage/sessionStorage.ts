enum SessionStorageKey {
    releaseNumOfItemsToBeSaved2Webmap = 'releaseNumOfItemsToBeSaved2Webmap',
}

export const saveReleaseNumOfItemsToBeSaved2Webmap2SessionStorage = (
    rNumOfItemsToBeSaved2Webmap: number[]
) => {
    if (!rNumOfItemsToBeSaved2Webmap || !rNumOfItemsToBeSaved2Webmap.length) {
        sessionStorage.removeItem(
            SessionStorageKey.releaseNumOfItemsToBeSaved2Webmap
        );
        return;
    }

    sessionStorage.setItem(
        SessionStorageKey.releaseNumOfItemsToBeSaved2Webmap,
        rNumOfItemsToBeSaved2Webmap.join(',')
    );
};

export const getReleaseNumOfItemsToBeSaved2WebmapFromSessionStorage =
    (): number[] => {
        const val = sessionStorage.getItem(
            SessionStorageKey.releaseNumOfItemsToBeSaved2Webmap
        );

        if (!val) {
            return [];
        }

        return val.split(',').map((numStr) => Number.parseInt(numStr, 10));
    };
