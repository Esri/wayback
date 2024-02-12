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

import React, { useMemo } from 'react';
import { usePrevious } from './usePrevious';
import useVisibilityState from './useVisibilityState';

/**
 * Return true when current page becomes visible again
 */
const useCurrenPageBecomesVisible = () => {
    /**
     * If true, the tab of current page is visible
     */
    const isPageVisible = useVisibilityState();

    /**
     * previous value of the visibility state
     */
    const isPageVisiblePrevState = usePrevious(isPageVisible);

    const currentPageIsVisibleAgain = useMemo(() => {
        return isPageVisiblePrevState === false && isPageVisible === true;
    }, [isPageVisible, isPageVisiblePrevState]);

    return currentPageIsVisibleAgain;
};

export default useCurrenPageBecomesVisible;
