import axios from 'axios';
import { IWaybackItem, IUserSession, IExtentGeomety } from '../../types';
import { getServiceUrl } from '../../utils/Tier';

interface ICreateWebmapParams {
    title:string
    tags:string
    description:string
    mapExtent:IExtentGeomety

    userSession:IUserSession
    waybackItemsToSave?:Array<IWaybackItem>
}

interface IWaybackLayerInfo {
    templateUrl:string
    wmtsInfo: {
        url:string
    }
    visibility:boolean
    title:string
    type:string,
    layerType:string,
    itemId:string
}

interface IMetadataLayerInfo {
    itemId:string
    visibility:boolean
    opacity:number
    title:string
    layerType:string
    url:string
}

interface ICreateWebmapResponse {
    success:boolean,
    id:string,
    folder?:string
}

const createWebmap = async({
    title = '',
    tags = '',
    description = '',
    userSession = null,
    mapExtent = null,
    waybackItemsToSave = []
}:ICreateWebmapParams):Promise<ICreateWebmapResponse>=>{

    if(!waybackItemsToSave.length){
        return null;
    }

    const requestUrl = getRequestUrl(userSession);

    const formData = new FormData();
    
    const uploadRequestContent = {
        title,
        description,
        tags,
        extent: mapExtent ? [mapExtent.xmin, mapExtent.ymin, mapExtent.xmax, mapExtent.ymax].join(',') : null,
        snippet: getSnippetStr(waybackItemsToSave),
        text: getRequestText(waybackItemsToSave),
        type: 'Web Map',
        overwrite: 'true',
        f: 'json',
        token: userSession.credential.token
    };

    Object.keys(uploadRequestContent).map(key=>{
        formData.append(key, uploadRequestContent[key]);
    });

    try {
        const createWebmapResponse = await axios.post(requestUrl, formData);
        console.log(createWebmapResponse);

        return createWebmapResponse.data && !createWebmapResponse.data.error ? createWebmapResponse.data : null;
    } catch(err){
        console.error(err)
        return null;
    }
};

const getRequestUrl = (userSession:IUserSession)=>{
    const credential = userSession.credential;
    return credential ? `${credential.server}/sharing/rest/content/users/${credential.userId}/addItem` : '';
};

const getRequestText = (waybackItems:Array<IWaybackItem>)=>{

    const requestText = {  
        "operationalLayers": getOperationalLayers(waybackItems),
        "baseMap":{  
            "baseMapLayers":[  
                {  
                    "id":"defaultBasemap",
                    "layerType":"ArcGISTiledMapServiceLayer",
                    "url":"https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/",
                    "visibility": true,
                    "opacity": 1,
                    "title": "World Imagery"
                },
                {
                    "id": "World_Boundaries_and_Places",
                    "layerType": "ArcGISTiledMapServiceLayer",
                    "url": "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer",
                    "visibility": true,
                    "opacity": 1,
                    "title": "World Boundaries and Places",
                    "isReference": true
                }
            ],
            "title":"Imagery with Labels"
        },
        "spatialReference":{"wkid":102100,"latestWkid":3857},
        "version": "2.15"
    };

    return JSON.stringify(requestText);
}

const getOperationalLayers = (waybackItems:Array<IWaybackItem>)=>{

    const operationalLayers:Array<IWaybackLayerInfo | IMetadataLayerInfo> = [];

    waybackItems.forEach((waybackItem, index)=>{

        const isVisible = ( index === 0 ) ? true : false;

        const waybackLayerInfo:IWaybackLayerInfo = {
            "templateUrl": waybackItem.itemURL,
            "wmtsInfo": {
                "url": getServiceUrl("wayback-imagery-base")
            },
            "visibility": isVisible,
            "title": waybackItem.itemTitle,
            "type": "WebTiledLayer",
            "layerType": "WebTiledLayer",
            "itemId": waybackItem.itemID
        };

        const metadataLayerTitle = "Metadata for " + waybackItem.itemTitle;

        const metadataLayerInfo:IMetadataLayerInfo = {
            "itemId": waybackItem.metadataLayerItemID,
            "visibility": isVisible,
            "opacity": 1,
            "title": metadataLayerTitle,
            "layerType": "ArcGISMapServiceLayer",
            "url": waybackItem.metadataLayerUrl
        };

        operationalLayers.push(waybackLayerInfo, metadataLayerInfo);
    });

    return operationalLayers;
};

const getSnippetStr = (waybackItems:Array<IWaybackItem>)=>{
    const releaseDates = waybackItems.map(d=>d.releaseDateLabel);
    let snippetStr = 'Wayback imagery from ';
    snippetStr += releaseDates.slice(0, releaseDates.length - 1).join(', '); // concat all items but the last one, so we will have "a, b, c"
    snippetStr += ' and ' + releaseDates[releaseDates.length - 1] // add last one to str with and in front, so we will have "a, b, c and d"
    return snippetStr;
}

export default createWebmap;