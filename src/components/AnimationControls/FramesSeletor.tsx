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

import React, { useCallback } from 'react';

import { IWaybackItem } from '@typings/index';

import { LayerSelector } from '../';

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
                // const isSelected =
                //     activeItem && activeItem.itemID === itemID;

                const isExcluded = rNum2Exclude.indexOf(releaseNum) > -1;

                const checkbox = isExcluded ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        height="16"
                        width="16"
                    >
                        <path
                            d="M14.071 15a.929.929 0 0 0 .929-.929V2.93a.929.929 0 0 0-.929-.93H2.93a.929.929 0 0 0-.93.929V14.07a.929.929 0 0 0 .929.929zM3 3h11v11H3z"
                            fill="#fff"
                        />
                        <path fill="none" d="M0 0h16v16H0z" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        height="16"
                        width="16"
                    >
                        <path
                            d="M14.071 15a.929.929 0 0 0 .929-.929V2.93a.929.929 0 0 0-.929-.93H2.93a.929.929 0 0 0-.93.929V14.07a.929.929 0 0 0 .929.929zM3 3h11v11H3zm9.262 2l.738.738-5.443 5.43-2.822-2.822.738-.738 2.084 2.088z"
                            fill="#fff"
                        />
                        <path fill="none" d="M0 0h16v16H0z" />
                    </svg>
                );

                return (
                    <LayerSelector
                        // className={classNames}
                        key={itemID}
                        // isSelected={isSelected}
                        // onClick={onSelect.bind(this, d)}
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
                            <div
                                className="margin-right-half cursor-pointer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                onClick={(evt) => {
                                    evt.stopPropagation();
                                    toggleFrame(releaseNum);
                                }}
                            >
                                {checkbox}
                            </div>

                            <span>{releaseDateLabel}</span>
                        </div>
                    </LayerSelector>
                );
            });

        return (
            <div
                style={{
                    width: '100%',
                    marginTop: '.5rem',
                }}
            >
                {/* <div>
                    <span className="font-size--3">
                        Animation Frames
                    </span>
                </div> */}
                {items}
            </div>
        );
    };

    return getList();
};

export default FramesSeletor;
