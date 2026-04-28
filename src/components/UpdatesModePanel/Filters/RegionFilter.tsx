/* Copyright 2024-2026 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderText } from './HeaderText';
import { RadioButtonData, RadioButtonGroup } from './RadioButtonGroup';
import { useListOfRegions } from '../hooks/useListOfRegions';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    shouldZoomToSelectedRegionChanged,
    updatesModeRegionChanged,
} from '@store/UpdatesMode/reducer';
import {
    selectIsLoadingExtentForSelectedRegion,
    selectUpdatesModeRegion,
} from '@store/UpdatesMode/selectors';
import {
    CalciteButton,
    CalciteInputText,
    CalciteLoader,
} from '@esri/calcite-components-react';
import { changeSelectedRegionForUpdatesMode } from '@store/UpdatesMode/thunks';
import classNames from 'classnames';
import { getContryNameByCountryCode } from './helpers';

type RegionFilterProps = {
    /**
     * If true, the filter will be disabled and not interactable.
     */
    disabled?: boolean;
};

export const RegionFilter: FC<RegionFilterProps> = ({ disabled }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const { listOfRegions, isLoading, error } = useListOfRegions();

    const selectedRegion = useAppSelector(selectUpdatesModeRegion);

    const isLoadingExtentForSelectedRegion = useAppSelector(
        selectIsLoadingExtentForSelectedRegion
    );

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
            // const i18nKey = `COUNTRY_NAME_${region.toUpperCase()}`;

            options.push({
                label: getContryNameByCountryCode(region),
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

        if (disabled) {
            return (
                <div className="text-sm text-gray-500">
                    {t('regions_cannot_be_fetched')}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-sm text-red-500">
                    {t('error_fetching_regions', { error: error.message })}
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
                        placeholder={t('search_region')}
                        value={searchTerm}
                        clearable
                        onCalciteInputTextInput={(event: any) => {
                            const value = event.target.value || '';
                            setSearchTerm(value);
                        }}
                    ></CalciteInputText>
                </div>

                <div className="overflow-y-auto fancy-scrollbar max-h-[200px] p-1 overflow-x-hidden">
                    <RadioButtonGroup
                        name="region-filter"
                        data={filteredData}
                        disabled={disabled || false}
                        onClick={(value: string) => {
                            console.log(`Selected region: ${value}`);
                            // Handle the region selection change here

                            // // set the flag to zoom to the selected region
                            // dispatch(shouldZoomToSelectedRegionChanged(true));

                            dispatch(changeSelectedRegionForUpdatesMode(value));
                        }}
                    />
                </div>
            </>
        );
    };

    return (
        <div
            className={classNames(
                'bg-custom-card-background p-2 mb-2 text-white flex-grow'
            )}
        >
            <div className="flex justify-between items-center mb-2">
                <HeaderText
                    title={t('region')}
                    tooltip={t('region_filter_tooltip')}
                    showLoadingIndicator={isLoadingExtentForSelectedRegion}
                />

                {selectedRegion && (
                    <div className="relative flex items-center gap-2 pl-2 pr-1 py-1 text-white rounded-lg bg-custom-theme-blue">
                        <div className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                            <span className="text-xs">
                                {getContryNameByCountryCode(selectedRegion)}
                            </span>
                        </div>

                        <CalciteButton
                            appearance="transparent"
                            kind="neutral"
                            icon-start="x"
                            scale="s"
                            onClick={() => {
                                dispatch(
                                    changeSelectedRegionForUpdatesMode('')
                                );
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
