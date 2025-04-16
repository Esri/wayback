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
// import './style.css';

import classnames from 'classnames';

type Props = {
    /**
     * if true, the animation mode is on and the swipe button should be set to semi-transparent
     */
    useDisabledStyle: boolean;
    /**
     * if true, the animation mode is on and the swipe button should be set to semi-transparent
     */
    active: boolean;
    onClickHandler: () => void;
};

const SwipeWidgetToggleBtn: React.FC<Props> = ({
    useDisabledStyle,
    active,
    onClickHandler,
}: Props) => {
    return (
        <div
            data-testid="swipe-widget-toggle-button"
            className={classnames(
                'relative w-full text-center cursor-pointer flex items-center justify-center py-2',
                {
                    'opacity-50': useDisabledStyle,
                    'text-white': active,
                    'bg-black': active,
                }
            )}
            onClick={onClickHandler}
            title="Toggle Swipe Mode"
        >
            <calcite-icon icon="compare" scale="l" />
        </div>
    );
};

export default SwipeWidgetToggleBtn;
