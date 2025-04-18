import { useAsync } from '@hooks/useAsync';
import { getListOfCountries } from '@services/world-imagery-updates/getListOfCountries';
import { useAppSelector } from '@store/configureStore';
import { selectUpdatesModeCategory } from '@store/UpdatesMode/selectors';
import React, { useEffect } from 'react';

export const useListOfRegions = () => {
    const category = useAppSelector(selectUpdatesModeCategory);

    const [listOfRegions, setListOfRegions] = React.useState<string[]>([]);

    const { isLoading, error, execute } = useAsync(getListOfCountries);

    useEffect(() => {
        (async () => {
            try {
                console.log('Fetching list of regions for category:', category);
                const regions = await execute(category);
                setListOfRegions(regions);
            } catch (e) {
                console.error('Error fetching list of regions:', e);
                setListOfRegions([]);
            }
        })();
    }, [category]);

    return {
        listOfRegions,
        isLoading,
        error,
    };
};
