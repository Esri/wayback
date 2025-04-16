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
import React, { FC, useState } from 'react';
import { MOBILE_HEADER_HEIGHT } from '@constants/UI';

interface IProps {
    isMobile: boolean;
    settingsBtnDisabled: boolean;
    // shareBtnDisabled: boolean;
    // children: JSX.Element[] | JSX.Element;

    aboutButtonOnClick: () => void;
    copyButtonOnClick: () => void;
    settingButtonOnClick: () => void;

    children?: React.ReactNode;
}

export const Gutter: FC<IProps> = ({
    isMobile,
    // shareBtnDisabled,
    settingsBtnDisabled,
    copyButtonOnClick,
    aboutButtonOnClick,
    settingButtonOnClick,
    children,
}) => {
    const [hasCopied2Clipboard, setHasCopied2Clipboard] = useState(false);

    return (
        <div
            className="gutter-container background-theme-blue-diagonal-pattern"
            style={{
                top: isMobile ? MOBILE_HEADER_HEIGHT : 0,
            }}
        >
            {/* gradient effect on right side of gutter */}
            {/* <div
                className="absolute top-header-height left-0 z-0 w-full h-full"
                style={{
                    background: `linear-gradient(90deg, rgba(0,0,0,0) 80%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,1) 100%)`,
                }}
            ></div> */}

            <div className="py-1">
                <div
                    className="gutter-nav-btn mb-2"
                    // data-modal={AboutThisAppModalConfig['modal-id']}
                    title="About this app"
                    onClick={aboutButtonOnClick}
                >
                    <calcite-icon icon="information" scale="l" />
                </div>

                {/* {!shareBtnDisabled && (
                    <div
                        className="gutter-nav-btn mb-1"
                        // data-modal={ShareModalConfig['modal-id']}
                        title="Share"
                        onClick={shareButtonOnClick}
                    >
                        <calcite-icon icon="share" scale="l" />
                    </div>
                )} */}

                <div
                    className="gutter-nav-btn mb-2"
                    title={
                        hasCopied2Clipboard
                            ? 'Copied link to clipboard'
                            : 'Copy link to clipboard'
                    }
                    onClick={() => {
                        copyButtonOnClick();

                        setHasCopied2Clipboard(true);

                        setTimeout(() => {
                            setHasCopied2Clipboard(false);
                        }, 3000);
                    }}
                >
                    <calcite-icon icon="link" scale="l" />
                </div>

                <div
                    className={`gutter-nav-btn ${
                        settingsBtnDisabled ? 'btn-disabled' : ''
                    }`}
                    // data-modal={SettingModalConfig['modal-id']}
                    title="Settings"
                    onClick={settingButtonOnClick}
                >
                    <calcite-icon icon="gear" scale="l" />
                </div>
            </div>

            {/* divider with shadow effect */}
            <div
                className="w-full h-2"
                style={{
                    background: `linear-gradient(5deg, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 100%)`,
                }}
            ></div>

            {children}
        </div>
    );
};
