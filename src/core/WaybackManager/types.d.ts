import { IPointGeomety, IMapPointInfo } from '../../types/index';

interface IParamsQueryMetadata {
    pointGeometry:IPointGeomety
    zoom:number
    releaseNum:number
}

// interface IParamsFindChanges {
//     pointInfo:IMapPointInfo
// }

export {
    IParamsQueryMetadata
}