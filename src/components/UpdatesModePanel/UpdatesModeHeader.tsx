import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

type UpdatesModeHeaderProps = {
    /**
     * If true, shows a prompt to sign in to access updates mode features.
     */
    showSignInPrompt: boolean;
    /**
     * Emits when the sign-in action is triggered.
     * @returns void
     */
    signInButtonOnClick: () => void;
};

export const UpdatesModeHeader: FC<UpdatesModeHeaderProps> = ({
    showSignInPrompt,
    signInButtonOnClick,
}) => {
    const { t } = useTranslation();
    return (
        <div className="text-white font-light text-sm mb-2">
            {showSignInPrompt ? (
                <h3 className="">
                    {/* {t('sign_in_prompt_updates_mode')} */}

                    <Trans
                        i18nKey="sign_in_prompt_updates_mode"
                        components={{
                            action: (
                                <span
                                    className="font-medium underline cursor-pointer text-custom-theme-blue-light"
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
                </h3>
            ) : (
                <h3>{t('updates_mode_header')}</h3>
            )}
        </div>
    );
};
