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
    disabled: boolean;
    /**
     * Whether the SaveAsWebmap dialog is open or not
     */
    active: boolean;
    onClick?: () => void;
    // clearAll?: () => void;
}

// interface IState {}
export const SaveAsWebmapBtn: React.FC<IProps> = ({
    selectedWaybackItems,
    disabled,
    active,
    onClick,
    // clearAll,
}) => {
    const { t } = useTranslation();

    const isActive = selectedWaybackItems.length > 0;

    const tooltipContent = isActive
        ? t('open_save_webmap_button_tooltip')
        : t('open_save_webmap_button_tooltip_disabled');

    // const onClickHandler = () => {
    //     if (isActive && onClick) {
    //         onClick(true);
    //     }
    // };

    return (
        <div
            className={classNames(
                'save-as-webmap-btn-container relative w-full text-center py-1 hover:text-white',
                {
                    'opacity-50 pointer-events-none': disabled,
                    'bg-black text-white': active,
                }
            )}
        >
            <div className="relative">
                <button
                    className={classNames('relative mt-1', {
                        'cursor-pointer': isActive,
                    })}
                    aria-label={'save as web map'}
                    onClick={onClick}
                    title={tooltipContent}
                    disabled={disabled}
                    data-testid="save-as-webmap-button"
                >
                    <CalciteIcon icon="arcgis-online" scale="l" />
                </button>

                {isActive && (
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

            {/* {isActive && (
                <button
                    className="mx-auto text-center cursor-pointer text-xs"
                    aria-label="clear all selected items"
                    onClick={clearAll}
                    title={t('clear_all')}
                    data-testid="clear-all-selected-items-button"
                >
                    {t('clear_all')}
                </button>
            )} */}
        </div>
    );
};

// export default SaveAsWebmapBtn;
