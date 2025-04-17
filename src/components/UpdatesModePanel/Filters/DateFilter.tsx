import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';

export const DateFilter = () => {
    const { t } = useTranslation();

    const data: RadioButtonData[] = useMemo(() => {
        const options: RadioButtonData[] = [
            {
                value: 'within_last_week',
                label: t('within_last_week'),
                checked: true,
            },
            {
                value: 'within_last_month',
                label: t('within_last_month'),
                checked: false,
            },
            {
                value: 'within_last_3_months',
                label: t('within_last_3_months'),
                checked: false,
            },
            {
                value: 'within_last_6_months',
                label: t('within_last_6_months'),
                checked: false,
            },
            {
                value: 'within_last_year',
                label: t('within_last_year'),
                checked: false,
            },
        ];

        return options;
    }, []);

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <HeaderText title={t('date')} />
            <RadioButtonGroup
                name="date-filter"
                data={data}
                onClick={(value: string) => {
                    console.log(`Selected date filter: ${value}`);
                    // Handle the date selection change here
                }}
            />
        </div>
    );
};
