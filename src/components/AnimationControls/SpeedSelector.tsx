/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CalciteSlider } from '@esri/calcite-components-react';
import { ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS } from '@store/AnimationMode/reducer';
import React, { useEffect, useMemo } from 'react';

type Props = {
    defaultVal: number;
    /**
     * Whether the speed selector is disabled or not. When animation is loading or failed, the speed selector should be disabled.
     */
    disabled?: boolean;
    onChange: (speedInMilliseonds: number) => void;
};

const SpeedSelector: React.FC<Props> = ({
    defaultVal,
    disabled,
    onChange,
}: Props) => {
    // const sliderRef = React.useRef<any>(null);

    const onChangeDely = React.useRef<NodeJS.Timeout>(null);

    const calcSliderValue = () => {
        const idx = ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS.indexOf(defaultVal);

        if (idx === -1) {
            return Math.floor(
                ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS.length / 2
            );
        }

        return idx;
    };

    const [sliderValue, setSliderValue] =
        React.useState<number>(calcSliderValue());

    useEffect(() => {
        clearTimeout(onChangeDely.current);

        onChangeDely.current = setTimeout(() => {
            const speed = ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS[sliderValue];

            onChange(speed);
        }, 500);
    }, [sliderValue]);

    React.useEffect(() => {
        // sliderRef.current.addEventListener(
        //     'calciteSliderChange',
        //     (evt: any) => {
        //         clearTimeout(onChangeDely.current);
        //         onChangeDely.current = setTimeout(() => {
        //             // console.log('slider on change', evt.target.value)
        //             // onChange(+evt.target.value)
        //             // const tickVal = Math.floor(+evt.target.value * 100) / 100;
        //             // // the max val indciates fastes time and min val indicates slowest, therefore we need to use max val to minus the tick val
        //             // // to get the actual animation speed, let's say the tick val is 2 and max val is 3, that gives a current speed of 1 second
        //             // const val = MAX_VAL - tickVal;
        //             const index = evt.target.value;
        //             const speed =
        //                 ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS[index];
        //             onChange(speed);
        //         }, 500);
        //     }
        // );
        // return () => {
        //     clearTimeout(onChangeDely.current);
        // };
    }, []);

    // React.useEffect(() => {
    //     console.log(defaultVal)
    // }, [defaultVal])

    return (
        <div
            // style={{
            //     flexGrow: 1,
            //     display: 'flex',
            //     alignItems: 'center',
            // }}
            className="calcite-theme-dark relative w-full h-[32px] mr-1"
        >
            {/* <span className="mr-2 font-semibold">-</span> */}

            <div
            // style={{
            //     flexGrow: 1,
            // }}
            >
                <CalciteSlider
                    // ref={sliderRef}
                    min={0}
                    max={ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS.length - 1}
                    // snap
                    // ticks={1}
                    step={1}
                    scale="s"
                    value={sliderValue}
                    disabled={disabled}
                    onCalciteSliderInput={(evt: any) => {
                        const index = evt.target.value;
                        setSliderValue(index);

                        // const speed =
                        //     ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS[index];

                        // onChange(speed);
                    }}
                ></CalciteSlider>
            </div>

            <div className="absolute left-0 right-0 top-[12px] text-center pointer-events-none">
                <span className="text-xs opacity-70">Animation Speed</span>
            </div>

            {/* <span className="ml-2 font-semibold">+</span> */}
        </div>
    );
};

export default SpeedSelector;
