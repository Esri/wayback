import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

type PromptToSignInProps = {
    /**
     * Emits when the sign in button is clicked. This prop is required when `promptToSignIn` is true.
     * @returns
     */
    signInButtonOnClick: () => void;
};

export const PromptToSignIn: FC<PromptToSignInProps> = ({
    signInButtonOnClick,
}) => {
    const { t } = useTranslation();

    return (
        <div className="text-white font-light text-sm">
            <p className="mb-1">
                <Trans
                    i18nKey="sign_in_prompt_save_webmap_panel"
                    components={{
                        action: (
                            <button
                                className="font-semibold underline cursor-pointer text-custom-theme-blue-light"
                                aria-label={t('sign_in')}
                                data-testid="sign-in-to-save-webmap-button"
                                onClick={signInButtonOnClick}
                            />
                        ),
                    }}
                />
            </p>
        </div>
    );
};
