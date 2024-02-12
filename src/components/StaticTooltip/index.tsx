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

interface IProps {
    content?: string;
    top?: number;
    left?: number;
}

// interface IState {}

// the tooltip component has fixed position
class Tootip extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { content, top, left } = this.props;

        const style = {
            position: 'fixed',
            top,
            left,
        } as React.CSSProperties;

        return content ? (
            <div className="static-tooltip" style={style}>
                {content}
            </div>
        ) : null;
    }
}

export default Tootip;
