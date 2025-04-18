import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';
import { useListOfRegions } from '../hooks/useListOfRegions';

export const RegionFilter = () => {
    const { t } = useTranslation();

    const { listOfRegions, isLoading, error } = useListOfRegions();

    const data: RadioButtonData[] = useMemo(() => {
        const options: RadioButtonData[] = [
            {
                label: t('all'),
                value: 'all',
                checked: true, // Default to checked for "All" option
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
                checked: false, // Default to unchecked
            });
        }

        return options;
    }, [listOfRegions, error]);

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
                    }}
                />
            )}
        </div>
    );
};
