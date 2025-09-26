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
                <p className="">
                    {/* {t('sign_in_prompt_updates_mode')} */}

                    <Trans
                        i18nKey={
                            showSignInPrompt
                                ? 'sign_in_prompt_updates_mode'
                                : 'sign_in_with_org_account_prompt_updates_mode'
                        }
                        components={{
                            action: (
                                <span
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
