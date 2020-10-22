import { urlFns } from 'helper-toolkit-ts';
import { ISearchParamData, IExtentGeomety } from '../../types';

type searchParamKey =
    | 'ext'
    | 'localChangesOnly'
    | 'selected'
    | 'active'
    | 'portal'
    | 'swipeWidget'

const getPortalUrlInSearchParam = () => {
    const urlQueryData: {
        [key in searchParamKey]: string;
    } = urlFns.parseQuery();

    return urlQueryData.portal || '';
};

const getMapExtent = () => {
    const urlQueryData: {
        [key in searchParamKey]: string;
    } = urlFns.parseQuery();

    const ext = urlQueryData.ext ? urlQueryData.ext.split(',') : null;

    const mapExtent: IExtentGeomety = ext
        ? {
              xmin: +ext[0],
              ymin: +ext[1],
              xmax: +ext[2],
              ymax: +ext[3],
              spatialReference: {
                  wkid: 4326,
              },
          }
        : null;

    return mapExtent;
};

const encodeSearchParam = ({
    mapExtent = null,
    rNum4SelectedWaybackItems = [],
    shouldOnlyShowItemsWithLocalChange = false,
    rNum4ActiveWaybackItem = null,
    isSwipeWidgetOpen=false,
    rNum4SwipeWidgetLeadingLayer=null,
    rNum4SwipeWidgetTrailingLayer=null
}: ISearchParamData) => {
    // console.log(mapExtent, rNum4SelectedWaybackItems, shouldOnlyShowItemsWithLocalChange, rNum4ActiveWaybackItem);

    const searchParams: { [key in searchParamKey]: string } = {
        ext: mapExtent
            ? [mapExtent.xmin, mapExtent.ymin, mapExtent.xmax, mapExtent.ymax]
                  .map((d) => d.toFixed(5))
                  .join(',')
            : '',
        localChangesOnly: shouldOnlyShowItemsWithLocalChange ? 'true' : '',
        selected: rNum4SelectedWaybackItems.length
            ? rNum4SelectedWaybackItems.join(',')
            : '',
        active: rNum4ActiveWaybackItem ? rNum4ActiveWaybackItem.toString() : '',
        portal: getPortalUrlInSearchParam(),
        // concat release numbers for leading and trailing layers into comma separated string
        swipeWidget: isSwipeWidgetOpen 
            ? `${rNum4SwipeWidgetLeadingLayer},${rNum4SwipeWidgetTrailingLayer}` 
            : ''
    };

    const searchParamsString = Object.keys(searchParams)
        .map((key) => {
            return searchParams[key] ? `${key}=${searchParams[key]}` : '';
        })
        .filter((d) => d)
        .join('&');

    urlFns.updateQueryParamInUrl(searchParamsString);

    return location.href;
};

const decodeSearchParam = () => {
    const urlQueryData: {
        [key in searchParamKey]: string;
    } = urlFns.parseQuery();

    const localChangesOnly =
        urlQueryData.localChangesOnly === 'true' ? true : false;
    const selected = urlQueryData.selected
        ? urlQueryData.selected.split(',').map((d) => +d)
        : null;
    const active = urlQueryData.active ? +urlQueryData.active : null;
    const mapExtent = getMapExtent();
    const isSwipeWidgetOpen = urlQueryData.swipeWidget ? true : false;
    // const ext = urlQueryData.ext ? urlQueryData.ext.split(',') : null;
    // const mapExtent:IExtentGeomety = ext ? {
    //     xmin: +ext[0],
    //     ymin: +ext[1],
    //     xmax: +ext[2],
    //     ymax: +ext[3],
    //     spatialReference:{
    //         wkid: 4326
    //     }
    // } : null;

    const swipeWidgetLayers = urlQueryData.swipeWidget 
        ? urlQueryData.swipeWidget.split(',').map((d) => +d)
        : []

    const searchParams: ISearchParamData = {
        mapExtent,
        rNum4SelectedWaybackItems: selected,
        shouldOnlyShowItemsWithLocalChange: localChangesOnly,
        rNum4ActiveWaybackItem: active,
        isSwipeWidgetOpen,
        rNum4SwipeWidgetLeadingLayer: swipeWidgetLayers[0],
        rNum4SwipeWidgetTrailingLayer: swipeWidgetLayers[1]
    };

    return searchParams;
};

const savePortalUrlInSearchParam = (portalUrl = '') => {
    const key: searchParamKey = 'portal';
    if (portalUrl) {
        urlFns.updateQueryParam({
            key,
            value: portalUrl,
        });
    }
};

export {
    encodeSearchParam,
    decodeSearchParam,
    savePortalUrlInSearchParam,
    getPortalUrlInSearchParam,
    getMapExtent,
};
