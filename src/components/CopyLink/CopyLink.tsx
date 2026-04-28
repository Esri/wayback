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

import { MapActionButton } from '@components/MapView/MapActionButton';
import { CalciteIcon } from '@esri/calcite-components-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const CopyLink = () => {
    const [hasCopied, setHasCopied] = React.useState(false);
    const { t } = useTranslation();
    return (
        <MapActionButton
            showLoadingIndicator={false}
            disabled={false}
            topMarging={4}
            tooltip={t('copyLinkToClipboard')}
            onClickHandler={() => {
                navigator.clipboard.writeText(window.location.href);

                setHasCopied(true);

                setTimeout(() => {
                    setHasCopied(false);
                }, 1000);
            }}
        >
            {hasCopied ? (
                // check icon
                <CalciteIcon icon="check" scale="m" />
            ) : (
                // link icon
                <CalciteIcon icon="link" scale="m" />
            )}
        </MapActionButton>
    );
};
