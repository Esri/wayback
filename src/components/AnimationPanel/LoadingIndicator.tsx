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

import LoadingSpinner from './LoadingSpinner';

const LoadingIndicator = () => {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textShadow: `0 0 3px #000`,
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: -1,
                    left: 0,
                    width: '100%',
                }}
            >
                <LoadingSpinner />
            </div>

            <span className="text-white font-size-1">Loading imagery</span>
        </div>
    );
};

export default LoadingIndicator;
