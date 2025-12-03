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
import { AppHeaderText } from './AppHeaderText';
import { CalciteIcon } from '@esri/calcite-components-react';

interface IProps {
    infoButtonOnClick?: () => void;
}

const TitleText: React.FC<IProps> = ({ infoButtonOnClick }) => {
    return (
        <div className="absolute top-0 left-0 right-0 box-border p-2 flex flex-row flex-nowrap justify-start items-center background-theme-blue-diagonal-pattern">
            <div
                className="flex justify-center items-center fill-white w-[30px] h-[30px] leading-[30px] mr-4"
                onClick={infoButtonOnClick}
            >
                <CalciteIcon icon="information" />
            </div>
            <AppHeaderText />
        </div>
    );
};

export default TitleText;
