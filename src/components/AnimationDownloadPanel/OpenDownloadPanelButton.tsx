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

import { showDownloadAnimationPanelToggled } from '@store/AnimationMode/reducer';
import classNames from 'classnames';
import React from 'react';
import { useAppDispatch } from '@store/configureStore';

export const OpenDownloadPanelButton = () => {
    const dispatch = useAppDispatch();

    return (
        <div
            className={classNames('absolute top-1 right-16', 'cursor-pointer')}
            onClick={() => {
                dispatch(showDownloadAnimationPanelToggled(true));
            }}
        >
            {/* download-to icon: https://esri.github.io/calcite-ui-icons/#download-to */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                height={64}
                width={64}
                className="with-drop-shadow"
            >
                <path
                    fill="currentColor"
                    d="M25 27H8v-1h17zm-3.646-9.646l-.707-.707L17 20.293V5h-1v15.293l-3.646-3.646-.707.707 4.853 4.853z"
                />
                <path fill="none" d="M0 0h32v32H0z" />
            </svg>
        </div>
    );
};
