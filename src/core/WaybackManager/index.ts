import config from '../../config';
import axios from 'axios';

import { IWaybackItem } from '../../types/index';
import { extractDateFromWaybackItemTitle } from './helpers';

interface IWaybackConfig {
    [key:number]: {
        itemID:string,
        itemTitle:string,
        itemURL:string,
        metadataLayerItemID:string,
        metadataLayerUrl:string
    }
}

class WaybackManager {

    private isDev = false;

    // original wayback config JSON file
    private waybackconfig:IWaybackConfig;

    // array of wayback items with more attributes
    private waybackItems:Array<IWaybackItem>;

    constructor(){

    }

    async init(){

        this.waybackconfig = await this.fetchWaybackConfig();

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

    private fetchWaybackConfig():Promise<IWaybackConfig>{
        const requestUrl = this.isDev ? config["wayback-config"].dev : config["wayback-config"].prod;

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