import { IPointGeomety, IMapPointInfo, IWaybackConfig } from '../../types/index';

interface IParamsQueryMetadata {
    pointGeometry:IPointGeomety
    zoom:number
    releaseNum:number
}

export {
    IParamsQueryMetadata
}