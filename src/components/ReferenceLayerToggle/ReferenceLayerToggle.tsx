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
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
    isActive: boolean;
    onClick: () => void;
    localeSwitchButtonOnClick: () => void;
}

const ReferenceLayerToggle: React.FC<IProps> = ({
    isActive,
    onClick,
    localeSwitchButtonOnClick,
}) => {
    const { t } = useTranslation();

    const icon = isActive ? (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            height="16"
            width="16"
        >
            <path
                fill="currentColor"
                d="M13.071 1H1.93a.929.929 0 0 0-.93.929V13.07a.929.929 0 0 0 .929.929H13.07a.929.929 0 0 0 .929-.929V1.93a.929.929 0 0 0-.928-.93zM13 13H2V2h11zM3.735 7.346l.738-.738 2.084 2.088L11.262 4l.738.738-5.443 5.43z"
            />
        </svg>
    ) : (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            height="16"
            width="16"
        >
            <path
                fill="currentColor"
                d="M14.071 2H2.93a.929.929 0 0 0-.93.929V14.07a.929.929 0 0 0 .929.929H14.07a.929.929 0 0 0 .929-.929V2.93a.929.929 0 0 0-.928-.93zM14 14H3V3h11z"
            />
        </svg>
    );

    return (
        <div className="relative w-full h-full flex items-center justify-between ">
            <div className="flex items-center ml-2">
                <button
                    className="mx-2 cursor-pointer"
                    onClick={onClick}
                    aria-label={t('toggle_reference_layer')}
                >
                    {icon}
                </button>
                <div className=" text-sm">{t('reference_label_overlay')}</div>
            </div>
            {/* 
            <button
                className="mr-2 flex items-center cursor-pointer"
                title={t('choose_label_language')}
                aria-label={t('choose_label_language')}
                onClick={localeSwitchButtonOnClick}
            >
                <CalciteIcon icon="language" scale="s"></CalciteIcon>
            </button> */}

            <CalciteButton
                appearance="transparent"
                kind="neutral"
                onClick={localeSwitchButtonOnClick}
                label={t('choose_label_language')}
                iconStart="language"
            >
                {/* <CalciteIcon icon="language" scale="s"></CalciteIcon> */}
            </CalciteButton>
        </div>
    );
};

export default ReferenceLayerToggle;
