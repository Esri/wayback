import {
    queryFeatures,
    IQueryFeaturesResponse,
    IFeature,
} from '@esri/arcgis-rest-feature-layer';
import { IWaybackConfig, IWaybackMetadataQueryResult } from '../../types/index';
import { IParamsQueryMetadata } from './types';
import config from './config';

class MetadataManager {
    // original wayback config JSON file
    private waybackconfig: IWaybackConfig;

    // can only get metadata when the map is between the min and max zoom level (10 <= mapZoom <= 23)
    private readonly MAX_ZOOM = 22;
    private readonly MIN_ZOOM = 9;

    constructor(waybackconfig: IWaybackConfig) {
        this.waybackconfig = waybackconfig;
    }

    // setWaybackConfig(waybackconfig:IWaybackConfig){
    //     this.waybackconfig = waybackconfig;
    //     // console.log('set waybackconfig for metadata manager', waybackconfig);
    // }

    async queryData(
        params: IParamsQueryMetadata
    ): Promise<IWaybackMetadataQueryResult> {

        const fields = config['metadata-layer'].fields;

        const FIELD_NAME_SRC_DATE = fields[0].fieldname;
        const FIELD_NAME_SRC_PROVIDER = fields[1].fieldname;
        const FIELD_NAME_SRC_NAME = fields[2].fieldname;
        const FIELD_NAME_SRC_RES = fields[3].fieldname;
        const FIELD_NAME_SRC_ACC = fields[4].fieldname;

        const queryUrl = this.getQueryUrl(params.releaseNum, params.zoom);

        const outFields = fields.map((d) => d.fieldname);

        try {
            const queryResponse = (await queryFeatures({
                url: queryUrl,
                geometry: params.pointGeometry,
                geometryType: 'esriGeometryPoint',
                spatialRel: 'esriSpatialRelIntersects',
                outFields,
                returnGeometry: false,
                f: 'json',
            })) as IQueryFeaturesResponse;

            const feature: IFeature =
                queryResponse.features && queryResponse.features.length
                    ? queryResponse.features[0]
                    : null;

            const date = feature.attributes[FIELD_NAME_SRC_DATE];
            const provider = feature.attributes[FIELD_NAME_SRC_PROVIDER];
            const source = feature.attributes[FIELD_NAME_SRC_NAME];
            const resolution = feature.attributes[FIELD_NAME_SRC_RES];
            const accuracy = feature.attributes[FIELD_NAME_SRC_ACC];

            return {
                date,
                provider,
                source,
                resolution,
                accuracy,
            };
        } catch (err) {
            return null;
        }
    }

    private getQueryUrl(releaseNum: number, zoom: number) {
        const metadataLayerUrl = this.waybackconfig[releaseNum]
            .metadataLayerUrl;
        const layerId = this.getLayerId(zoom);

        return `${metadataLayerUrl}/${layerId}/query`;
    }

    private getLayerId(zoom: number) {
        zoom = +zoom;
        
        const layerID = this.MAX_ZOOM - zoom;
        
        // the service has 14 sub layers that provide metadata up to zoom level 10 (layer ID 14), if the zoom level is small that (e.g. 5), there are no metadata
        const layerIdForMinZoom = this.MAX_ZOOM - this.MIN_ZOOM;

        // what is going on here? ...console.log() since this code has little to no comments on what (the heck) is going on
        // console.log(this.MAX_ZOOM, this.MIN_ZOOM)
        // console.log(zoom)
        // console.log(layerIdForMinZoom)
        // console.log(layerID)

        return layerID <= layerIdForMinZoom ? layerID : layerIdForMinZoom;
    }
}

export default MetadataManager;
