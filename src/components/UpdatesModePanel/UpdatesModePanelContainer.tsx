import React, { useEffect } from 'react';
import { UpdatesModeHeader } from './UpdatesModeHeader';
import { StatusFilter } from './Filters/StatusFilter';
import { CategoryFilter } from './Filters/CategoryFilter';
import { DateFilter } from './Filters/DateFilter';
import { RegionFilter } from './Filters/RegionFilter';
import { isAnonymouns, signIn } from '@utils/Esri-OAuth';

export const UpdatesPanelContainer = () => {
    useEffect(() => {
        if (isAnonymouns()) {
            signIn();
        }
    }, []);

    return (
        <div
            className="p-2 pb-4 flex flex-col gap-1 overflow-y-auto fancy-scrollbar"
            style={{
                maxHeight: 'calc(100vh - 60px)',
            }}
        >
            <UpdatesModeHeader />
            <StatusFilter />
            <CategoryFilter />
            <DateFilter />
            <RegionFilter />
        </div>
    );
};
