import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';
import { useListOfRegions } from '../hooks/useListOfRegions';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import { updatesModeRegionChanged } from '@store/UpdatesMode/reducer';
import { selectUpdatesModeRegion } from '@store/UpdatesMode/selectors';

export const RegionFilter = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const { listOfRegions, isLoading, error } = useListOfRegions();

    const updatesModeRegion = useAppSelector(selectUpdatesModeRegion);

    const data: RadioButtonData[] = useMemo(() => {
        const options: RadioButtonData[] = [
            {
                label: t('all'),
                value: '',
                checked: !updatesModeRegion,
            },
        ];

        if (error) {
            console.error('Error fetching regions:', error);
            return options; // Return only the "All" option if there's an error
        }

        for (const region of listOfRegions) {
            options.push({
                label: region,
                value: region,
                checked: updatesModeRegion === region, // Default to unchecked
            });
        }

        return options;
    }, [listOfRegions, error, updatesModeRegion]);

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <HeaderText title={t('region')} />

            {isLoading && (
                <div className="text-center">
                    <calcite-loader scale="s" />
                    <p className="">{t('loading')}</p>
                </div>
            )}
            {!isLoading && (
                <RadioButtonGroup
                    name="region-filter"
                    data={data}
                    onClick={(value: string) => {
                        console.log(`Selected region: ${value}`);
                        // Handle the region selection change here

                        dispatch(updatesModeRegionChanged(value));
                    }}
                />
            )}
        </div>
    );
};
