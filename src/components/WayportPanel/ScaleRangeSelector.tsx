import { CalciteSlider } from '@esri/calcite-components-react';
import React, { useState, useRef, useEffect } from 'react';

type ScaleRangeSelectorProps = {
    minValue?: number;
    maxValue?: number;
    defaultMinScale?: number;
    defaultMaxScale?: number;
    onChange: (minScale: number, maxScale: number) => void;
};

export const ScaleRangeSelector: React.FC<ScaleRangeSelectorProps> = ({
    minValue = 1,
    maxValue = 23,
    defaultMinScale = 1,
    defaultMaxScale = 23,
    onChange,
}) => {
    const [value, setValue] = useState<[number, number]>([
        defaultMinScale,
        defaultMaxScale,
    ]);

    useEffect(() => {
        const [minScale, maxScale] = value;
        // console.log('Scale range changed: ', minScale, maxScale);

        onChange?.(minScale, maxScale);
    }, [value]);

    return (
        <CalciteSlider
            min={defaultMinScale}
            max={defaultMaxScale}
            minValue={value[0]}
            maxValue={value[1]}
            ticks={1}
            labelTicks={true}
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
