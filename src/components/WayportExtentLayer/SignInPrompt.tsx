import { AppContext } from '@contexts/AppContextProvider';
import { signIn, switchAccount } from '@utils/Esri-OAuth';
import React, { useContext } from 'react';
import { Trans } from 'react-i18next';

export const SignInPrompt = () => {
    const { signedInWithArcGISPublicAccount } = useContext(AppContext);

    return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 text-white z-50 pointer-events-auto p-4 text-center backdrop-blur-sm">
            <p>
                <Trans
                    i18nKey={
                        signedInWithArcGISPublicAccount
                            ? 'sign_in_with_org_account_prompt_download_panel'
                            : 'sign_in_prompt_download_panel'
                    }
                    components={{
                        action: (
                            <button
                                className="font-semibold underline cursor-pointer text-custom-theme-blue-light "
                                onClick={() => {
                                    if (signedInWithArcGISPublicAccount) {
                                        switchAccount();
                                    } else {
                                        signIn();
                                    }
                                }}
                            />
                        ),
                    }}
                />
            </p>
        </div>
    );
};
