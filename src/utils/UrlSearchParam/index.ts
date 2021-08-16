import { urlFns } from 'helper-toolkit-ts';
import { updateQueryParam, updateHashParam } from 'helper-toolkit-ts/dist/url';
import { IURLParamData, IExtentGeomety } from '../../types';

type ParamKey =
    | 'ext'
    | 'localChangesOnly'
    | 'selected'
    | 'active'
    // | 'portal'
    | 'swipeWidget';

type SaveSwipeWidgetInfoInURLQueryParam = (params: {
    isOpen: boolean;
    rNum4SwipeWidgetLeadingLayer?: number;
    rNum4SwipeWidgetTrailingLayer?: number;
}) => void;

type URLData = {
    [key in ParamKey]: string;
}

const urlQueryData: URLData = urlFns.parseQuery();

const urlHashData: URLData = urlFns.parseHash();

const getMapExtent = (urlData:URLData): IExtentGeomety => {
    // const urlQueryData: {
    //     [key in searchParamKey]: string;
    // } = urlFns.parseQuery();

    const ext = urlData.ext
        ? urlData.ext.split(',').map((d) => +d)
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

    updateHashParam({
        key,
        value,
    });
};

const saveLocalChangesOnlyInURLQueryParam = (
    localChangesOnly: boolean
): void => {
    const key: ParamKey = 'localChangesOnly';
    const value = localChangesOnly ? 'true' : '';

    updateHashParam({
        key,
        value,
    });
};

const saveReleaseNum4SelectedWaybackItemsInURLQueryParam = (
    rNum4SelectedWaybackItems: number[]
): void => {
    const key: ParamKey = 'selected';
    const value = rNum4SelectedWaybackItems.length
        ? rNum4SelectedWaybackItems.join(',')
        : '';

    updateHashParam({
        key,
        value,
    });
};

const saveReleaseNum4ActiveWaybackItemInURLQueryParam = (
    rNum4ActiveWaybackItem: number
): void => {
    const key: ParamKey = 'active';
    const value = rNum4ActiveWaybackItem
        ? rNum4ActiveWaybackItem.toString()
        : '';

    updateHashParam({
        key,
        value,
    });
};

const saveSwipeWidgetInfoInURLQueryParam: SaveSwipeWidgetInfoInURLQueryParam = ({
    isOpen,
    rNum4SwipeWidgetLeadingLayer,
    rNum4SwipeWidgetTrailingLayer,
}) => {
    const key: ParamKey = 'swipeWidget';
    const value = isOpen
        ? `${rNum4SwipeWidgetLeadingLayer},${rNum4SwipeWidgetTrailingLayer}`
        : '';

    updateHashParam({
        key,
        value,
    });
};

const decodeURLParams = (): IURLParamData => {

    const urlData:URLData = Object.keys(urlHashData).length
        ? urlHashData
        : urlQueryData;
    // console.log(urlData)

    const localChangesOnly =
        urlData.localChangesOnly === 'true' ? true : false;

    const selected = urlData.selected
        ? urlData.selected.split(',').map((d) => +d)
        : null;

    const active = urlData.active ? +urlData.active : null;

    const mapExtent = getMapExtent(urlData);

    const isSwipeWidgetOpen = urlData.swipeWidget ? true : false;

    const swipeWidgetLayers = isSwipeWidgetOpen
        ? urlData.swipeWidget.split(',').map((d) => +d)
        : [];

    const urlParams: IURLParamData = {
        mapExtent,
        rNum4SelectedWaybackItems: selected,
        shouldOnlyShowItemsWithLocalChange: localChangesOnly,
        rNum4ActiveWaybackItem: active,
        isSwipeWidgetOpen,
        rNum4SwipeWidgetLeadingLayer: swipeWidgetLayers[0] || null,
        rNum4SwipeWidgetTrailingLayer: swipeWidgetLayers[1] || null,
    };

    // the app used to save UI states in URL Search Params, which is not ideal as it makes very hard for the CDN to cache all of those URLs,
    // this is the reason why we switched from using Search Params to Hash Params. And we need to remove Search Params from the URL to keep the URL clean and unique.
    if(Object.keys(urlQueryData).length){
        // remove the query string from URL
        window.history.pushState({}, document.title, window.location.pathname);
    }

    return urlParams;
};

export {
    decodeURLParams,
    saveMapExtentInURLQueryParam,
    saveLocalChangesOnlyInURLQueryParam,
    saveReleaseNum4SelectedWaybackItemsInURLQueryParam,
    saveReleaseNum4ActiveWaybackItemInURLQueryParam,
    saveSwipeWidgetInfoInURLQueryParam,
};
