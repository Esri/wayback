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

// import './style.css';
import React from 'react';
import classNames from 'classnames';
import { IndicatorBubble } from '@components/IndicatorBubble/IndicatorBubble';
import { CalciteIcon } from '@esri/calcite-components-react';
import { useTranslation } from 'react-i18next';

interface IProps {
    selectedWaybackItems: Array<number>;
    // disabled: boolean;
    /**
     * If true, the create webmap panel is open. This prop is used to determine the style of the button.
     */
    active: boolean;
    onClick?: () => void;
    // clearAll?: () => void;
}

// interface IState {}
export const SaveAsWebmapBtn: React.FC<IProps> = ({
    selectedWaybackItems,
    // disabled,
    active,
    onClick,
    // clearAll,
}) => {
    const { t } = useTranslation();

    const hasSelectedItems = selectedWaybackItems.length > 0;

    const tooltipContent = t('toggle_save_webmap_panel');

    // const onClickHandler = () => {
    //     if (isActive && onClick) {
    //         onClick(true);
    //     }
    // };

    return (
        <div
            className={classNames(
                'relative w-full text-center py-2 px-1 cursor-pointer z-10',
                {
                    // 'opacity-50 pointer-events-none': disabled,
                    'bg-black text-white': active,
                }
            )}
        >
            <button
                className={classNames(
                    'relative flex mx-auto items-center justify-center'
                )}
                aria-label={tooltipContent}
                onClick={onClick}
                title={tooltipContent}
                // disabled={disabled}
                data-testid="save-as-webmap-button"
            >
                <CalciteIcon icon="arcgis-online" scale="l" />
            </button>

            {hasSelectedItems && (
                <IndicatorBubble>
                    <span
                        data-testid="selected-wayback-items-count"
                        data-count={selectedWaybackItems?.length || 0}
                    >
                        {selectedWaybackItems.length}
                    </span>
                </IndicatorBubble>
            )}
        </div>
    );
};

// export default SaveAsWebmapBtn;
