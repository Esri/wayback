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
import { useTranslation } from 'react-i18next';

import { IWaybackItem } from '@typings/index';

interface IProps {
    isMobile: boolean;
    activeWaybackItem: IWaybackItem;
    previewWaybackItem: IWaybackItem;
    shouldShowPreviewItemTitle: boolean;
}

const Title4ActiveItem: React.FC<IProps> = ({
    activeWaybackItem,
    previewWaybackItem,
    shouldShowPreviewItemTitle,
    isMobile,
}) => {
    const { t } = useTranslation();

    const releaseDate = shouldShowPreviewItemTitle
        ? previewWaybackItem.releaseDateLabel
        : activeWaybackItem.releaseDateLabel;

    return (
        <div className="flex text-custom-theme-blue-light justify-center items-center text-center md:text-left">
            <div className="">
                <span className="text-xs">{t('selected_version')}</span>
                <br />
                <span className="text-xl font-medium">{releaseDate}</span>
            </div>

            {!isMobile && (
                <>
                    <div className="ml-3 pl-3 border-l border-custom-theme-blue-dark w-2/5 leading-none">
                        <span className="text-xs">
                            {t('click_map_for_imagery_details')}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default Title4ActiveItem;
