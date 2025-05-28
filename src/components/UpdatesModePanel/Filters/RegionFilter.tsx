import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';
import { useListOfRegions } from '../hooks/useListOfRegions';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import { updatesModeRegionChanged } from '@store/UpdatesMode/reducer';
import { selectUpdatesModeRegion } from '@store/UpdatesMode/selectors';
import {
    CalciteButton,
    CalciteInputText,
    CalciteLoader,
} from '@esri/calcite-components-react';

export const RegionFilter = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const { listOfRegions, isLoading, error } = useListOfRegions();

    const selectedRegion = useAppSelector(selectUpdatesModeRegion);

    const [searchTerm, setSearchTerm] = React.useState('');

    const data: RadioButtonData[] = useMemo(() => {
        if (
            !listOfRegions ||
            listOfRegions.length === 0 ||
            error ||
            isLoading
        ) {
            return [];
        }

        const options: RadioButtonData[] = [
            {
                label: t('all'),
                value: '',
                checked: !selectedRegion,
            },
        ];

        // if (error) {
        //     console.error('Error fetching regions:', error);
        //     return options; // Return only the "All" option if there's an error
        // }

        for (const region of listOfRegions) {
            options.push({
                label: region,
                value: region,
                checked: selectedRegion === region, // Default to unchecked
            });
        }

        return options;
    }, [listOfRegions, error, selectedRegion]);

    const filteredData = useMemo(() => {
        if (!searchTerm) {
            return data;
        }
        return data.filter((item) =>
            item.label.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const getContent = () => {
        if (isLoading) {
            return (
                <div className="text-center">
                    <CalciteLoader scale="s" text={t('loading')} />
                    {/* <p className="">{t('loading')}</p> */}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-sm text-red-500">
                    {t('error_fetching_regions')}
                </div>
            );
        }

        if (!data.length) {
            return (
                <div className="text-sm text-gray-500">
                    {t('no_regions_found')}
                </div>
            );
        }

        return (
            <>
                <div className="w-full mb-2">
                    <CalciteInputText
                        placeholder="Search region"
                        value={searchTerm}
                        clearable
                        onCalciteInputTextInput={(event: any) => {
                            const value = event.target.value || '';
                            setSearchTerm(value);
                        }}
                    ></CalciteInputText>
                </div>

                <div className="overflow-y-auto fancy-scrollbar max-h-[200px] p-1">
                    <RadioButtonGroup
                        name="region-filter"
                        data={filteredData}
                        onClick={(value: string) => {
                            console.log(`Selected region: ${value}`);
                            // Handle the region selection change here

                            dispatch(updatesModeRegionChanged(value));
                        }}
                    />
                </div>
            </>
        );
    };

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white flex-grow">
            <div className="flex justify-between items-center mb-2">
                <HeaderText
                    title={t('region')}
                    tooltip={t('region_filter_tooltip')}
                />

                {selectedRegion && (
                    <div className="relative flex items-center gap-2 px-2 py-1 text-white rounded-lg bg-custom-theme-blue">
                        <div className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                            <span className="text-sm">{selectedRegion}</span>
                        </div>

                        <CalciteButton
                            appearance="transparent"
                            kind="neutral"
                            icon-start="x"
                            scale="s"
                            onClick={() => {
                                dispatch(updatesModeRegionChanged(''));
                                setSearchTerm('');
                            }}
                        />
                    </div>
                )}
            </div>

            {getContent()}
        </div>
    );
};
