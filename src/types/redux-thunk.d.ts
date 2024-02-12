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

// need to make sure to import 'redux-thunk/extend-redux' to address the "ThunkAction is not assignable to parameter of type 'AnyAction'"" issue,
// found this solution from this issue: https://github.com/reduxjs/redux-thunk/issues/333#issuecomment-1109308664
// TO-DO: remove this when this issue is addressed by later version of @reduxjs/toolkit
/// <reference types="redux-thunk/extend-redux" />
