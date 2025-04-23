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

// import React from 'react';
/**
 * Intrinsic elements are looked up on the special interface JSX.IntrinsicElements.
 * @see https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements
 */
declare namespace React.JSX {
    export interface IntrinsicElements {
        'calcite-loader': any;
        'calcite-icon': any;
        'calcite-button': any;
        'calcite-slider': any;
        'calcite-switch': any;
        'calcite-checkbox': any;
        'calcite-label': any;
        'calcite-radio-button': any;
        'calcite-radio-button-group': any;
        'calcite-input-text': any;
        'calcite-chip': any;
    }
}
