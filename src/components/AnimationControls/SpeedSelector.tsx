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
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

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
        const timeoutId = setTimeout(() => {
            const speed = ANIMATION_SPEED_OPTIONS_IN_MILLISECONDS[sliderValue];
            onChange(speed);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [sliderValue]);

    return (
        <div className="calcite-theme-dark relative w-full h-[32px] mr-1">
            <div>
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
                    }}
                ></CalciteSlider>
            </div>

            <div className="absolute left-0 right-0 top-[12px] text-center pointer-events-none">
                <span className="text-xs opacity-70">
                    {t('animation_speed')}
                </span>
            </div>
        </div>
    );
};

export default SpeedSelector;
