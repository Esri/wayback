import { useAppSelector } from '@store/configureStore';
import { selectIsPerformanceAnalyzeToolEnabled } from '@store/UI/reducer';
import React from 'react';
import { LocalChangeQueryDuration } from './LocalChangeQueryDuration';

/**
 * This container component conditionally renders the Performance Analyze Tool components
 * based on whether the tool is enabled in the application state.
 *
 * To enable the Performance Analyze Tool, set the URL query parameter
 * `?enablePerformanceAnalyzeTool=true`.
 *
 * @returns
 */
export const PerformanceAnalyzeToolContainer = () => {
    const isEnabled = useAppSelector(selectIsPerformanceAnalyzeToolEnabled);

    if (!isEnabled) {
        return null;
    }

    return <LocalChangeQueryDuration />;
};
