import { useAppSelector } from '@store/configureStore';
import { selectIsPerformanceAnalyzeToolEnabled } from '@store/UI/reducer';
import { selectQueryDurationMsForLocalChanges } from '@store/Wayback/reducer';
import React from 'react';

export const LocalChangeQueryDuration = () => {
    const queryLocalChangesDurationMs = useAppSelector(
        selectQueryDurationMsForLocalChanges
    );

    return (
        <div className="fixed bottom-6 right-2 z-10 bg-black text-white p-4">
            <h3 className="font-bold mb-2">Performance Analyze Tool</h3>
            <div>
                <strong>Local Changes Query Duration:</strong>{' '}
                {queryLocalChangesDurationMs !== null
                    ? `${queryLocalChangesDurationMs.toFixed(2)} ms`
                    : 'N/A'}
            </div>
        </div>
    );
};
