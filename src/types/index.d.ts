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

export {
    IWaybackItem
}