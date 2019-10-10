import config from '../../config';
import axios from 'axios';

import { IWaybackItem, IWaybackConfig, IMapPointInfo } from '../../types/index';
import { IParamsQueryMetadata } from './types';
import { extractDateFromWaybackItemTitle } from './helpers';
import MetadataManager from './Metadata';
import ChangeDetector from './ChangeDetector';

class WaybackManager {

    private isDev = false;

    // module to query the wayback metadata
    private metadataManager:MetadataManager;
    private changeDetector:ChangeDetector;

    // original wayback config JSON file
    private waybackconfig:IWaybackConfig;

    // array of wayback items with more attributes
    private waybackItems:Array<IWaybackItem>;

    constructor({
        isDev = false
    }={}){
        this.isDev = isDev;
    }

    async init(){

        this.waybackconfig = await this.fetchWaybackConfig();
        // console.log(this.waybackconfig);

        this.metadataManager = new MetadataManager(this.waybackconfig);

        this.changeDetector = new ChangeDetector({
            url: this.isDev ? config.dev["wayback-change-detector-layer"] : config.dev["wayback-change-detector-layer"],
            waybackconfig: this.waybackconfig
        });

        this.waybackItems = this.getWaybackItems();

        return {
            waybackItems: this.waybackItems
        };
    }

    getWaybackItems(){

        const waybackItems = Object.keys(this.waybackconfig).map((key:string)=>{

            const releaseNum = +key;

            const waybackconfigItem = this.waybackconfig[+releaseNum];

            const releaseDate = extractDateFromWaybackItemTitle(waybackconfigItem.itemTitle);

            const waybackItem = {
                releaseNum,
                ...releaseDate,
                ...waybackconfigItem
            };

            return waybackItem;
        });

        waybackItems.sort((a,b)=>{
            return b.releaseDatetime.getTime() - a.releaseDatetime.getTime();
        });

        return waybackItems;
    }

    async getLocalChanges(pointInfo:IMapPointInfo){
        try {
            const localChangeQueryRes = await this.changeDetector.findChanges(pointInfo);
            return localChangeQueryRes;
        } catch(err){
            console.error(err);
            return null;
        }
    }

    async getMetadata(params:IParamsQueryMetadata){

        try {
            const metadataQueryRes = await this.metadataManager.queryData(params);
            return metadataQueryRes;
        } catch(err){
            console.error(err);
            return null;
        }
    }

    private fetchWaybackConfig():Promise<IWaybackConfig>{
        const requestUrl = this.isDev ? config.dev["wayback-config"] : config.prod["wayback-config"];

        return new Promise((resolve, reject)=>{

            axios.get(requestUrl)
            .then((response)=>{
                // handle success
                // console.log(response);

                if(response.data){
                    resolve(response.data)
                } else {
                    reject({
                        error: 'failed to fetch wayback config data'
                    });
                }
            })
            .catch((error)=>{
                // handle error
                console.log(error);
                reject(error);
            });

        });
    };


}

export default WaybackManager;