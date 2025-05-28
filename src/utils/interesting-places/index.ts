type InterestingPlace = {
    name: string;
    description?: string;
    longitude: number;
    latitude: number;
    zoom: number;
};

/**
 * 

Dubai (Canal)
https://livingatlasdev.arcgis.com/wayback/#active=60013&mapCenter=55.28008%2C25.19028%2C14


Tokyo (Olympic venue)
https://livingatlasdev.arcgis.com/wayback/#active=60013&mapCenter=139.71797%2C35.67775%2C16


Beijing Daxing International Airport
https://livingatlasdev.arcgis.com/wayback/#active=60013&mapCenter=116.40978%2C39.51004%2C14.

Neom
https://livingatlasdev.arcgis.com/wayback/#active=20337&mapCenter=35.23566%2C28.09952%2C13

Hong Kong-Zhuhai-Macao Bridge
https://livingatlasdev.arcgis.com/wayback/#active=47963&mapCenter=113.58475%2C22.21209%2C15
 */
const interestingPlaces: InterestingPlace[] = [
    {
        name: 'Dubai (Canal)',
        longitude: 55.28008,
        latitude: 25.19028,
        zoom: 14,
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
    {
        name: 'Neom',
        longitude: 35.23566,
        latitude: 28.09952,
        zoom: 13,
    },
    {
        name: 'Hong Kong-Zhuhai-Macao Bridge',
        longitude: 113.58475,
        latitude: 22.21209,
        zoom: 15,
    },
    {
        name: 'Sofi Stadium',
        longitude: -118.33717,
        latitude: 33.95311,
        zoom: 16,
    },
];

export const getRandomInterestingPlace = (): InterestingPlace => {
    const randomIndex = Math.floor(Math.random() * interestingPlaces.length);
    const place = interestingPlaces[randomIndex];

    return place;
};
