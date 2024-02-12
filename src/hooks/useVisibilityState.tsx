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

import React, { useEffect, useState } from 'react';

/**
 * Use Page Visibility API to check and see if the current page is visible.
 *
 * When the user minimizes the window or switches to another tab,
 * the API sends a visibilitychange event to let listeners know the state of the page has changed.
 * @returns `boolean` if true, the current page is visible
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 */
const useVisibilityState = () => {
    const [isPageVisible, setIsPageVisible] = useState(true);

    useEffect(() => {
        document.addEventListener('visibilitychange', (event) => {
            setIsPageVisible(document.visibilityState == 'visible');
        });
    }, []);

    return isPageVisible;
};

export default useVisibilityState;
