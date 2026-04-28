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

// import {
//     navigatorLanguageToReferenceLayerLanguage,
//     ReferenceLayerLanguage,
// } from '@constants/map';
// import {
//     selectReferenceLayerLocale,
//     suggestedReferenceLayerLocaleUpdated,
// } from '@store/Map/reducer';
// import { getPreferredReferenceLayerLocale } from '@utils/LocalStorage';
// import { useEffect, useMemo } from 'react';
// import { useAppSelector } from '@store/configureStore';
// import { useAppDispatch } from '@store/configureStore';

// // Function to map navigator.language to the ReferenceLayerLanguage enum
// const getReferenceLayerLanguage = (
//     browserLanguage: string
// ): ReferenceLayerLanguage | undefined => {
//     if (navigatorLanguageToReferenceLayerLanguage[browserLanguage]) {
//         return navigatorLanguageToReferenceLayerLanguage[browserLanguage];
//     }

//     // Normalize to base language, e.g. 'en-US' -> 'en'
//     const baseLanguage = browserLanguage.split('-')[0];

//     return navigatorLanguageToReferenceLayerLanguage[baseLanguage];
// };

// /**
//  * Custom React hook designed to manage and suggest a locale for reference layers based on the user's browser settings and preferences.
//  */
// export const useSuggestReferenceLayerLocale = () => {
//     const dispatch = useAppDispatch();

//     const borswerLanguage = navigator.language;

//     const suggestedReferenceLayerLocale = useMemo(() => {
//         const referenceLayerLanguage =
//             getReferenceLayerLanguage(borswerLanguage);
//         console.log('suggested referenceLayerLanguage', referenceLayerLanguage);

//         return referenceLayerLanguage;
//     }, [borswerLanguage]);

//     const selectedReferenceLayerLanguage = useAppSelector(
//         selectReferenceLayerLocale
//     );

//     useEffect(() => {
//         const preferredReferenceLayerLocale =
//             getPreferredReferenceLayerLocale();

//         // Determine if a suggestion update is necessary
//         if (
//             !suggestedReferenceLayerLocale || // Browser language is unsupported
//             suggestedReferenceLayerLocale === ReferenceLayerLanguage.English || // English is default, no need to suggest
//             suggestedReferenceLayerLocale ===
//                 ReferenceLayerLanguage.EnglishUS ||
//             suggestedReferenceLayerLocale === selectedReferenceLayerLanguage || // Already using the suggested language
//             preferredReferenceLayerLocale // User already has a preferred language
//         ) {
//             dispatch(suggestedReferenceLayerLocaleUpdated(null)); // Clear the suggestion
//             return;
//         }

//         dispatch(
//             suggestedReferenceLayerLocaleUpdated(suggestedReferenceLayerLocale)
//         );
//     }, [suggestedReferenceLayerLocale, selectedReferenceLayerLanguage]);
// };
