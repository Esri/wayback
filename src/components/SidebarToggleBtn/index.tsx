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

import React, { FC } from 'react';
import './style.css';
import { IS_MOBILE } from '@constants/UI';

interface IProps {
    isSideBarHide: boolean;
    onClick: () => void;
}

// interface IState {}

export const SidebarToggleBtn: FC<IProps> = ({ isSideBarHide, onClick }) => {
    if (IS_MOBILE === false) {
        return null;
    }

    const icon = isSideBarHide ? (
        // open btn
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            viewBox="0 0 24 24"
        >
            <path d="M22 13h-9v9h-1v-9H3v-1h9V3h1v9h9z" />
        </svg>
    ) : (
        // close btn
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            viewBox="0 0 24 24"
        >
            <path d="M13.207 12.5l7.778 7.778-.707.707-7.778-7.778-7.778 7.778-.707-.707 7.778-7.778-7.778-7.778.707-.707 7.778 7.778 7.778-7.778.707.707z" />
        </svg>
    );

    return (
        <div
            className="sidebar-toggle-btn block md:hidden"
            onClick={onClick}
            style={{
                position: 'absolute',
                top: '.75rem',
                right: '.5rem',
            }}
        >
            {icon}
        </div>
    );
};
