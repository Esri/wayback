import config from '../../app-config';
import axios from 'axios';

import { getServiceUrl } from '../../utils/Tier';
import { IWaybackItem, IWaybackConfig, IMapPointInfo } from '../../types/index';
import { IParamsQueryMetadata } from './types';
import { extractDateFromWaybackItemReleaseDate } from './helpers';
import IMapView from 'esri/views/MapView';
import MetadataManager from './Metadata';
import ChangeDetector from './ChangeDetector';

interface IProps {
    mapView?: IMapView;
}

class WaybackManager {
    // module to query the wayback metadata
    private metadataManager: MetadataManager;
    private changeDetector: ChangeDetector;

    // original wayback config JSON file
    private waybackconfig: IWaybackConfig;

    // array of wayback items with more attributes
    private waybackItems: Array<IWaybackItem>;

    // constructor() {}

    async init() {
        this.waybackconfig = await this.fetchWaybackConfig();

        this.waybackItems = this.getWaybackItems();

        this.metadataManager = new MetadataManager(this.waybackconfig);

        this.changeDetector = new ChangeDetector({
            waybackMapServerBaseUrl: getServiceUrl('wayback-imagery-base'),
            changeDetectionLayerUrl: getServiceUrl(
                'wayback-change-detector-layer'
            ),
            waybackconfig: this.waybackconfig,
            waybackItems: this.waybackItems,
            shouldUseChangdeDetectorLayer:
                config.shouldUseWaybackFootprintsLayer,
        });

        return {
            waybackItems: this.waybackItems,
        };
    }

    getWaybackItems() {
        const waybackItemKeys = Object.keys(this.waybackconfig);

        const waybackItems = Object.keys(this.waybackconfig).map(
            (key: string) => {
                const releaseNum = +key;

                const waybackconfigItem = this.waybackconfig[+releaseNum];

                const releaseDate = extractDateFromWaybackItemReleaseDate(
                    waybackconfigItem.itemReleaseDate
                );

                const waybackItem = {
                    releaseNum,
                    ...releaseDate,
                    ...waybackconfigItem,
                };

                return waybackItem;
            }
        );

        waybackItems.sort((a, b) => {
            return b.releaseDatetime.getTime() - a.releaseDatetime.getTime();
        });

        return waybackItems;
    }

    async getLocalChanges(pointInfo: IMapPointInfo, currentZoomLevel: number) {
        try {
            // NOTE: console.log() to see what pointInfo is passed to changeDetector.findChanges()
            console.log(
                pointInfo.latitude,
                pointInfo.longitude,
                currentZoomLevel
            );

            const localChangeQueryRes = await this.changeDetector.findChanges(
                pointInfo,
                currentZoomLevel
            );

            return localChangeQueryRes;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async getMetadata(params: IParamsQueryMetadata) {
        try {
            // NOTE console.log() to see what 'params'
            //  are passed into queryData()
            console.log(params);
            const metadataQueryRes = await this.metadataManager.queryData(
                params
            );
            return metadataQueryRes;
            // catch any errors
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    private fetchWaybackConfig(): Promise<IWaybackConfig> {
        const requestUrl = getServiceUrl('wayback-config');

        return new Promise((resolve, reject) => {
            axios
                .get(requestUrl)
                .then((response) => {
                    // handle success
                    if (response.data) {
                        // NOTE: using console.log() to test new waybackconfig.json
                        resolve(response.data);
                    } else {
                        reject({
                            error: 'failed to fetch wayback config data',
                        });
                    }
                })
                .catch((error) => {
                    // handle error
                    console.log(error);
                    reject(error);
                });
        });
    }
}

export default WaybackManager;
