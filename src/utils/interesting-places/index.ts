type InterestingPlace = {
    name: string;
    description?: string;
    longitude: number;
    latitude: number;
    zoom: number;
};

/**
 * List of interesting places with their coordinates and zoom levels.
 * These places can be used to set the initial map view or for random selection.
 */
const interestingPlaces: InterestingPlace[] = [
    {
        name: 'Dubai (World Islands)',
        longitude: 55.14363,
        latitude: 25.09182,
        zoom: 15,
    },
    {
        name: 'Tokyo (Olympic venue)',
        longitude: 139.71797,
        latitude: 35.67775,
        zoom: 16,
    },
    {
        name: 'Beijing Daxing International Airport',
        longitude: 116.40978,
        latitude: 39.51004,
        zoom: 14,
    },
    // {
    //     name: 'Neom',
    //     longitude: 35.23566,
    //     latitude: 28.09952,
    //     zoom: 13,
    // },
    {
        name: 'Hong Kong-Zhuhai-Macao Bridge',
        longitude: 113.5695,
        latitude: 22.20162,
        zoom: 15,
    },
    {
        name: 'Sofi Stadium',
        longitude: -118.33717,
        latitude: 33.95311,
        zoom: 16,
    },
    {
        name: 'Redlands, California',
        longitude: -117.17945,
        latitude: 34.056,
        zoom: 15,
    },
    {
        name: 'West Las Vegas, Nevada',
        longitude: -115.2985,
        latitude: 36.064,
        zoom: 15,
    },
];

export const getRandomInterestingPlace = (): InterestingPlace => {
    const randomIndex = Math.floor(Math.random() * interestingPlaces.length);
    const place = interestingPlaces[randomIndex];

    return place;
};
