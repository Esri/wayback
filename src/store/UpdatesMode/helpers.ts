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
