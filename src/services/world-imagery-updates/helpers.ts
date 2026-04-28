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

import {
    COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL,
    ImageryUpdatesCategory,
    VIVID_ADVANCED_FROM_MAXAR_URL,
    VIVID_STANDARD_FROM_MAXAR_URL,
} from './config';

export const getImageryUpdatesUrl = (
    category: ImageryUpdatesCategory
): string => {
    if (category === 'vivid-advanced') {
        return VIVID_ADVANCED_FROM_MAXAR_URL;
    }

    if (category === 'vivid-standard') {
        return VIVID_STANDARD_FROM_MAXAR_URL;
    }

    if (category === 'community-contributed') {
        return COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL;
    }

    throw new Error(
        `Failed to get Imagery Updates Layer URL by category: ${category}`
    );
};
