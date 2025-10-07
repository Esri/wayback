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
import { copyAnimationLink } from '@store/AnimationMode/thunks';
import classNames from 'classnames';
import React from 'react';
import { useAppDispatch } from '@store/configureStore';

export const CopyLinkButton = () => {
    const dispatch = useAppDispatch();

    return (
        <button
            className={classNames('absolute top-1 right-32')}
            onClick={() => {
                dispatch(copyAnimationLink());
            }}
            aria-label="Copy link to clipboard"
        >
            {/* link icon: https://esri.github.io/calcite-ui-icons/#link */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                height={58}
                width={64}
                className="with-drop-shadow"
            >
                <path
                    fill="currentColor"
                    d="M22.766 13.875c.063.058.128.11.189.17l5 5a6.3 6.3 0 0 1-8.91 8.91l-5-5a6.286 6.286 0 0 1 2.969-10.568 3.279 3.279 0 0 1 .553.905 5.288 5.288 0 0 0-2.815 8.956l5 5a5.3 5.3 0 0 0 7.496-7.496l-4.488-4.488a8.366 8.366 0 0 0 .006-1.389zm-12.526 3.86l-4.488-4.487a5.3 5.3 0 0 1 7.496-7.496l5 5a5.288 5.288 0 0 1-2.815 8.956 3.278 3.278 0 0 0 .553.905 6.287 6.287 0 0 0 2.969-10.568l-5-5a6.3 6.3 0 0 0-8.91 8.91l5 5c.061.06.126.112.189.17a8.367 8.367 0 0 1 .006-1.39z"
                />
                <path fill="none" d="M0 0h32v32H0z" />
            </svg>
        </button>
    );
};
