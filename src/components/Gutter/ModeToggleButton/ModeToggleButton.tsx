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

import React, { FC } from 'react';
import classNames from 'classnames';
import { CalciteIcon } from '@esri/calcite-components-react';

type Props = {
    /**
     * Indicates whether the button is currently active or not.
     */
    isActive: boolean;
    /**
     * The tooltip text displayed when hovering over the button.
     */
    tooltip: string;
    /**
     * The icon to be displayed inside the button.
     */
    icon: string;
    /**
     * The test ID for the button, useful for testing purposes.
     */
    testId: string;
    /**
     * The label for the button, used for accessibility purposes.
     */
    label: string;
    /**
     * Emitted when the button is clicked.
     * @returns void - Callback function triggered when the button is clicked.
     */
    onClick: () => void;
};

/**
 * A component that renders a toggle button with customizable
 * appearance and behavior. The button can display an icon, tooltip, and
 * supports active/inactive states.
 *
 * @component
 * @param {Props} props - The properties passed to the component.
 * @param {boolean} props.isActive - Determines if the button is in an active state.
 * @param {string} props.tooltip - The tooltip text displayed on hover.
 * @param {string} props.icon - The name of the icon to display inside the button.
 * @param {string} props.testId - The test ID for the button, useful for testing purposes.
 * @param {() => void} props.onClick - The callback function triggered when the button is clicked.
 * @returns {JSX.Element} The rendered toggle button component.
 */
export const ModeToggleButton: FC<Props> = ({
    isActive,
    tooltip,
    icon,
    testId,
    label,
    onClick,
}) => {
    return (
        <div
            className={classNames(
                'flex relative w-full cursor-pointer text-center items-center justify-center py-2 hover:text-white',
                {
                    'opacity-75': !isActive,
                    'text-white': isActive,

                    'bg-custom-background': isActive,
                }
            )}
        >
            <button
                className="flex items-center justify-center"
                data-testid={testId}
                data-active={isActive}
                onClick={onClick}
                aria-label={label}
                title={tooltip}
            >
                <CalciteIcon icon={icon} scale="l" />
            </button>
        </div>
    );
};
