import { useAppSelector } from '@store/configureStore';
import { selectMapCenterAndZoom } from '@store/Map/reducer';
import { selectIsPerformanceAnalyzeToolEnabled } from '@store/UI/reducer';
import { selectQueryDurationMsForLocalChanges } from '@store/Wayback/reducer';
import classNames from 'classnames';
import React, { useEffect } from 'react';

/**
 * Whether to use tile size to determine local changes. This is only for experiment and should be removed after the experiment.
 */
export const SHOULD_NOT_USE_SIZE_TO_DETERMINE_LOCAL_CHANGES__ONLY_FOR_EXPERIMENT =
    window.location.search.includes('useSizeToDetermineLocalChanges=false');

/**
 * To enable performance analyze tool UI component to show query duration for local changes:
 * 1. Set URL query parameter "enablePerformanceAnalyzeTool=true"
 * 2. Ensure the app is not hosted on livingatlas.arcgis.com
 * 3.
 * @returns
 */
export const LocalChangeQueryDuration = () => {
    const queryLocalChangesDurationMs = useAppSelector(
        selectQueryDurationMsForLocalChanges
    );

    const mapZoom = useAppSelector(selectMapCenterAndZoom).zoom;

    const [durarionByZoom, setDurationByZoom] = React.useState<{
        [key: number]: number[];
    }>({});

    useEffect(() => {
        if (queryLocalChangesDurationMs !== null && mapZoom !== null) {
            setDurationByZoom((prev) => {
                const existingDurations = prev[mapZoom] || [];
                return {
                    ...prev,
                    [mapZoom]: [
                        ...existingDurations,
                        queryLocalChangesDurationMs,
                    ],
                };
            });
        }
    }, [queryLocalChangesDurationMs]);
    return (
        <div className="fixed bottom-6 right-2 z-10 bg-black text-white p-4 w-[500px] bg-opacity-90 rounded-md shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2 border-b border-white border-opacity-40 pb-2 ">
                <h3 className="font-bold ">Performance Analyze Tool</h3>

                <p className="text-sm">
                    Last Query Duration:{' '}
                    <strong>
                        {queryLocalChangesDurationMs !== null
                            ? `${queryLocalChangesDurationMs.toFixed(2)} ms`
                            : 'N/A'}
                    </strong>
                </p>
            </div>

            <div>
                <p>
                    {SHOULD_NOT_USE_SIZE_TO_DETERMINE_LOCAL_CHANGES__ONLY_FOR_EXPERIMENT
                        ? 'Tile size is NOT used to determine local changes'
                        : 'Tile size is used to determine local changes'}
                </p>
            </div>

            <div className="mt-4">
                <strong>Median Duration by Zoom Level:</strong>
                <ul className="list-disc list-inside">
                    {Object.entries(durarionByZoom).map(([zoom, durations]) => {
                        // const averageDuration =
                        //     durations.reduce((a, b) => a + b, 0) /
                        //     durations.length;
                        const sortedDurations = durations
                            .slice()
                            .sort((a, b) => a - b);

                        if (sortedDurations.length === 0) {
                            return (
                                <li key={zoom} className="opacity-50">
                                    Zoom {zoom}: N/A
                                </li>
                            );
                        }

                        const middleIndex = Math.floor(
                            sortedDurations.length / 2
                        );
                        const medianDuration =
                            sortedDurations.length % 2 === 0
                                ? (sortedDurations[middleIndex - 1] +
                                      sortedDurations[middleIndex]) /
                                  2
                                : sortedDurations[middleIndex];

                        return (
                            <li
                                key={zoom}
                                className={classNames({
                                    'opacity-50':
                                        medianDuration === 0 ||
                                        zoom !== mapZoom.toString(),
                                })}
                            >
                                Zoom {zoom}: {medianDuration.toFixed(2)} ms
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
