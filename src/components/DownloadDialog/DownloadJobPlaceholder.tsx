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

import { CalciteLoader } from '@esri/calcite-components-react';
import React from 'react';

export const DownloadJobPlaceholder = () => {
    return (
        <div className="mb-3">
            <div className="w-full h-[57px] bg-white bg-opacity-10 px-2 text-center flex items-center justify-center">
                <CalciteLoader scale="s" />
            </div>
        </div>
    );
};
