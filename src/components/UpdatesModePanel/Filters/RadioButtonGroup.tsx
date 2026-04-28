/* Copyright 2024-2026 Esri
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

import {
    CalciteLabel,
    CalciteRadioButton,
    CalciteRadioButtonGroup,
} from '@esri/calcite-components-react';
import React, { FC } from 'react';

export type RadioButtonData = {
    /**
     * The value of the radio button, which is used to identify the selected option.
     */
    value: string;
    /**
     * The label displayed next to the radio button.
     */
    label: string;
    /**
     * If true, the radio button is selected; otherwise, it is not.
     */
    checked: boolean;
};

type Props = {
    /**
     * The name of the radio button group, used to group related radio buttons together.
     * Must be unique within the form.
     */
    name: string;
    data: RadioButtonData[];
    disabled: boolean;
    onClick?: (value: string) => void;
};

export const RadioButtonGroup: FC<Props> = ({
    name,
    data,
    disabled,
    onClick,
}) => {
    return (
        <CalciteRadioButtonGroup
            name={name}
            layout="vertical"
            onCalciteRadioButtonGroupChange={(event: any) => {
                // if (onClick) {
                //     onClick(event.target.value);
                // }
                // console.log('Selected radio button value:', event.target.selectedItem);

                const selectedValue = event.target?.selectedItem?.value;

                if (onClick) {
                    onClick(selectedValue);
                }
            }}
        >
            {data.map((item, index) => (
                <CalciteLabel
                    layout="inline"
                    key={item.value + index}
                    class="text-xs cursor-pointer"
                    // onClick={onClick.bind(null, item.value)}
                >
                    <CalciteRadioButton
                        value={item.value}
                        checked={item.checked || undefined}
                        disabled={disabled || undefined}
                    ></CalciteRadioButton>
                    {item.label}
                </CalciteLabel>
            ))}
        </CalciteRadioButtonGroup>
    );
};
