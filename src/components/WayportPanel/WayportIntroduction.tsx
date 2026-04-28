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
import { Trans, useTranslation } from 'react-i18next';

type Props = {
    /**
     * if true, the user is not signed in and should be prompted to sign in
     */
    promptToSignIn: boolean;
    /**
     * if true, the user is signed in with an ArcGIS public account and should be prompted to sign in with an organizational account
     * to access download features
     */
    promptToSignInWithOrgAccount: boolean;
    /**
     * If true, it means the user has not selected any wayback item to export, and should be prompted to select a wayback item to export
     */
    promptToSelectVersionToExport: boolean;
    /**
     * Sign in button click handler
     * @returns void
     */
    signInButtonOnClick: () => void;
    /**
     * Emits when the user clicks the button to open explore mode to select wayback items to export
     * @returns
     */
    openExploreModeButtonOnClick: () => void;
};

export const WayportIntroduction: FC<Props> = ({
    promptToSignIn,
    promptToSignInWithOrgAccount,
    promptToSelectVersionToExport,
    signInButtonOnClick,
    openExploreModeButtonOnClick,
}) => {
    const { t } = useTranslation();

    if (promptToSignIn || promptToSignInWithOrgAccount) {
        return (
            <div className="text-white font-light text-sm mb-2">
                <p className="">
                    <Trans
                        i18nKey={
                            promptToSignIn
                                ? 'sign_in_prompt_download_panel'
                                : 'sign_in_with_org_account_prompt_download_panel'
                        }
                        components={{
                            action: (
                                <button
                                    className="font-semibold underline cursor-pointer text-custom-theme-blue-light "
                                    onClick={() => {
                                        // console.log('Sign in clicked')
                                        if (signInButtonOnClick) {
                                            signInButtonOnClick();
                                        }
                                    }}
                                />
                            ),
                        }}
                    />
                </p>
            </div>
        );
    }

    if (promptToSelectVersionToExport) {
        return (
            <div className="text-white font-light text-sm mb-2">
                <p className="">
                    <Trans
                        i18nKey={'prompt_to_select_wayback_item_to_export'}
                        components={{
                            action: (
                                <button
                                    className="font-semibold underline cursor-pointer text-custom-theme-blue-light "
                                    onClick={openExploreModeButtonOnClick}
                                />
                            ),
                        }}
                    />
                </p>
            </div>
        );
    }

    return null;
};
