import IPortal from "esri/portal/Portal";
import ICredential from "esri/identity/Credential";

interface IWaybackConfig {
    [key:number]: {
        itemID:string,
        itemTitle:string,
        itemURL:string,
        metadataLayerItemID:string,
        metadataLayerUrl:string
    }
}

interface IWaybackItem {
    releaseNum:number,
    releaseDateLabel:string,
    releaseDatetime:Date
    itemID:string,
    itemTitle:string,
    itemURL:string,
    metadataLayerItemID:string,
    metadataLayerUrl:string
}

interface IPointGeomety {
    x:number,
    y:number,
    spatialReference:{
        latestWkid: number, 
        wkid: number
    }
}

interface IMapPointInfo {
    longitude:number,
    latitude:number,
    zoom:number,
    geometry:IPointGeomety
}

interface IWaybackMetadataQueryResult {
    date:number,
    provider:string,
    source:string,
    resolution:number,
    accuracy:number,
}

interface IScreenPoint {
    x:number,
    y:number
}

interface IUserSession {
    portal:IPortal,
    credential:ICredential
}

export {
    IWaybackConfig,
    IWaybackItem,
    IMapPointInfo,
    IPointGeomety,
    IWaybackMetadataQueryResult,
    IScreenPoint,
    IUserSession
}