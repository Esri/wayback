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

// import React, { useEffect, useMemo } from 'react';
// import { useAppSelector } from '@store/configureStore';
// // import { selectSuggestedReferenceLayerLocale } from '@store/Map/reducer';

// export enum NotificationType {
//     SET_REFERENCE_LAYER_LOCALE = 'SET_REFERENCE_LAYER_LOCALE',
// }

// /**
//  * Custom hook that determines the type of notification message to display.
//  *
//  * @returns {NotificationType} The type of notification to display.
//  */
// export const useNotificationMessage2Display = (): NotificationType => {
//     // const suggestedReferenceLayerLocale = useAppSelector(
//     //     selectSuggestedReferenceLayerLocale
//     // );

//     const notificationType: NotificationType = useMemo(() => {
//         // if (suggestedReferenceLayerLocale) {
//         //     return NotificationType.SET_REFERENCE_LAYER_LOCALE;
//         // }

//         return null as NotificationType;
//     }, []);

//     return notificationType;
// };
