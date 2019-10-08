
import { urlFns } from 'helper-toolkit-ts';
import { ISearchParamData, IExtentGeomety } from '../../types'

type searchParamKey = 'ext' | 'localChangeOnly' | 'selected' | 'active';

const encodeSearchParam = ({
    mapExtent = null,
    rNum4SelectedWaybackItems = [],
    shouldOnlyShowItemsWithLocalChange = false,
    rNum4ActiveWaybackItem = null
}:ISearchParamData)=>{

    // console.log(mapExtent, rNum4SelectedWaybackItems, shouldOnlyShowItemsWithLocalChange, rNum4ActiveWaybackItem);

    const searchParams:{ [key in searchParamKey]: string} = {
        ext: mapExtent ? [ mapExtent.xmin, mapExtent.ymin, mapExtent.xmax, mapExtent.ymax ].join(',') : '',
        localChangeOnly: shouldOnlyShowItemsWithLocalChange ? 'true' : '',
        selected: rNum4SelectedWaybackItems.length ? rNum4SelectedWaybackItems.join(',') : '',
        active: rNum4ActiveWaybackItem ? rNum4ActiveWaybackItem.toString() : ''
    };

    const searchParamsString = Object.keys(searchParams)
        .map(key=>{
            return searchParams[key] ? `${key}=${searchParams[key]}` : '';
        })
        .filter(d=>d)
        .join('&');
    
    urlFns.updateQueryParamInUrl(searchParamsString);
};

const decodeSearchParam = ()=>{

    const urlQueryData:{
        [key in searchParamKey]: string
    } = urlFns.parseQuery();

    const localChangeOnly = urlQueryData.localChangeOnly === 'true' ? true : false;
    const selected = urlQueryData.selected ? urlQueryData.selected.split(',').map(d=>+d) : null;
    const active = urlQueryData.active ? +urlQueryData.active: null; 
    const ext = urlQueryData.ext ? urlQueryData.ext.split(',') : null;
    const mapExtent:IExtentGeomety = ext ? {
        xmin: +ext[0],
        ymin: +ext[1],
        xmax: +ext[2],
        ymax: +ext[3],
        spatialReference:{
            wkid: 4326
        }
    } : null;

    const searchParams:ISearchParamData = {
        mapExtent,
        rNum4SelectedWaybackItems: selected,
        shouldOnlyShowItemsWithLocalChange: localChangeOnly,
        rNum4ActiveWaybackItem: active
    }

    return searchParams;

};

export {
    encodeSearchParam,
    decodeSearchParam
}
