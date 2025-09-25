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
import { CalciteIcon } from '@esri/calcite-components-react';
import { AppDialogName } from '@store/UI/reducer';
import classNames from 'classnames';

interface IProps {
    activeDialog: AppDialogName;
    shouldDisableActionButton: boolean;
    aboutButtonOnClick: () => void;
    settingButtonOnClick: () => void;
    children?: React.ReactNode;
}

export const Gutter: FC<IProps> = ({
    // isMobile,
    // shareBtnDisabled,
    activeDialog,
    shouldDisableActionButton,
    // copyButtonOnClick,
    aboutButtonOnClick,
    settingButtonOnClick,
    children,
}) => {
    return (
        <div className="gutter-container background-theme-blue-diagonal-pattern">
            <div className="pt-1">
                <button
                    className={classNames('gutter-nav-btn', {
                        disabled: shouldDisableActionButton,
                        'bg-black text-white': activeDialog === 'about',
                    })}
                    title="About this app"
                    aria-label="About this app"
                    onClick={aboutButtonOnClick}
                >
                    <CalciteIcon icon="information" scale="l" />
                </button>

                <button
                    className={classNames('gutter-nav-btn', {
                        disabled: shouldDisableActionButton,
                        'bg-black text-white': activeDialog === 'setting',
                    })}
                    // data-modal={SettingModalConfig['modal-id']}
                    title="Settings"
                    aria-label="Settings"
                    onClick={settingButtonOnClick}
                >
                    <CalciteIcon icon="gear" scale="l" />
                </button>

                {/* <div
                    className="gutter-nav-btn mb-0"
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
                    <CalciteIcon icon="link" scale="l" />
                </div> */}
            </div>

            {/* divider with shadow effect */}
            <div
                className="w-full h-2 mb-2"
                style={{
                    background: `linear-gradient(5deg, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 100%)`,
                }}
            ></div>

            {children}
        </div>
    );
};
