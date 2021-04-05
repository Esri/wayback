import IPortal from 'esri/portal/Portal';
import ICredential from 'esri/identity/Credential';

interface IWaybackConfig {
    [key: number]: {
        itemID: string;
        itemTitle: string;
        itemURL: string;
        metadataLayerItemID: string;
        metadataLayerUrl: string;
        itemReleaseName: string;
        layerIdentifier?:string;
    };
}

interface IWaybackItem {
    releaseNum: number;
    releaseDateLabel: string;
    releaseDatetime: number;
    itemReleaseName: string;
    itemID: string;
    itemTitle: string;
    itemURL: string;
    metadataLayerItemID: string;
    metadataLayerUrl: string;
    layerIdentifier?:string;
}

interface IPointGeomety {
    x: number;
    y: number;
    spatialReference: {
        latestWkid: number;
        wkid: number;
    };
}

interface IExtentGeomety {
    xmax: number;
    xmin: number;
    ymax: number;
    ymin: number;
    spatialReference: {
        latestWkid?: number;
        wkid: number;
    };
}

interface IMapPointInfo {
    longitude: number;
    latitude: number;
    zoom: number;
    geometry: IPointGeomety;
}

interface IWaybackMetadataQueryResult {
    date: number;
    provider: string;
    source: string;
    resolution: number;
    accuracy: number;
    releaseDate?: string;
}

interface IScreenPoint {
    x: number;
    y: number;
}

interface IUserSession {
    portal: IPortal;
    credential: ICredential;
}

interface ISearchParamData {
    mapExtent?: IExtentGeomety;
    rNum4SelectedWaybackItems?: Array<number>;
    shouldOnlyShowItemsWithLocalChange?: boolean;
    rNum4ActiveWaybackItem?: number;
    isSwipeWidgetOpen?: boolean;
    rNum4SwipeWidgetLeadingLayer?: number;
    rNum4SwipeWidgetTrailingLayer?: number;
}

interface IStaticTooltipData {
    content: string;
    top: number;
    left: number;
}

type ValidServiceUrlNames =
    | 'portal-url'
    | 'wayback-imagery-base'
    | 'wayback-config'
    | 'wayback-change-detector-layer'
    | 'reference-layer'
    | 'world-imagery-basemap';

interface IAppConfig {
    appId: string;
    shouldUseWaybackFootprintsLayer: boolean;
    productionEnv: {
        serviceUrls: {
            [name in ValidServiceUrlNames]: string;
        };
    };
    developmentEnv?: {
        serviceUrls: {
            [name in ValidServiceUrlNames]: string;
        };
    };
    defaultMapExtent?: {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
        spatialReference: {
            wkid: 4326;
        };
    };
}

export {
    IWaybackConfig,
    IWaybackItem,
    IMapPointInfo,
    IPointGeomety,
    IWaybackMetadataQueryResult,
    IScreenPoint,
    IUserSession,
    IExtentGeomety,
    ISearchParamData,
    IStaticTooltipData,
    ValidServiceUrlNames,
    IAppConfig,
};
