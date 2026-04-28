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

import { ImageryUpdatesCategory } from '@services/world-imagery-updates/config';
import { UpdatesModeDateFilter } from './reducer';

/**
 * All valid imagery update categories.
 */
const VALID_CATEGORIES = [
    'community-contributed',
    'vivid-advanced',
    'vivid-standard',
] as const satisfies readonly ImageryUpdatesCategory[];

/**
 * Validates whether a string is a valid imagery updates category.
 *
 * @param category - The category string to validate
 * @returns Type predicate indicating if the category is valid
 */
export const isValidUpdatesModeCategory = (
    category: string
): category is ImageryUpdatesCategory => {
    if (!category) {
        return false;
    }

    return VALID_CATEGORIES.includes(category as ImageryUpdatesCategory);
};

/**
 * All valid date filter options for updates mode.
 */
const VALID_DATE_FILTERS = [
    'last-week',
    'last-month',
    'last-3-months',
    'last-6-months',
    'last-year',
    'next-week',
    'next-month',
    'next-3-months',
] as const satisfies readonly UpdatesModeDateFilter[];

/**
 * Validates whether a string is a valid updates mode date filter.
 *
 * @param dateFilter - The date filter string to validate
 * @returns Type predicate indicating if the date filter is valid
 */
export const isValidUpdatesModeDateFilter = (
    dateFilter: string
): dateFilter is UpdatesModeDateFilter => {
    if (!dateFilter) {
        return false;
    }

    return VALID_DATE_FILTERS.includes(dateFilter as UpdatesModeDateFilter);
};
