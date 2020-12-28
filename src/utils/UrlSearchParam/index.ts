import { urlFns } from 'helper-toolkit-ts';
import { updateQueryParam } from 'helper-toolkit-ts/dist/url';
import { ISearchParamData, IExtentGeomety } from '../../types';

type searchParamKey =
    | 'ext'
    | 'localChangesOnly'
    | 'selected'
    | 'active'
    // | 'portal'
    | 'swipeWidget'

type SaveSwipeWidgetInfoInURLQueryParam = (params:{
    isOpen: boolean;
    rNum4SwipeWidgetLeadingLayer?:number, 
    rNum4SwipeWidgetTrailingLayer?:number
})=>void;

const urlQueryData: {
    [key in searchParamKey]: string;
} = urlFns.parseQuery();

const getMapExtent = (): IExtentGeomety => {
    // const urlQueryData: {
    //     [key in searchParamKey]: string;
    // } = urlFns.parseQuery();

    const ext = urlQueryData.ext ? urlQueryData.ext.split(',').map(d=>+d) : null;

    const mapExtent: IExtentGeomety = ext && ext.length === 4
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

// const encodeSearchParam = ({
//     mapExtent = null,
//     rNum4SelectedWaybackItems = [],
//     shouldOnlyShowItemsWithLocalChange = false,
//     rNum4ActiveWaybackItem = null,
//     isSwipeWidgetOpen=false,
//     rNum4SwipeWidgetLeadingLayer=null,
//     rNum4SwipeWidgetTrailingLayer=null
// }: ISearchParamData) => {
//     // console.log(mapExtent, rNum4SelectedWaybackItems, shouldOnlyShowItemsWithLocalChange, rNum4ActiveWaybackItem);

//     const searchParams: { [key in searchParamKey]: string } = {
//         ext: mapExtent
//             ? [mapExtent.xmin, mapExtent.ymin, mapExtent.xmax, mapExtent.ymax]
//                   .map((d) => d.toFixed(5))
//                   .join(',')
//             : '',
//         localChangesOnly: shouldOnlyShowItemsWithLocalChange ? 'true' : '',
//         selected: rNum4SelectedWaybackItems.length
//             ? rNum4SelectedWaybackItems.join(',')
//             : '',
//         active: rNum4ActiveWaybackItem ? rNum4ActiveWaybackItem.toString() : '',
//         // portal: getPortalUrlInSearchParam(),
//         // concat release numbers for leading and trailing layers into comma separated string
//         swipeWidget: isSwipeWidgetOpen 
//             ? `${rNum4SwipeWidgetLeadingLayer},${rNum4SwipeWidgetTrailingLayer}` 
//             : ''
//     };

//     const searchParamsString = Object.keys(searchParams)
//         .map((key) => {
//             return searchParams[key] ? `${key}=${searchParams[key]}` : '';
//         })
//         .filter((d) => d)
//         .join('&');

//     urlFns.updateQueryParamInUrl(searchParamsString);

//     return location.href;
// };

const saveMapExtentInURLQueryParam = (mapExtent:IExtentGeomety):void=>{
    const key:searchParamKey = 'ext'
    const value = mapExtent
        ? [ mapExtent.xmin, mapExtent.ymin, mapExtent.xmax, mapExtent.ymax ]
            .map((d) => d.toFixed(5))
            .join(',')
        : '';

    updateQueryParam({
        key,
        value
    });
    
}

const saveLocalChangesOnlyInURLQueryParam = (localChangesOnly:boolean):void=>{
    const key:searchParamKey = 'localChangesOnly'
    const value = localChangesOnly ? 'true' : '';

    updateQueryParam({
        key,
        value
    });
}

const saveReleaseNum4SelectedWaybackItemsInURLQueryParam = (rNum4SelectedWaybackItems:number[]):void=>{
    const key:searchParamKey = 'selected'
    const value = rNum4SelectedWaybackItems.length
        ? rNum4SelectedWaybackItems.join(',')
        : '';

    updateQueryParam({
        key,
        value
    });
}

const saveReleaseNum4ActiveWaybackItemInURLQueryParam = (rNum4ActiveWaybackItem:number):void=>{
    const key:searchParamKey = 'active'
    const value = rNum4ActiveWaybackItem ? rNum4ActiveWaybackItem.toString() : '';

    updateQueryParam({
        key,
        value
    });
}

const saveSwipeWidgetInfoInURLQueryParam:SaveSwipeWidgetInfoInURLQueryParam = ({
    isOpen, 
    rNum4SwipeWidgetLeadingLayer, 
    rNum4SwipeWidgetTrailingLayer
})=>{
    const key:searchParamKey = 'swipeWidget';
    const value = isOpen 
        ? `${rNum4SwipeWidgetLeadingLayer},${rNum4SwipeWidgetTrailingLayer}` 
        : '';

    updateQueryParam({
        key,
        value
    });
}

const decodeURLQueryParam = (): ISearchParamData => {

    const localChangesOnly =
        urlQueryData.localChangesOnly === 'true' ? true : false;

    const selected = urlQueryData.selected
        ? urlQueryData.selected.split(',').map((d) => +d)
        : null;

    const active = urlQueryData.active ? +urlQueryData.active : null;

    const mapExtent = getMapExtent();

    const isSwipeWidgetOpen = urlQueryData.swipeWidget ? true : false;

    const swipeWidgetLayers = isSwipeWidgetOpen
        ? urlQueryData.swipeWidget.split(',').map((d) => +d)
        : []

    const searchParams: ISearchParamData = {
        mapExtent,
        rNum4SelectedWaybackItems: selected,
        shouldOnlyShowItemsWithLocalChange: localChangesOnly,
        rNum4ActiveWaybackItem: active,
        isSwipeWidgetOpen,
        rNum4SwipeWidgetLeadingLayer: swipeWidgetLayers[0] || null,
        rNum4SwipeWidgetTrailingLayer: swipeWidgetLayers[1] || null
    };

    return searchParams;
};

export {
    decodeURLQueryParam,
    saveMapExtentInURLQueryParam,
    saveLocalChangesOnlyInURLQueryParam,
    saveReleaseNum4SelectedWaybackItemsInURLQueryParam,
    saveReleaseNum4ActiveWaybackItemInURLQueryParam,
    saveSwipeWidgetInfoInURLQueryParam
};
