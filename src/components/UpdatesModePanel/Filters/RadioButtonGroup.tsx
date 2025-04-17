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
        <calcite-radio-button-group name={name} layout="vertical">
            {data.map((item, index) => (
                <calcite-label
                    layout="inline"
                    key={item.value + index}
                    class="text-xs"
                >
                    <calcite-radio-button
                        value={item.value}
                        onClick={onClick.bind(null, item.value)}
                        checked={item.checked || undefined}
                    ></calcite-radio-button>
                    {item.label}
                </calcite-label>
            ))}
        </calcite-radio-button-group>
    );
};
