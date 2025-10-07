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

import './LayerSelector.css';
import React from 'react';

import classnames from 'classnames';

type Props = {
    isSelected?: boolean;
    showArrowOnLeft?: boolean;
    showBoarderOnLeft?: boolean;
    children?: React.ReactNode;
    disableCursorPointer?: boolean;
    /**
     * accessible label for the button
     */
    label?: string;
    onClick: () => void;
};

const LayerSelector: React.FC<Props> = ({
    isSelected = false,
    showArrowOnLeft = false,
    showBoarderOnLeft = false,
    disableCursorPointer = false,
    label,
    children,
    onClick,
}: Props) => {
    const classNames = classnames('layer-selector', {
        'is-selected': isSelected,
        'is-arrow-on-left': showArrowOnLeft,
    });

    return (
        <div
            className={classNames}
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: '38px',
                margin: '.5rem 0',
                padding: '0 .5rem',
                backgroundColor: isSelected ? '#2267AE' : '#1C1C1C',
                color: isSelected ? '#fff' : 'unset',
                borderLeft:
                    (!showArrowOnLeft && isSelected) || showBoarderOnLeft
                        ? ' 4px solid #fff'
                        : '4px solid transparent',
                borderRight:
                    showArrowOnLeft && isSelected
                        ? ' 4px solid #fff'
                        : '4px solid transparent',
                boxSizing: 'border-box',
                cursor: disableCursorPointer ? 'unset' : 'pointer',
            }}
            aria-label={label}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onClick();
                }
            }}
            tabIndex={0}
            role="button"
        >
            {children}
        </div>
    );
};

export default LayerSelector;
