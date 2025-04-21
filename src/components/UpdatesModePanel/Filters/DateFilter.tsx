import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    UpdatesModeDateFilter,
    updatesModeDateRangeChanged,
} from '@store/UpdatesMode/reducer';
import { selectUpdatesModeDate } from '@store/UpdatesMode/selectors';

export const DateFilter = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const updatesModeDateFilter = useAppSelector(selectUpdatesModeDate);

    const data: RadioButtonData[] = useMemo(() => {
        const options: {
            value: UpdatesModeDateFilter;
            label: string;
            checked: boolean;
        }[] = [
            {
                value: 'last-week',
                label: t('within_last_week'),
                checked: false,
            },
            {
                value: 'last-month',
                label: t('within_last_month'),
                checked: false,
            },
            {
                value: 'last-3-months',
                label: t('within_last_3_months'),
                checked: false,
            },
            {
                value: 'last-6-months',
                label: t('within_last_6_months'),
                checked: false,
            },
            {
                value: 'last-year-and-pending',
                label: t('within_last_year'),
                checked: false,
            },
        ];

        return options.map((option) => ({
            ...option,
            checked: option.value === updatesModeDateFilter,
        }));
    }, [updatesModeDateFilter]);

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <HeaderText title={t('date')} />
            <RadioButtonGroup
                name="date-filter"
                data={data}
                onClick={(value: string) => {
                    console.log(`Selected date filter: ${value}`);
                    // Handle the date selection change here

                    dispatch(
                        updatesModeDateRangeChanged(
                            value as UpdatesModeDateFilter
                        )
                    );
                }}
            />
        </div>
    );
};
