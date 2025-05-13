import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    updatesModeCustomDateRangeChanged,
    UpdatesModeDateFilter,
    updatesModeDateFilterChanged,
} from '@store/UpdatesMode/reducer';
import {
    selectUpdatesModeCustomDateRange,
    selectUpdatesModeDate,
} from '@store/UpdatesMode/selectors';
import {
    CalciteInputDatePicker,
    CalciteLabel,
} from '@esri/calcite-components-react';

export const DateFilter = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const updatesModeDateFilter = useAppSelector(selectUpdatesModeDate);

    const [selectedDateOption, setSelectedDateOption] =
        React.useState<UpdatesModeDateFilter | null>(updatesModeDateFilter);

    /**
     * custom date range selected by the user via the date picker.
     *
     * This is an array of strings, where the first element is the start date and the second element is the end date.
     * The string in ISO format ("yyyy-mm-dd").
     *
     * @see https://developers.arcgis.com/calcite-design-system/components/input-date-picker/#api-reference-properties-value
     */
    const [customDateRange, setCustomDateRange] = useState<
        [string, string] | null
    >(['', '']);

    /**
     * The allowed date range for the date picker.
     * This is set to one year ago from today to one year from today.
     */
    const allowedDateRange: [string, string] = useMemo(() => {
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(today.getFullYear() + 1);

        return [
            oneYearAgo.toISOString().split('T')[0],
            oneYearFromNow.toISOString().split('T')[0],
        ];
    }, []);

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
            {
                value: 'custom',
                label: t('custom_range'),
                checked: false,
            },
        ];

        return options.map((option) => ({
            ...option,
            checked: option.value === selectedDateOption,
        }));
    }, [selectedDateOption]);

    useEffect(() => {
        if (selectedDateOption === 'custom') {
            if (
                !customDateRange ||
                customDateRange[0] === '' ||
                customDateRange[1] === ''
            ) {
                console.log('Custom date range is not selected');
                return;
            }

            console.log('Custom date range selected:', customDateRange);
            dispatch(updatesModeCustomDateRangeChanged(customDateRange));
            // return;
        }

        dispatch(updatesModeDateFilterChanged(selectedDateOption));
    }, [selectedDateOption, customDateRange]);

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <div className="mb-2">
                <HeaderText
                    title={t('published_date')}
                    tooltip={t('published_date_filter_tooltip')}
                />
            </div>

            <RadioButtonGroup
                name="date-filter"
                data={data}
                onClick={(value: string) => {
                    console.log(`Selected date filter: ${value}`);
                    // Handle the date selection change here

                    setSelectedDateOption(value as UpdatesModeDateFilter);

                    // dispatch(
                    //     updatesModeDateRangeChanged(
                    //         value as UpdatesModeDateFilter
                    //     )
                    // );
                }}
            />
            {selectedDateOption === 'custom' && (
                <CalciteLabel>
                    <CalciteInputDatePicker
                        range
                        value={customDateRange}
                        min={allowedDateRange[0]} // Set the minimum date to today minus 1 year
                        max={allowedDateRange[1]} // Set the maximum date to today plus 1 year
                        overlayPositioning="fixed"
                        onCalciteInputDatePickerChange={(event) => {
                            const value: string[] =
                                (event.target.value as [string, string]) || [];
                            // console.log(value);
                            // Handle the date selection change here

                            setCustomDateRange(value as [string, string]);
                        }}
                    />
                </CalciteLabel>
            )}
        </div>
    );
};
