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

import './style.css';
import React from 'react';
import classNames from 'classnames';
import { IndicatorBubble } from '@components/IndicatorBubble/IndicatorBubble';
import { CalciteIcon } from '@esri/calcite-components-react';
import { useTranslation } from 'react-i18next';

interface IProps {
    selectedWaybackItems: Array<number>;
    disabled: boolean;
    onClick?: (val: boolean) => void;
    clearAll?: () => void;
}

// interface IState {}
const SaveAsWebmapBtn: React.FC<IProps> = ({
    selectedWaybackItems,
    disabled,
    onClick,
    clearAll,
}) => {
    const { t } = useTranslation();

    const isActive = selectedWaybackItems.length > 0;

    const tooltipContent = isActive
        ? t('open_save_webmap_button_tooltip')
        : t('open_save_webmap_button_tooltip_disabled');

    const onClickHandler = () => {
        if (isActive && onClick) {
            onClick(true);
        }
    };

    return (
        <div
            className={classNames(
                'save-as-webmap-btn-container relative w-full text-center',
                {
                    'opacity-50 pointer-events-none': disabled,
                }
            )}
        >
            <div
                className={classNames('relative', {
                    'cursor-pointer': isActive,
                })}
                onClick={onClickHandler}
                title={tooltipContent}
            >
                <CalciteIcon icon="arcgis-online" scale="l" />

                {isActive && (
                    <IndicatorBubble>
                        <span>{selectedWaybackItems.length}</span>
                    </IndicatorBubble>
                )}
            </div>

            {isActive && (
                <div
                    className="text-center cursor-pointer text-xs"
                    onClick={clearAll}
                >
                    clear all
                </div>
            )}
        </div>
    );
};

export default SaveAsWebmapBtn;
