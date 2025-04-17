import React from 'react';
import { UpdatesModeHeader } from './UpdatesModeHeader';
import { StatusFilter } from './Filters/StatusFilter';
import { CategoryFilter } from './Filters/CategoryFilter';
import { DateFilter } from './Filters/DateFilter';
import { RegionFilter } from './Filters/RegionFilter';

export const UpdatesPanelContainer = () => {
    return (
        <div className="p-2">
            <UpdatesModeHeader />
            <StatusFilter />
            <CategoryFilter />
            <DateFilter />
            <RegionFilter />
        </div>
    );
};
