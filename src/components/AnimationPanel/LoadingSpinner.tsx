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

import './LoadingSpinner.css';
import React from 'react';

// import styled, { keyframes } from 'styled-components';

// const bounce = keyframes`
// 	0% {
//         margin-left:-25%;
//     }
// 	50% {
//         margin-left:100%;
//     }
// `;

// const SpinnerWrap = styled.div`
//     position: relative;
//     /* top: -1px;
//     left: 0; */
//     width: 100%;
//     height: 3px;
//     overflow: hidden;
// `;

// const SpinnerLine = styled.div`
//     background-color: #fff;
//     width: 30%;
//     height: 100%;
//     margin-top: 0;
//     margin-left: -25%;
//     animation: ${bounce} 2s infinite ease-in;
// `;

const LoadingSpinner = () => {
    return (
        <div className="spinner-wrap">
            <div className="spinner-line" />
        </div>
    );
};

export default LoadingSpinner;
