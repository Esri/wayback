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

// import React, { useEffect, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { indexOfCurrentAnimationFrameSelector } from '@store/AnimationMode/reducer';

// import { FrameData } from './generateFrames4GIF';

// type Props = {
//     frameData: FrameData[];
// };

// const ImageAutoPlay: React.FC<Props> = ({ frameData }: Props) => {
//     const idx = useSelector(indexOfCurrentAnimationFrameSelector);

//     // const isPlaying = useSelector(isAnimationPlayingSelector)

//     const getCurrentFrame = () => {
//         if (!frameData || !frameData.length) {
//             return null;
//         }

//         const { frameDataURI } = frameData[idx] || frameData[0];

//         return (
//             <div
//                 style={{
//                     position: 'relative',
//                     width: '100%',
//                     height: '100%',
//                     background: `url(${frameDataURI})`,
//                     boxSizing: 'border-box',
//                 }}
//             ></div>
//         );
//     };

//     return getCurrentFrame();
// };

// export default ImageAutoPlay;
