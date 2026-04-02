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
