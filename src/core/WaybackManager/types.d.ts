import { IPointGeomety } from '../../types/index';

interface IParamsQueryMetadata {
    pointGeometry:IPointGeomety
    zoom:number
    releaseNum:number
}

interface IParamsFindChanges {
    pointGeometry:IPointGeomety
    zoom:number
}

export {
    IParamsQueryMetadata,
    IParamsFindChanges
}