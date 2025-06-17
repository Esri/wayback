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
    onClick?: (value: string) => void;
};

export const RadioButtonGroup: FC<Props> = ({ name, data, onClick }) => {
    return (
        <CalciteRadioButtonGroup name={name} layout="vertical">
            {data.map((item, index) => (
                <CalciteLabel
                    layout="inline"
                    key={item.value + index}
                    class="text-xs cursor-pointer"
                    onClick={onClick.bind(null, item.value)}
                >
                    <CalciteRadioButton
                        value={item.value}
                        checked={item.checked || undefined}
                    ></CalciteRadioButton>
                    {item.label}
                </CalciteLabel>
            ))}
        </CalciteRadioButtonGroup>
    );
};
