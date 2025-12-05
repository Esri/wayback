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

import { CalciteButton, CalciteIcon } from '@esri/calcite-components-react';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

interface IProps {
    isActive: boolean;
    // label:string,
    onChange: () => void;
}

export const LocalChangesToggle: FC<IProps> = ({ isActive, onChange }) => {
    const { t } = useTranslation();

    return (
        <div className="hidden md:flex items-center justify-center my-1">
            <CalciteButton
                appearance="transparent"
                kind="neutral"
                scale="s"
                onClick={onChange}
                label={t('show_only_local_changes')}
                iconStart={isActive ? 'check-square' : 'square'}
            >
                {/* {t('show_only_local_changes')} */}
            </CalciteButton>

            <span className="text-sm ml-1">
                <Trans
                    i18nKey="show_only_local_changes_with_highlight"
                    components={{
                        strong: <span className="text-white" />,
                    }}
                />
            </span>
        </div>
    );
};

// export default React.memo(CheckboxToggle);
