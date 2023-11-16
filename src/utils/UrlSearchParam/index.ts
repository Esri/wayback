import { MapCenter } from '@store/Map/reducer';
import { IURLParamData, IExtentGeomety } from '@typings/index';

type ParamKey =
    | 'ext'
    | 'localChangesOnly'
    | 'selected'
    | 'active'
    | 'animationSpeed'
    | 'swipeWidget'
    | 'framesToExclude'
    | 'downloadMode'
    | 'mapCenter';

type SaveSwipeWidgetInfoInURLQueryParam = (params: {
    isOpen: boolean;
    rNum4SwipeWidgetLeadingLayer?: number;
    rNum4SwipeWidgetTrailingLayer?: number;
}) => void;

let hashParams = new URLSearchParams(window.location.hash.slice(1));

/**
 * update Hash Params in the URL using data from hashParams
 */
export const updateHashParams = (key: ParamKey, value: string) => {
    if (value === undefined || value === null) {
        hashParams.delete(key);
    } else {
        hashParams.set(key, value);
    }

    window.location.hash = hashParams.toString();
};

export const getHashParamValueByKey = (key: ParamKey): string => {
    if (!hashParams.has(key)) {
        return '';
    }

    return hashParams.get(key);
};

const getMapExtent = (): IExtentGeomety => {
    const ext = getHashParamValueByKey('ext')
        ? getHashParamValueByKey('ext')
              .split(',')
              .map((d) => +d)
        : null;

    const mapExtent: IExtentGeomety =
        ext && ext.length === 4
            ? {
                  xmin: ext[0],
                  ymin: ext[1],
                  xmax: ext[2],
                  ymax: ext[3],
                  spatialReference: {
                      wkid: 4326,
                  },
              }
            : null;

    return mapExtent;
};

const saveMapExtentInURLQueryParam = (mapExtent: IExtentGeomety): void => {
    const key: ParamKey = 'ext';
    const value = mapExtent
        ? [mapExtent.xmin, mapExtent.ymin, mapExtent.xmax, mapExtent.ymax]
              .map((d) => d.toFixed(5))
              .join(',')
        : '';

    updateHashParams(key, value);
};

// const saveLocalChangesOnlyInURLQueryParam = (
//     localChangesOnly: boolean
// ): void => {
//     updateHashParams('localChangesOnly', localChangesOnly ? 'true' : null);
// };

const saveReleaseNum4SelectedWaybackItemsInURLQueryParam = (
    rNum4SelectedWaybackItems: number[]
): void => {
    const key: ParamKey = 'selected';
    const value = rNum4SelectedWaybackItems.length
        ? rNum4SelectedWaybackItems.join(',')
        : null;

    updateHashParams(key, value);
};

const saveReleaseNum4ActiveWaybackItemInURLQueryParam = (
    rNum4ActiveWaybackItem: number
): void => {
    const key: ParamKey = 'active';
    const value = rNum4ActiveWaybackItem
        ? rNum4ActiveWaybackItem.toString()
        : null;

    updateHashParams(key, value);
};

const saveSwipeWidgetInfoInURLQueryParam: SaveSwipeWidgetInfoInURLQueryParam =
    ({
        isOpen,
        rNum4SwipeWidgetLeadingLayer,
        rNum4SwipeWidgetTrailingLayer,
    }) => {
        const key: ParamKey = 'swipeWidget';
        const value = isOpen
            ? `${rNum4SwipeWidgetLeadingLayer},${rNum4SwipeWidgetTrailingLayer}`
            : null;

        updateHashParams(key, value);
    };

const saveAnimationSpeedInURLQueryParam = (
    isAnimationOn: boolean,
    speed: number
): void => {
    const key: ParamKey = 'animationSpeed';
    const value = isAnimationOn ? speed.toString() : null;

    updateHashParams(key, value);
};

const saveFrames2ExcludeInURLQueryParam = (rNums: number[]): void => {
    const key: ParamKey = 'framesToExclude';
    const value = rNums && rNums.length ? rNums.join(',') : null;

    updateHashParams(key, value);
};

export const saveMapCenterToHashParams = (center: MapCenter, zoom: number) => {
    const { lon, lat } = center;
    const value = `${lon.toFixed(5)},${lat.toFixed(5)},${zoom}`;
    updateHashParams('mapCenter', value);
    // remove ext from URL as it is no longer needed
    updateHashParams('ext', null);
};

export const getMapCenterFromHashParams = () => {
    const value = getHashParamValueByKey('mapCenter');

    if (!value) {
        return null;
    }

    const [lon, lat, zoom] = value.split(',').map((d) => +d);

    return {
        center: {
            lon,
            lat,
        },
        zoom,
    };
};

const decodeURLParams = (): IURLParamData => {
    hashParams = new URLSearchParams(window.location.hash.slice(1));

    // const localChangesOnly =
    //     getHashParamValueByKey('localChangesOnly') === 'true' ? true : false;

    const selected = getHashParamValueByKey('selected')
        ? getHashParamValueByKey('selected')
              .split(',')
              .map((d) => +d)
        : null;

    const active = getHashParamValueByKey('active')
        ? +getHashParamValueByKey('active')
        : null;

    const mapExtent = getMapExtent();

    const isSwipeWidgetOpen = getHashParamValueByKey('swipeWidget')
        ? true
        : false;

    const swipeWidgetLayers = isSwipeWidgetOpen
        ? getHashParamValueByKey('swipeWidget')
              .split(',')
              .map((d) => +d)
        : [];

    const animationSpeed = getHashParamValueByKey('animationSpeed')
        ? +getHashParamValueByKey('animationSpeed')
        : null;

    const rNum4FramesToExclude = getHashParamValueByKey('framesToExclude')
        ? getHashParamValueByKey('framesToExclude')
              .split(',')
              .map((rNum) => +rNum)
        : [];

    const isDownloadDialogOpen =
        getHashParamValueByKey('downloadMode') === 'true' ? true : false;

    const urlParams: IURLParamData = {
        mapExtent,
        rNum4SelectedWaybackItems: selected,
        // shouldOnlyShowItemsWithLocalChange: localChangesOnly,
        rNum4ActiveWaybackItem: active,
        isSwipeWidgetOpen,
        rNum4SwipeWidgetLeadingLayer: swipeWidgetLayers[0] || null,
        rNum4SwipeWidgetTrailingLayer: swipeWidgetLayers[1] || null,
        animationSpeed,
        rNum4FramesToExclude,
        isDownloadDialogOpen,
    };

    return urlParams;
};

export {
    decodeURLParams,
    saveMapExtentInURLQueryParam,
    // saveLocalChangesOnlyInURLQueryParam,
    saveReleaseNum4SelectedWaybackItemsInURLQueryParam,
    saveReleaseNum4ActiveWaybackItemInURLQueryParam,
    saveSwipeWidgetInfoInURLQueryParam,
    saveAnimationSpeedInURLQueryParam,
    saveFrames2ExcludeInURLQueryParam,
};
