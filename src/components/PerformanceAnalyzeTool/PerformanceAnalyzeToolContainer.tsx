import { useAppSelector } from '@store/configureStore';
import { selectIsPerformanceAnalyzeToolEnabled } from '@store/UI/reducer';
import React from 'react';
import { LocalChangeQueryDuration } from './LocalChangeQueryDuration';

export const PerformanceAnalyzeToolContainer = () => {
    const isEnabled = useAppSelector(selectIsPerformanceAnalyzeToolEnabled);

    if (!isEnabled) {
        return null;
    }

    return <LocalChangeQueryDuration />;
};
