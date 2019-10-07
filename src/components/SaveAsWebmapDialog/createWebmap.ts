import { IWaybackItem, IUserSession } from '../../types';

interface ICreateWebmapParams {
    title:string
    tags:string
    description:string

    userSession:IUserSession
    waybackItemsToSave?:Array<IWaybackItem>
}

const createWebmap = async({
    title = '',
    tags = '',
    description = '',
    userSession = null,
    waybackItemsToSave = []
}:ICreateWebmapParams)=>{

    const snippet = getSnippetStr();
    
    const uploadRequestContent = {
        title,
        snippet,
        description,
        tags,
        // 'extent': [currentMapExtent.xmin, currentMapExtent.ymin, currentMapExtent.xmax, currentMapExtent.ymax].join(','),
        type: 'Web Map',
        overwrite: 'true',
        f: 'json'
    };

    const operationalLayersInfo = waybackItemsToSave.map((waybackItem, index)=>{

        const isVisible = ( index === 0 ) ? true : false;

        const waybackLayerInfo = {
            "templateUrl": waybackItem.itemURL,
            "wmtsInfo": {
                // "url": URL_WAYBACK_IMAGERY_BASE
            },
            "visibility": isVisible,
            "title": waybackItem.itemTitle,
            "type": "WebTiledLayer",
            "layerType": "WebTiledLayer",
            "itemId": waybackItem.itemID
        };

        const metadataLayerTitle = "Metadata for " + waybackItem.itemTitle;

        const metadataLayerInfo = {
            "itemId": waybackItem.metadataLayerItemID,
            "visibility": isVisible,
            "opacity": 1,
            "title": metadataLayerTitle,
            "layerType": "ArcGISMapServiceLayer",
            "url": waybackItem.metadataLayerUrl
        };

        return {
            waybackLayerInfo, 
            metadataLayerInfo
        }
    });

    const requestText = {  
        "operationalLayers": operationalLayersInfo,
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
        "spatialReference":{"wkid":102100,"latestWkid":3857}
    };

};

const getSnippetStr = ()=>{
    return 'I am snippet';
}

export default createWebmap;