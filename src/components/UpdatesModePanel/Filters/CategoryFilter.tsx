import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    updatesModeCategoryChanged,
    updatesModeRegionChanged,
} from '@store/UpdatesMode/reducer';
import { ImageryUpdatesCategory } from '@services/world-imagery-updates/config';
import { selectUpdatesModeCategory } from '@store/UpdatesMode/selectors';

export const CategoryFilter = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const updatesModeCategory = useAppSelector(selectUpdatesModeCategory);

    const data: RadioButtonData[] = useMemo(() => {
        const options: {
            value: ImageryUpdatesCategory;
            label: string;
            checked: boolean;
        }[] = [
            {
                label: t('metropolitan_updates'),
                value: 'vivid-advanced',
                checked: false,
            },
            {
                label: t('regional_updates'),
                value: 'vivid-standard',
                checked: false,
            },
            {
                label: t('community_contributions'),
                value: 'community-contributed',
                checked: false,
            },
        ];

        return options.map((option) => {
            return {
                ...option,
                checked: option.value === updatesModeCategory,
            };
        });
    }, [updatesModeCategory]);

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <div className="mb-2">
                <HeaderText
                    title={t('category')}
                    tooltip={t('category_filter_tooltip')}
                />
            </div>

            <RadioButtonGroup
                name="category-filter"
                data={data}
                onClick={(value: string) => {
                    console.log(`Selected category: ${value}`);
                    // Handle the category selection change here

                    // Reset the region to '' when the category changes
                    // This is to ensure that the region filter is reset when the category changes
                    // as the options in the region filter are dependent on the selected category
                    dispatch(updatesModeRegionChanged(''));

                    dispatch(
                        updatesModeCategoryChanged(
                            value as ImageryUpdatesCategory
                        )
                    );
                }}
            />
        </div>
    );
};
