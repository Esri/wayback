import { CalciteSwitch } from '@esri/calcite-components-react';
import React, { FC, useEffect, useRef } from 'react';

type Props = {
    /**
     * emits when user click on the Switch button
     * @returns
     */
    onChange: (checked: boolean) => void;
    /**
     * label text to be placed next to the switch button
     */
    label: string;
    /**
     * if true, the switch button should be checked
     */
    checked: boolean;
};

export const Switch: FC<Props> = ({ label, checked, onChange }) => {
    const props: { [key: string]: any } = {};

    if (checked) {
        props['checked'] = true;
    }

    return (
        <div>
            <CalciteSwitch
                onCalciteSwitchChange={(evt: any) => {
                    onChange(evt.target?.checked);
                }}
            />
            <span className="text-sm ml-2">{label}</span>
        </div>
    );
};
