import React, { useEffect, useMemo } from 'react';
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

    const seachInputRef = React.useRef<any>(null);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value || '';
        setSearchTerm(value);
    };

    const [searchTerm, setSearchTerm] = React.useState('');

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

    const filteredData = useMemo(() => {
        if (!searchTerm) {
            return data;
        }
        return data.filter((item) =>
            item.label.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    useEffect(() => {
        if (seachInputRef.current) {
            seachInputRef.current.addEventListener(
                'calciteInputTextInput',
                handleSearch
            );
        }
        return () => {
            if (seachInputRef.current) {
                seachInputRef.current.removeEventListener(
                    'calciteInputTextInput',
                    handleSearch
                );
            }
        };
    }, [seachInputRef.current]);

    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white flex-grow">
            <div className="flex justify-between items-center mb-2">
                <HeaderText title={t('region')} />
            </div>

            {isLoading && (
                <div className="text-center">
                    <calcite-loader scale="s" text={t('loading')} />
                    {/* <p className="">{t('loading')}</p> */}
                </div>
            )}
            {!isLoading && (
                <>
                    <div className="w-full mb-2">
                        <calcite-input-text
                            ref={seachInputRef}
                            placeholder="Search region"
                            value={searchTerm}
                            scales="s"
                            clearable
                        ></calcite-input-text>
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
            )}
        </div>
    );
};
