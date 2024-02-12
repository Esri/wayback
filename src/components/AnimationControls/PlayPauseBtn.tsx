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

import React, { useEffect } from 'react';

type Props = {
    isPlaying: boolean;
    onClick: () => void;
};

const PlayBtn = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        height="16"
        width="16"
    >
        <path d="M4 1.571l10 6.43-10 6.428z" fill="#ccc" />
        <path fill="none" d="M0 0h16v16H0z" />
    </svg>
);

const PauseBtn = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        height="16"
        width="16"
    >
        <path d="M2 1h5v14H2zm12 0H9v14h5z" fill="#ccc" />
        <path fill="none" d="M0 0h16v16H0z" />
    </svg>
);

const PlayPauseBtn: React.FC<Props> = ({ isPlaying, onClick }: Props) => {
    return (
        <div
            className="margin-right-half cursor-pointer"
            style={{
                display: 'flex',
            }}
            onClick={onClick}
        >
            {isPlaying ? PauseBtn : PlayBtn}
        </div>
    );
};

export default PlayPauseBtn;
