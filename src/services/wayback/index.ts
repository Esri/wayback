// /* Copyright 2024 Esri
//  *
//  * Licensed under the Apache License Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import config from '../../app-config';
// import axios from 'axios';

// import { getServiceUrl } from '@utils/Tier';
// import { IWaybackItem, IWaybackConfig, IMapPointInfo } from '@typings/index';
// import { IParamsQueryMetadata } from './types';
// import { extractDateFromWaybackItemTitle } from './helpers';
// import MetadataManager from './Metadata';
// import ChangeDetector from './ChangeDetector';
// import { getRoundedDate } from 'helper-toolkit-ts/dist/date';

// class WaybackManager {
//     // module to query the wayback metadata
//     private metadataManager: MetadataManager;
//     private changeDetector: ChangeDetector;

//     // original wayback config JSON file
//     private waybackconfig: IWaybackConfig;

//     // array of wayback items with more attributes
//     private waybackItems: Array<IWaybackItem>;

//     // constructor() {}

//     async init() {
//         this.waybackconfig = await this.fetchWaybackConfig();
//         // console.log(this.waybackconfig);

//         this.waybackItems = this.getWaybackItems();

//         this.metadataManager = new MetadataManager(this.waybackconfig);

//         this.changeDetector = new ChangeDetector({
//             waybackMapServerBaseUrl: getServiceUrl('wayback-imagery-base'),
//             changeDetectionLayerUrl: getServiceUrl(
//                 'wayback-change-detector-layer'
//             ),
//             waybackconfig: this.waybackconfig,
//             waybackItems: this.waybackItems,
//             shouldUseChangdeDetectorLayer:
//                 config.shouldUseWaybackFootprintsLayer,
//         });

//         return {
//             waybackItems: this.waybackItems,
//         };
//     }

//     getWaybackItems() {
//         const waybackItems = Object.keys(this.waybackconfig).map(
//             (key: string) => {
//                 const releaseNum = +key;

//                 const waybackconfigItem = this.waybackconfig[+releaseNum];

//                 const releaseDate = extractDateFromWaybackItemTitle(
//                     waybackconfigItem.itemTitle
//                 );

//                 const waybackItem = {
//                     releaseNum,
//                     ...releaseDate,
//                     ...waybackconfigItem,
//                 };

//                 return waybackItem;
//             }
//         );

//         waybackItems.sort((a, b) => {
//             return b.releaseDatetime - a.releaseDatetime;
//         });

//         return waybackItems;
//     }

//     async getLocalChanges(pointInfo: IMapPointInfo) {
//         try {
//             const localChangeQueryRes = await this.changeDetector.findChanges(
//                 pointInfo
//             );
//             return localChangeQueryRes;
//         } catch (err) {
//             console.error(err);
//             return null;
//         }
//     }

//     async getMetadata(params: IParamsQueryMetadata) {
//         try {
//             const metadataQueryRes = await this.metadataManager.queryData(
//                 params
//             );
//             return metadataQueryRes;
//         } catch (err) {
//             console.error(err);
//             return null;
//         }
//     }

//     private fetchWaybackConfig(): Promise<IWaybackConfig> {
//         // make sure we can get the latest version of the wayback config file
//         const requestUrl =
//             getServiceUrl('wayback-config') + `?modified=${getRoundedDate(5)}`;

//         return new Promise((resolve, reject) => {
//             axios
//                 .get(requestUrl)
//                 .then((response) => {
//                     // handle success
//                     // console.log(response);

//                     if (response.data) {
//                         resolve(response.data);
//                     } else {
//                         reject({
//                             error: 'failed to fetch wayback config data',
//                         });
//                     }
//                 })
//                 .catch((error) => {
//                     // handle error
//                     console.log(error);
//                     reject(error);
//                 });
//         });
//     }
// }

// export default WaybackManager;
