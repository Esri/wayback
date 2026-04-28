/* Copyright 2024-2026 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import React, { FC } from 'react';
// import {
//     isReferenceLayerSwitcherOpenToggled,
//     referenceLayerLocaleUpdated,
//     selectSuggestedReferenceLayerLocale,
// } from '@store/Map/reducer';
// import { updateReferenceLayerLocale } from '@store/Map/thunks';
// import { ReferenceLayerLanguage } from '@constants/map';
// import { useAppDispatch, useAppSelector } from '@store/configureStore';
// import { CalciteButton } from '@esri/calcite-components-react';

// export const NotificationSetReferenceLayerLocale: FC = () => {
//     const dispatch = useAppDispatch();

//     const suggestedReferenceLayerLocale = useAppSelector(
//         selectSuggestedReferenceLayerLocale
//     );

//     if (!suggestedReferenceLayerLocale) {
//         return null;
//     }

//     return (
//         <div className="flex items-center bg-black md:bg-opacity-85 text-white pointer-events-auto p-2 md:text-sm">
//             <p>
//                 You can set your reference layer language to{' '}
//                 <span
//                     className="cursor-pointer underline"
//                     onClick={() => {
//                         dispatch(
//                             updateReferenceLayerLocale(
//                                 suggestedReferenceLayerLocale
//                             )
//                         );

//                         dispatch(isReferenceLayerSwitcherOpenToggled(true));
//                     }}
//                 >
//                     {suggestedReferenceLayerLocale}
//                 </span>
//                 .
//             </p>

//             <CalciteButton
//                 icon-start="x"
//                 appearance="transparent"
//                 kind="neutral"
//                 scale="l"
//                 onClick={() => {
//                     // Set the reference layer locale to English when the close button is clicked to mute this notification.
//                     dispatch(
//                         updateReferenceLayerLocale(
//                             ReferenceLayerLanguage.EnglishUS
//                         )
//                     );
//                 }}
//             />
//         </div>
//     );
// };
