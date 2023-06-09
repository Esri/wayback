import {
    IPointGeomety,
    // IMapPointInfo,
    // IWaybackConfig,
} from '@typings/index';

interface IParamsQueryMetadata {
    pointGeometry: IPointGeomety;
    zoom: number;
    releaseNum: number;
}

export { IParamsQueryMetadata };
