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

interface IProps {
    selectedWaybackItems: Array<number>;
    disabled: boolean;
    onClick?: (val: boolean) => void;
    clearAll?: () => void;
}

// interface IState {}

class SaveAsWebmapBtn extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler() {
        const { selectedWaybackItems, onClick } = this.props;

        if (selectedWaybackItems.length) {
            onClick(true);
        }
    }

    render() {
        const { selectedWaybackItems, disabled, clearAll } = this.props;

        const isActive = selectedWaybackItems.length ? true : false;

        const tooltipContent = isActive
            ? 'Open these versions in a new Web Map'
            : 'Choose versions from the list to build a set of Wayback layers for use in a new Web Map';

        return (
            <div
                className={classNames(
                    'save-as-webmap-btn-container relative w-full text-center',
                    {
                        'is-disabled': disabled,
                    }
                )}
            >
                <div
                    // className={btnClass}
                    className={classNames('relative', {
                        'cursor-pointer': isActive,
                    })}
                    onClick={this.onClickHandler}
                    title={tooltipContent}
                >
                    <calcite-icon icon="arcgis-online" scale="l" />

                    {isActive && (
                        // <div className="indicator-count-of-selected-items">
                        //     <span>{selectedWaybackItems.length}</span>
                        // </div>
                        <IndicatorBubble>
                            <span>{selectedWaybackItems.length}</span>
                        </IndicatorBubble>
                    )}
                </div>

                {isActive && (
                    <div
                        className="text-center cursor-pointer text-xs"
                        onClick={clearAll.bind(this)}
                    >
                        clear all
                    </div>
                )}
            </div>
        );
    }
}

export default SaveAsWebmapBtn;
