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

import './MobileHeader.css';
import React from 'react';
import { AppHeaderText } from './AppHeaderText';
import { CalciteIcon } from '@esri/calcite-components-react';

interface IProps {
    // isGutterHide?: boolean;
    infoButtonOnClick?: () => void;
}

// interface IState {}

class TitleText extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { infoButtonOnClick } = this.props;

        // const leftNavBtnIcon = isGutterHide ? (
        //     // menu btn
        //     <svg
        //         xmlns="http://www.w3.org/2000/svg"
        //         height="24"
        //         width="24"
        //         viewBox="0 0 24 24"
        //     >
        //         <path d="M21 6H3V5h18zm0 6H3v1h18zm0 7H3v1h18z" />
        //     </svg>
        // ) : (
        //     // close btn
        //     <svg
        //         xmlns="http://www.w3.org/2000/svg"
        //         height="24"
        //         width="24"
        //         viewBox="0 0 24 24"
        //     >
        //         <path d="M13.207 12.5l7.778 7.778-.707.707-7.778-7.778-7.778 7.778-.707-.707 7.778-7.778-7.778-7.778.707-.707 7.778 7.778 7.778-7.778.707.707z" />
        //     </svg>
        // );

        return (
            <div className="mobile-header">
                <div
                    className="header-nav-btn mr-4"
                    onClick={infoButtonOnClick}
                >
                    <CalciteIcon icon="information" />
                </div>
                <AppHeaderText />
            </div>
        );
    }
}

export default TitleText;
