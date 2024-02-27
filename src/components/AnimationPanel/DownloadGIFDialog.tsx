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

// import React, { useState, useCallback, useRef } from 'react';

// import { useDispatch } from 'react-redux';
// import { isDownloadGIFDialogOnToggled } from '@store/AnimationMode/reducer';
// import { FrameData } from './generateFrames4GIF';

// import LoadingSpinner from './LoadingSpinner';

// import classnames from 'classnames';

// // import gifshot from 'gifshot';
// import GifStream from '@entryline/gifstream';

// type Props = {
//     frameData: FrameData[];
//     rNum2Exclude: number[];
//     speed?: number; // animation speed in second
// };

// // type CreateGIFCallBack = (response: {
// //     // image - Base 64 image
// //     image: string;
// //     // error - Boolean that determines if an error occurred
// //     error: boolean;
// //     // errorCode - Helpful error label
// //     errorCode: string;
// //     // errorMsg - Helpful error message
// //     errorMsg: string;
// // }) => void;

// type SaveAsGIFParams = {
//     frameData: FrameData[];
//     // outputFileName: string;
//     speed: number;
// };

// type ResponseCreateGIF = {
//     error: string;
//     blob: Blob;
// };

// type ImagesCreateGIF = {
//     src: string;
//     delay: number;
// };

// const gifStream = new GifStream();

// const donwload = (blob: Blob, fileName = ''): void => {
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.download = fileName;
//     link.href = url;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     URL.revokeObjectURL(url);
// };

// const saveAsGIF = async ({
//     frameData,
//     // outputFileName,
//     speed,
// }: SaveAsGIFParams): Promise<Blob> => {
//     // if the speed is zero, it means user wants to have the fastest speed, so let's use 100 millisecond
//     speed = speed || 0.1;

//     return new Promise((resolve, reject) => {
//         const images: ImagesCreateGIF[] = frameData.map((d) => {
//             const { frameCanvas, height, width, waybackItem, center } = d;

//             const { releaseDateLabel } = waybackItem;

//             const releaseData = `Wayback ${releaseDateLabel}`;
//             const sourceInfo =
//                 'Esri, Maxar, Earthstar Geographics, GIS Community';
//             const locationInfo = `${center.latitude.toFixed(
//                 3
//             )}, ${center.longitude.toFixed(3)}`;
//             const HorizontalPadding = 4;
//             const SpaceBetween = 4;

//             const context = frameCanvas.getContext('2d');
//             context.font = '10px Avenir Next';

//             const metrics4ReleaseDate = context.measureText(releaseData);
//             const metrics4LocationInfo = context.measureText(locationInfo);
//             const metrics4SourceInfo = context.measureText(sourceInfo);

//             const shouldWrap =
//                 metrics4ReleaseDate.width +
//                     metrics4LocationInfo.width +
//                     metrics4SourceInfo.width +
//                     SpaceBetween * 2 +
//                     HorizontalPadding * 2 >
//                 width;

//             // draw the gradient background rect
//             const gradientRectHeight = shouldWrap ? 28 : 16;
//             // const gradient = context.createLinearGradient(0, 0, 0, gradientRectHeight);
//             // gradient.addColorStop(0, "rgba(0,0,0,0)");
//             // gradient.addColorStop(0.5, "rgba(0,0,0,.3)");
//             // gradient.addColorStop(1, "rgba(0,0,0,.6)");
//             context.fillStyle = 'rgba(0,0,0,.2)';
//             context.rect(
//                 0,
//                 height - gradientRectHeight,
//                 width,
//                 gradientRectHeight
//             );
//             context.fill();

//             // draw the watermark text
//             context.shadowColor = 'black';
//             context.shadowBlur = 5;
//             context.fillStyle = 'rgba(255,255,255,.9)';

//             if (shouldWrap) {
//                 let y = height - 4;
//                 const horizontalPadding =
//                     (width - Math.ceil(metrics4SourceInfo.width)) / 2;
//                 context.fillText(sourceInfo, horizontalPadding, y);

//                 y = height - 16;
//                 context.fillText(releaseData, horizontalPadding, y);

//                 const xPos4LocationInfo =
//                     width - (metrics4LocationInfo.width + horizontalPadding);
//                 context.fillText(locationInfo, xPos4LocationInfo, y);
//             } else {
//                 const y = height - 4;

//                 context.fillText(releaseData, HorizontalPadding, y);

//                 const xPos4SourceInfo =
//                     width - (metrics4SourceInfo.width + HorizontalPadding);
//                 context.fillText(sourceInfo, xPos4SourceInfo, y);

//                 let xPos4LocationInfo =
//                     metrics4ReleaseDate.width + HorizontalPadding;
//                 const availWidth = xPos4SourceInfo - xPos4LocationInfo;
//                 const leftPadding4LocationInfo =
//                     (availWidth - metrics4LocationInfo.width) / 2;

//                 xPos4LocationInfo =
//                     xPos4LocationInfo + leftPadding4LocationInfo;
//                 context.fillText(locationInfo, xPos4LocationInfo, y);
//             }

//             return {
//                 src: frameCanvas.toDataURL(),
//                 delay: speed * 1000,
//             };
//         });

//         gifStream.createGIF(
//             {
//                 gifWidth: frameData[0].width,
//                 gifHeight: frameData[0].height,
//                 images,
//                 progressCallback: (progress: number) => {
//                     // console.log(progress)
//                 },
//             },
//             (res: ResponseCreateGIF) => {
//                 //   this.onGifComplete(obj, width, height);
//                 // console.log(res)

//                 if (res.error) {
//                     reject(res.error);
//                 }

//                 // donwload(res.blob, outputFileName)
//                 resolve(res.blob);
//             }
//         );
//     });
// };

// const DownloadGIFDialog: React.FC<Props> = ({
//     frameData,
//     speed,
//     rNum2Exclude,
// }) => {
//     const dispatch = useDispatch();

//     const [isDownloading, setIsDownloading] = useState<boolean>(false);

//     const [outputFileName, setOutputFileName] = useState<string>(
//         'wayback-imagery-animation'
//     );

//     const isCancelled = useRef<boolean>(false);

//     const closeDialog = useCallback(() => {
//         dispatch(isDownloadGIFDialogOnToggled());
//     }, []);

//     const downloadBtnOnClick = async () => {
//         setIsDownloading(true);

//         const data = !rNum2Exclude.length
//             ? frameData
//             : frameData.filter(
//                   (d) => rNum2Exclude.indexOf(d.releaseNum) === -1
//               );

//         try {
//             const blob = await saveAsGIF({
//                 frameData: data,
//                 // outputFileName,
//                 speed,
//             });

//             if (isCancelled.current) {
//                 console.log('gif task has been cancelled');
//                 return;
//             }

//             donwload(blob, outputFileName);

//             closeDialog();
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const getContent = () => {
//         if (isDownloading) {
//             return (
//                 <>
//                     <div className="text-center leader-1">
//                         <p className="trailer-quarter">
//                             Generating animated GIF file...
//                         </p>
//                         <p>Your download will begin shortly.</p>
//                     </div>

//                     <div className="text-right">
//                         <div
//                             className="btn"
//                             onClick={() => {
//                                 gifStream.cancel();
//                                 isCancelled.current = true;
//                                 closeDialog();
//                             }}
//                         >
//                             Cancel
//                         </div>
//                     </div>

//                     <div
//                         style={{
//                             position: 'absolute',
//                             bottom: 0,
//                             left: 0,
//                             width: '100%',
//                         }}
//                     >
//                         <LoadingSpinner />
//                     </div>
//                 </>
//             );
//         }

//         return (
//             <>
//                 <div className="text-center">
//                     <span className="font-size-2">Download GIF</span>
//                 </div>

//                 <div className="leader-1 trailer-1">
//                     <div>
//                         <span>File name:</span>
//                         <label>
//                             <input
//                                 type="text"
//                                 // placeholder="https://<my-enterprise-url>/portal"
//                                 onChange={(
//                                     evt: React.ChangeEvent<HTMLInputElement>
//                                 ) => {
//                                     setOutputFileName(evt.target.value);
//                                 }}
//                                 value={outputFileName}
//                             />
//                         </label>
//                     </div>
//                 </div>

//                 <div
//                     style={{
//                         display: 'flex',
//                         justifyContent: 'flex-end',
//                     }}
//                 >
//                     <div className="btn btn-transparent" onClick={closeDialog}>
//                         Cancel
//                     </div>
//                     <div
//                         className={classnames('btn', {
//                             'btn-disabled': isDownloading,
//                         })}
//                         onClick={downloadBtnOnClick}
//                     >
//                         Download
//                     </div>
//                 </div>
//             </>
//         );
//     };

//     return (
//         <div className="modal-overlay customized-modal is-active">
//             <div
//                 className="modal-content column-8"
//                 role="dialog"
//                 aria-labelledby="modal"
//             >
//                 {getContent()}
//             </div>
//         </div>
//     );
// };

// export default DownloadGIFDialog;
