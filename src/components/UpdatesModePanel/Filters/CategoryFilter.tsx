import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';

export const CategoryFilter = () => {
    const { t } = useTranslation();

    const data: RadioButtonData[] = useMemo(() => {
        const options = [
            {
                value: 'metropolitan',
                label: t('metropolitan_updates'),
                checked: true,
            },
            { value: 'regional', label: t('regional_updates'), checked: false },
            {
                value: 'community',
                label: t('community_contributions'),
                checked: false,
            },
        ];

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
                }}
            />
        </div>
    );
};
