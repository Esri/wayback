import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';
import { useAppDispatch } from '@store/configureStore';
import { updatesModeCategoryChanged } from '@store/UpdatesMode/reducer';
import { ImageryUpdatesCategory } from '@services/world-imagery-updates/config';

export const CategoryFilter = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const data: RadioButtonData[] = useMemo(() => {
        const options: {
            value: ImageryUpdatesCategory;
            label: string;
            checked: boolean;
        }[] = [
            {
                label: t('metropolitan_updates'),
                value: 'vivid-advanced',
                checked: true,
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
        ]

        return options;
    }, []);

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <HeaderText title={t('category')} />

            <RadioButtonGroup
                name="category-filter"
                data={data}
                onClick={(value: string) => {
                    console.log(`Selected category: ${value}`);
                    // Handle the category selection change here

                    dispatch(updatesModeCategoryChanged(value as ImageryUpdatesCategory));
                }}
            />
        </div>
    );
};
