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

import React, { useContext } from 'react';
// import { AppContext } from '@contexts/AppContextProvider';
import { Trans, useTranslation } from 'react-i18next';

// interface IProps {
//     onClose: () => void;
// }
// interface IState {}

export const AboutThiAppContent: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            {/* <h2 className="text-3xl mb-4 text-center">World Imagery Wayback</h2> */}
            {/* <h5 className="text-xl mb-3">{t('about_what_heading')}</h5>
            <p className="mb-6">
                <Trans
                    i18nKey="about_what_description"
                    components={{
                        'world-imagery-basemap-link': (
                            <a
                                href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9"
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        ),
                        'wayback-group-link': (
                            <a
                                href="https://www.arcgis.com/home/group.html?id=0f3189e1d1414edfad860b697b7d8311#overview"
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        ),
                        'github-repo-link': (
                            <a
                                href="https://github.com/Esri/wayback"
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        ),
                    }}
                />
            </p>

            <h5 className="text-xl mb-3">{t('about_why_heading')}</h5>
            <p className="mb-6">{t('about_why_description')}</p>

            <h5 className="text-xl mb-2">{t('about_how_heading')}</h5>
            <p className="mb-6">{t('about_how_description')}</p> */}

            <h3 className="text-2xl mb-2">{t('about_the_data')}</h3>
            <p
                className="mb-3"
                dangerouslySetInnerHTML={{
                    __html: t('about_the_data_section_1'),
                }}
            ></p>
            <p className="mb-6">{t('about_the_data_section_2')}</p>

            <h3 className="text-2xl mb-2">{t('about_the_app')}</h3>
            <p className="mb-3">{t('about_the_app_summary')}</p>
            <ul className="list-disc list-inside mb-3">
                <li>{t('about_the_app_feature_1')}</li>
                <li>{t('about_the_app_feature_2')}</li>
                <li>{t('about_the_app_feature_3')}</li>
                <li>{t('about_the_app_feature_4')}</li>
                <li>{t('about_the_app_feature_5')}</li>
            </ul>
            <p
                className="mb-6"
                dangerouslySetInnerHTML={{
                    __html: t('about_the_app_repo_info'),
                }}
            />

            <h3 className="text-2xl mb-2">
                {t('attribution_and_terms_of_use')}
            </h3>
            <p
                className="mb-1"
                dangerouslySetInnerHTML={{
                    __html: t('attribution_and_terms_of_use_summary'),
                }}
            ></p>
            <p
                dangerouslySetInnerHTML={{
                    __html: t('attribution_and_terms_of_use_esri_master'),
                }}
            />
        </>
    );
};

// export default About;
