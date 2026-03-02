import { CalciteSlider } from '@esri/calcite-components-react';
import {
    DEFAULT_MAX_LEVEL_4_DOWNLOAD_JOB,
    DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB,
} from '@store/DownloadMode/thunks';
import React, { useState, useRef, useEffect } from 'react';

type ScaleRangeSelectorProps = {
    /**
     * min zoom level for the download job, default to 1 if not provided
     */
    minValue?: number;
    /**
     * max zoom level for the download job, default to 23 if not provided
     */
    maxValue?: number;
    onChange: (minScale: number, maxScale: number) => void;
};

export const ScaleRangeSelector: React.FC<ScaleRangeSelectorProps> = ({
    minValue = DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB,
    maxValue = DEFAULT_MAX_LEVEL_4_DOWNLOAD_JOB,
    onChange,
}) => {
    const [value, setValue] = useState<[number, number]>([minValue, maxValue]);

    useEffect(() => {
        const [minScale, maxScale] = value;
        // console.log('Scale range changed: ', minScale, maxScale);

        onChange?.(minScale, maxScale);
    }, [value]);

    return (
        <CalciteSlider
            min={DEFAULT_MIN_LEVEL_4_DOWNLOAD_JOB}
            max={DEFAULT_MAX_LEVEL_4_DOWNLOAD_JOB}
            minValue={value[0]}
            maxValue={value[1]}
            ticks={1}
            // labelTicks={true}
            labelHandles={true}
            onCalciteSliderChange={(evt) => {
                const taget = evt.target;
                const value = taget.value;
                // console.log('Slider changed: ', value);

                if (value && Array.isArray(value) && value.length === 2) {
                    setValue([Number(value[0]), Number(value[1])]);
                }
                // setMinScale(min);
                // setMaxScale(max);
            }}
        />
    );
};
