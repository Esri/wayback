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

import './SwipeWidgetLayerSelector.css';
import React from 'react';
import { IWaybackItem } from '@typings/index';
import classnames from 'classnames';

import { LayerSelector } from '../';
import { CalciteIcon } from '@esri/calcite-components-react';
import { useTranslation } from 'react-i18next';

export const SwipeWidgetLayerSelectorWidth = 220;

export type SwipeWidgetLayer = 'leading' | 'trailing';

type Props = {
    targetLayerType: SwipeWidgetLayer;
    waybackItems: IWaybackItem[];
    rNum4WaybackItemsWithLocalChanges: number[];
    selectedItem: IWaybackItem;
    // showCloseBtn?: boolean;
    onSelect: (data: IWaybackItem) => void;
    onClose?: () => void;
};

const SwipeWidgetLayerSelector: React.FC<Props> = ({
    targetLayerType,
    waybackItems,
    rNum4WaybackItemsWithLocalChanges,
    selectedItem,
    // showCloseBtn,
    onSelect,
    onClose,
}: Props) => {
    const { t } = useTranslation();

    const getList = () => {
        const items = waybackItems
            .filter((d) => {
                return (
                    rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) > -1
                );
            })
            .map((d) => {
                const { releaseDateLabel, itemID } = d;
                const isSelected =
                    selectedItem && selectedItem.itemID === itemID;

                const label =
                    targetLayerType === 'leading'
                        ? t('select_release_left_swipe', {
                              releaseDate: releaseDateLabel,
                          })
                        : t('select_release_right_swipe', {
                              releaseDate: releaseDateLabel,
                          });

                return (
                    <LayerSelector
                        key={itemID}
                        isSelected={isSelected}
                        showArrowOnLeft={targetLayerType === 'trailing'}
                        onClick={onSelect.bind(this, d)}
                        label={label}
                    >
                        {releaseDateLabel}
                    </LayerSelector>
                );
            });

        return (
            <div className="flex-grow pt-12">
                <div>
                    <span className="text-sm">
                        Versions with{' '}
                        <span className="text-white">local changes</span>
                    </span>
                </div>
                {items}
            </div>
        );
    };

    const getTitle = () => {
        if (!selectedItem) {
            return null;
        }

        return (
            <div className="text-center text-custom-theme-blue-light shrink-0">
                <h4 className="text-2xl font-light mb-0">
                    {targetLayerType === 'leading' ? 'Left' : 'Right'} Selection
                </h4>
                <div>
                    <span>{selectedItem.releaseDateLabel}</span>
                    <br />
                    <span className="text-xs">
                        Click map for imagery details
                    </span>
                </div>
            </div>
        );
    };

    const getCloseBtn = () => {
        if (!onClose) {
            return null;
        }

        return (
            <button
                className="absolute top-1 right-1 cursor-pointer text-white"
                // style={{
                //     position: 'absolute',
                //     top: '0.25rem',
                //     right: '0',
                //     cursor: 'pointer',
                // }}
                onClick={onClose}
                aria-label={t('close_swipe_mode')}
            >
                {/* <span className="icon-ui-close text-white"></span> */}
                <CalciteIcon icon="x" scale="l" />
            </button>
        );
    };

    return (
        <div
            className=" flex flex-col overflow-y-auto overflow-x-hidden bg-custom-background p-4 fancy-scrollbar"
            style={{
                // position: 'absolute',
                height: '100%',
                width: SwipeWidgetLayerSelectorWidth,
                top: 0,
                left: targetLayerType === 'leading' ? 0 : 'unset',
                right: targetLayerType === 'trailing' ? 0 : 'unset',
                boxSizing: 'border-box',
                // display: 'flex',
                // alignItems: 'center',
            }}
        >
            {getTitle()}
            {getCloseBtn()}
            {getList()}
        </div>
    );
};

export default SwipeWidgetLayerSelector;
