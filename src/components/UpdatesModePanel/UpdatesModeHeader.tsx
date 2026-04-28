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

import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

type UpdatesModeHeaderProps = {
    /**
     * If true, shows a prompt to sign in to access updates mode features.
     */
    showSignInPrompt: boolean;
    /**
     * If true, shows a prompt to sign in with an ArcGIS organizational account.
     */
    showSignInWithOrgAccountPrompt: boolean;
    /**
     * Emits when the sign-in action is triggered.
     * @returns void
     */
    signInButtonOnClick: () => void;
};

const SignInLinkClassName =
    'font-medium underline cursor-pointer text-custom-theme-blue-light';

export const UpdatesModeHeader: FC<UpdatesModeHeaderProps> = ({
    showSignInPrompt,
    showSignInWithOrgAccountPrompt,
    signInButtonOnClick,
}) => {
    const { t } = useTranslation();
    return (
        <div className="text-white font-light text-sm mb-2">
            {showSignInPrompt || showSignInWithOrgAccountPrompt ? (
                <p data-testid="updates-mode-sign-in-prompt">
                    {/* {t('sign_in_prompt_updates_mode')} */}

                    <Trans
                        i18nKey={
                            showSignInPrompt
                                ? 'sign_in_prompt_updates_mode'
                                : 'sign_in_with_org_account_prompt_updates_mode'
                        }
                        components={{
                            action: (
                                <button
                                    data-testid="updates-mode-sign-in-button"
                                    className={SignInLinkClassName}
                                    onClick={() => {
                                        if (signInButtonOnClick) {
                                            signInButtonOnClick();
                                        }
                                    }}
                                />
                            ),
                        }}
                    />
                </p>
            ) : (
                <h3>{t('updates_mode_header')}</h3>
            )}
        </div>
    );
};
