import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';

export const RegionFilter = () => {
    const { t } = useTranslation();

    const data: RadioButtonData[] = useMemo(() => {
        const options: RadioButtonData[] = [
            { value: 'all', label: t('all'), checked: true },
            { value: 'Canada', label: t('Canada'), checked: false },
            { value: 'New Zealands', label: t('New Zealands'), checked: false },
            {
                value: 'United States',
                label: t('United States'),
                checked: false,
            },
        ];
        return options;
    }, []);

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <HeaderText title={t('region')} />
            <RadioButtonGroup
                name="region-filter"
                data={data}
                onClick={(value: string) => {
                    console.log(`Selected region: ${value}`);
                    // Handle the region selection change here
                }}
            />
        </div>
    );
};
