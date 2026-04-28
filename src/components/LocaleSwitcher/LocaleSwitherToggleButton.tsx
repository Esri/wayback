/* Copyright 2024-2026 Esri
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

import { CalciteIcon } from '@esri/calcite-components-react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {
    onClick: () => void;
};
export const LocaleSwitherToggleButton: FC<Props> = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <div className="relative flex justify-center items-center w-full mb-3 cursor-pointer px-1">
            <button
                className={
                    'relative w-full flex justify-center items-center text-center py-1'
                }
                aria-label={t('switch_language')}
                title={t('switch_language')}
                onClick={onClick}
            >
                <CalciteIcon icon="language-2" scale="m" />
            </button>
        </div>
    );
};
