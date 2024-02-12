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

import React from 'react';
import { DEFAULT_BACKGROUND_COLOR, GUTTER_WIDTH } from '@constants/UI';
import { MobileShow } from '../MobileVisibility';

import Title4ActiveItem from '../Title4ActiveItem/Title4ActiveItemContainer';

type Props = {
    isGutterHide?: boolean;
    OnClick: () => void;
};

const MobileFooter: React.FC<Props> = ({ isGutterHide, OnClick }: Props) => {
    return (
        <MobileShow>
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: isGutterHide ? 0 : GUTTER_WIDTH,
                    // width: '100%',
                    right: 0,
                    background: DEFAULT_BACKGROUND_COLOR,
                    // height: '50px'
                    padding: '.5rem 0',
                }}
                onClick={OnClick}
            >
                <Title4ActiveItem />

                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: '.25rem',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <svg height="32" width="32" viewBox="0 0 32 32">
                        <path
                            d="M16 17H8v-1h8V8h1v8h8v1h-8v8h-1z"
                            fill="#fff"
                        />
                        <path fill="none" d="M0 0h32v32H0z" />
                    </svg>
                </div>
            </div>
        </MobileShow>
    );
};

export default MobileFooter;
