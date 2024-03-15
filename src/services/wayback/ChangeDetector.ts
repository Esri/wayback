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

// import axios from 'axios';
// import {
//     queryFeatures,
//     IQueryFeaturesResponse,
//     IFeature,
// } from '@esri/arcgis-rest-feature-service';
// import { geometryFns } from 'helper-toolkit-ts';
// import { IWaybackConfig, IMapPointInfo, IWaybackItem } from '@typings/index';
// import config from './config';

// interface ICandidates {
//     rNum: number;
//     url: string;
// }

// interface IParamGetTileUrl {
//     rNum?: number;
//     column: number;
//     row: number;
//     level: number;
// }

// interface IOptionsWaybackChangeDetector {
//     waybackMapServerBaseUrl?: string;
//     changeDetectionLayerUrl?: string;
//     waybackconfig: IWaybackConfig;
//     shouldUseChangdeDetectorLayer?: boolean;
//     waybackItems: Array<IWaybackItem>;
// }

// interface IResponseGetImageBlob {
//     rNum: number;
//     dataUri: string;
// }

// interface IResponseWaybackTilemap {
//     data: Array<number>;
//     select: Array<number>;
//     valid: boolean;
//     location: {
//         left: number;
//         top: number;
//         width: number;
//         height: number;
//     };
// }

// class WaybackChangeDetector {
//     // original wayback config JSON file
//     private waybackconfig: IWaybackConfig;
//     private waybackMapServerBaseUrl: string;
//     private changeDetectionLayerUrl: string;
//     private shouldUseChangdeDetectorLayer: boolean;
//     private waybackItems: Array<IWaybackItem>;
//     private rNum2IndexLookup: { [key: number]: number };

//     constructor({
//         waybackMapServerBaseUrl = '',
//         changeDetectionLayerUrl = '',
//         waybackconfig = null,
//         shouldUseChangdeDetectorLayer = false,
//         waybackItems = [],
//     }: IOptionsWaybackChangeDetector) {
//         this.waybackMapServerBaseUrl = waybackMapServerBaseUrl;
//         this.changeDetectionLayerUrl = changeDetectionLayerUrl;
//         this.waybackconfig = waybackconfig;
//         this.waybackItems = waybackItems;
//         this.shouldUseChangdeDetectorLayer = shouldUseChangdeDetectorLayer;

//         // console.log('waybackItems', this.waybackItems);
//     }

//     // get array of release numbers for wayback items that come with changes for input area
//     async findChanges(pointInfo: IMapPointInfo): Promise<Array<number>> {
//         try {
//             const level = +pointInfo.zoom.toFixed(0);
//             const column = geometryFns.long2tile(pointInfo.longitude, level);
//             const row = geometryFns.lat2tile(pointInfo.latitude, level);

//             const candidatesRNums = this.shouldUseChangdeDetectorLayer
//                 ? await this.getRNumsFromDetectionLayer(pointInfo, level)
//                 : await this.getRNumsFromTilemap({ column, row, level });

//             const candidates = candidatesRNums.map((rNum) => {
//                 return {
//                     rNum,
//                     url: this.getTileImageUrl({ column, row, level, rNum }),
//                 };
//             });
//             // console.log(candidates)

//             const rNumsNoDuplicates = await this.removeDuplicates(candidates);
//             // console.log(rNumsNoDuplicates)

//             return rNumsNoDuplicates;
//         } catch (err) {
//             console.error('failed to find changes', err);
//             return null;
//         }
//     }

//     getPreviousReleaseNum(rNum: number) {
//         if (!this.rNum2IndexLookup) {
//             const lookup = {};

//             this.waybackItems.forEach((item, index) => {
//                 lookup[item.releaseNum] = index;
//             });

//             this.rNum2IndexLookup = lookup;
//         }

//         const index4InputRNum = this.rNum2IndexLookup[rNum];

//         const previousReleaseNum = this.waybackItems[index4InputRNum + 1]
//             ? this.waybackItems[index4InputRNum + 1].releaseNum
//             : null;

//         return previousReleaseNum;
//     }

//     async getRNumsFromTilemap({
//         column = null,
//         row = null,
//         level = null,
//     }: IParamGetTileUrl): Promise<Array<number>> {
//         return new Promise((resolve, reject) => {
//             const results: Array<number> = [];

//             const mostRecentRelease = this.waybackItems[0].releaseNum;

//             const tilemapRequest = async (rNum: number) => {
//                 try {
//                     const requestUrl = `${this.waybackMapServerBaseUrl}/tilemap/${rNum}/${level}/${row}/${column}`;

//                     const response = await axios.get(requestUrl);

//                     const tilemapResponse: IResponseWaybackTilemap =
//                         response.data || null;

//                     const lastRelease =
//                         tilemapResponse.select && tilemapResponse.select[0]
//                             ? +tilemapResponse.select[0]
//                             : rNum;

//                     if (tilemapResponse.data[0]) {
//                         results.push(lastRelease);
//                     }

//                     const nextReleaseToCheck = tilemapResponse.data[0]
//                         ? this.getPreviousReleaseNum(lastRelease)
//                         : null;

//                     if (nextReleaseToCheck) {
//                         tilemapRequest(nextReleaseToCheck);
//                     } else {
//                         resolve(results);
//                     }
//                 } catch (err) {
//                     console.error(err);
//                     reject(null);
//                 }
//             };

//             tilemapRequest(mostRecentRelease);
//         });
//     }

//     async getRNumsFromDetectionLayer(
//         pointInfo: IMapPointInfo,
//         zoomLevel: number
//     ): Promise<Array<number>> {
//         const queryUrl = this.changeDetectionLayerUrl + '/query';

//         const fields = config['change-detection-layer'].fields;

//         const FIELD_NAME_ZOOM = fields[0].fieldname;
//         const FIELD_NAME_RELEASE_NUM = fields[1].fieldname;
//         const FIELD_NAME_RELEASE_NAME = fields[2].fieldname;

//         try {
//             const queryResponse = (await queryFeatures({
//                 url: queryUrl,
//                 geometry: pointInfo.geometry,
//                 geometryType: 'esriGeometryPoint',
//                 spatialRel: 'esriSpatialRelIntersects',
//                 where: `${FIELD_NAME_ZOOM} = ${zoomLevel}`,
//                 outFields: [FIELD_NAME_RELEASE_NUM],
//                 orderByFields: FIELD_NAME_RELEASE_NAME,
//                 returnGeometry: false,
//                 f: 'json',
//             })) as IQueryFeaturesResponse;

//             const rNums: Array<number> =
//                 queryResponse.features && queryResponse.features.length
//                     ? queryResponse.features.map((feature: IFeature) => {
//                           return feature.attributes[FIELD_NAME_RELEASE_NUM];
//                       })
//                     : [];

//             return rNums;
//         } catch (err) {
//             console.error(err);
//             return [];
//         }
//     }

//     getTileImageUrl({
//         column = null,
//         row = null,
//         level = null,
//         rNum = null,
//     }: IParamGetTileUrl) {
//         const urlTemplate = this.waybackconfig[rNum].itemURL;
//         return urlTemplate
//             .replace('{level}', level.toString())
//             .replace('{row}', row.toString())
//             .replace('{col}', column.toString());
//     }

//     async removeDuplicates(
//         candidates?: Array<ICandidates>
//     ): Promise<Array<number>> {
//         if (!candidates.length) {
//             return [];
//         }

//         const finalResults: Array<number> = [];

//         // reverse the candidates list so the wayback items will be sorted by release dates in ascending order (oldest >>> latest)
//         const imageDataUriRequests = candidates.reverse().map((candidate) => {
//             return this.getSampledImagedDataUri(candidate.url, candidate.rNum);
//         });

//         try {
//             const imageDataUriResults = await Promise.all(imageDataUriRequests);

//             let dataUri4PrevRelease = '';

//             for (const { dataUri, rNum } of imageDataUriResults) {
//                 if (dataUri === dataUri4PrevRelease) {
//                     continue;
//                 }

//                 finalResults.push(rNum);
//                 dataUri4PrevRelease = dataUri;
//             }
//         } catch (err) {
//             console.error('failed to fetch all image data uri', err);
//         }

//         return finalResults;
//     }

//     async getSampledImagedDataUri(
//         imageUrl: string,
//         rNum: number
//     ): Promise<IResponseGetImageBlob> {
//         const samplePoints = [512, 1000, 2500, 5000, 7500, 10000, 12500, 15000];

//         return new Promise((resolve, reject) => {
//             const xhr = new XMLHttpRequest();
//             xhr.open('GET', imageUrl, true);
//             xhr.responseType = 'arraybuffer';

//             xhr.onload = function (e) {
//                 if (this.status == 200) {
//                     const uInt8Array = new Uint8Array(this.response);
//                     let i = uInt8Array.length;
//                     const binaryString = new Array(i);
//                     while (i--) {
//                         binaryString[i] = String.fromCharCode(uInt8Array[i]);
//                     }
//                     const data = binaryString.join('');
//                     const base64 = window.btoa(data);
//                     // console.log(base64.length)

//                     let dataUri = ''; //base64.substr(512, 5000);
//                     // console.log(tileImageDataUri);

//                     for (const point of samplePoints) {
//                         dataUri += base64.substr(point, 500);
//                     }

//                     resolve({
//                         rNum,
//                         dataUri,
//                     });
//                 } else {
//                     reject(null);
//                 }
//             };

//             xhr.send();
//         });
//     }
// }

// export default WaybackChangeDetector;
