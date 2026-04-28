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

import React, { useCallback } from 'react';

import { IWaybackItem } from '@typings/index';

import { LayerSelector } from '../';
import { useTranslation } from 'react-i18next';
import { CalciteIcon } from '@esri/calcite-components-react';

type Props = {
    // waybackItems: IWaybackItem[];
    // rNum4AnimationFrames: number[];
    waybackItemsWithLocalChanges: IWaybackItem[];
    rNum2Exclude: number[];
    releaseNum4ActiveFrame: number;
    // activeItem: IWaybackItem;
    isButtonDisabled: boolean;
    setActiveFrame: (rNum: number) => void;
    toggleFrame: (rNum: number) => void;
};

const FramesSeletor: React.FC<Props> = ({
    // waybackItems,
    // rNum4AnimationFrames,
    waybackItemsWithLocalChanges,
    rNum2Exclude,
    releaseNum4ActiveFrame,
    // activeItem,
    isButtonDisabled,
    setActiveFrame,
    toggleFrame,
}: Props) => {
    const { t } = useTranslation();

    const getList = () => {
        if (
            !waybackItemsWithLocalChanges ||
            !waybackItemsWithLocalChanges.length
        ) {
            return null;
        }

        const items = [...waybackItemsWithLocalChanges]
            .sort((a, b) => b.releaseDatetime - a.releaseDatetime)
            .map((d) => {
                const { releaseDateLabel, itemID, releaseNum } = d;

                const isExcluded = rNum2Exclude.indexOf(releaseNum) > -1;

                const label = t('select_release_animation', {
                    releaseDate: releaseDateLabel,
                });

                return (
                    <LayerSelector
                        key={itemID}
                        onClick={setActiveFrame.bind(this, releaseNum)}
                        showBoarderOnLeft={
                            releaseNum4ActiveFrame === releaseNum
                        }
                        disableCursorPointer={isButtonDisabled}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <button
                                className="flex items-center mr-2 cursor-pointer text-white"
                                onClick={(evt) => {
                                    evt.stopPropagation();
                                    toggleFrame(releaseNum);
                                }}
                                aria-label={label}
                            >
                                {isExcluded ? (
                                    <CalciteIcon icon="square" scale="s" />
                                ) : (
                                    <CalciteIcon
                                        icon="check-square"
                                        scale="s"
                                    />
                                )}
                            </button>

                            <span>{releaseDateLabel}</span>
                        </div>
                    </LayerSelector>
                );
            });

        return (
            <div
                className="w-full pb-10 px-4 fancy-scrollbar overflow-y-auto"
                style={{
                    height: 'calc(100% - 40px)',
                }}
            >
                {items}
            </div>
        );
    };

    return getList();
};

export default FramesSeletor;
