import { queryFeatures, IQueryFeaturesResponse, IFeature  } from '@esri/arcgis-rest-feature-layer';

import { IParamsFindChanges } from './types';
import config from './config';

class WaybackChangeDetector {

    private url:string

    constructor({
        url = ''
    }={}){
        this.url = url;
    }

    // get array of release numbers for wayback items that come with changes for input area
    async findChanges({
        pointGeometry = null,
        zoom = 0
    }:IParamsFindChanges):Promise<Array<number>>{

        try {

            const queryUrl = this.url + '/query';

            const fields = config["change-detection-layer"].fields

            const FIELD_NAME_ZOOM = fields[0].fieldname;
            const FIELD_NAME_RELEASE_NUM = fields[1].fieldname;

            const queryResponse = await queryFeatures({
                url: queryUrl,
                geometry: pointGeometry,
                geometryType: 'esriGeometryPoint',
                spatialRel: 'esriSpatialRelIntersects',
                where: `${FIELD_NAME_ZOOM} = ${zoom}`,
                outFields: [FIELD_NAME_RELEASE_NUM],
                returnGeometry: false,
                f: 'json'
            }) as IQueryFeaturesResponse;
    
            const features:Array<IFeature> = queryResponse.features || [];

            const rNums = features.map(feature=>{
                return feature.attributes[FIELD_NAME_RELEASE_NUM]
            })

            return rNums;

        } catch(err){
            console.error('failed to find changes', err);
            return null;
        }
    }
}

export default WaybackChangeDetector;