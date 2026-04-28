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

import { useAppSelector } from '@store/configureStore';
import { selectIsPerformanceAnalyzeToolEnabled } from '@store/UI/reducer';
import React from 'react';
import { LocalChangeQueryDuration } from './LocalChangeQueryDuration';

/**
 * This container component conditionally renders the Performance Analyze Tool components
 * based on whether the tool is enabled in the application state.
 *
 * To enable the Performance Analyze Tool, set the URL query parameter
 * `?enablePerformanceAnalyzeTool=true`.
 *
 * @returns
 */
export const PerformanceAnalyzeToolContainer = () => {
    const isEnabled = useAppSelector(selectIsPerformanceAnalyzeToolEnabled);

    if (!isEnabled) {
        return null;
    }

    return <LocalChangeQueryDuration />;
};
