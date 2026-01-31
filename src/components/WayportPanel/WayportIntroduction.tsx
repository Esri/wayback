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
     * Sign in button click handler
     * @returns void
     */
    signInButtonOnClick: () => void;
};

export const WayportIntroduction: FC<Props> = ({
    promptToSignIn,
    promptToSignInWithOrgAccount,
    signInButtonOnClick,
}) => {
    const { t } = useTranslation();
    return (
        <div className="text-white font-light text-sm">
            {promptToSignIn || promptToSignInWithOrgAccount ? (
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
            ) : // <p className="">
            //     <Trans
            //         i18nKey="wayback_export_description"
            //         components={{
            //             'offline-app-link': (
            //                 <a
            //                     href="https://developers.arcgis.com/documentation/mapping-apis-and-services/offline/"
            //                     target="_blank"
            //                     rel="noreferrer"
            //                 />
            //             ),
            //             'summary-link': (
            //                 <a
            //                     href="https://downloads2.esri.com/arcgisonline/docs/tou_summary.pdf"
            //                     target="_blank"
            //                     rel="noreferrer"
            //                 />
            //             ),
            //             'terms-of-use-link': (
            //                 <a
            //                     href="https://www.esri.com/en-us/legal/terms/full-master-agreement"
            //                     target="_blank"
            //                     rel="noreferrer"
            //                 />
            //             ),
            //         }}
            //     />
            // </p>
            null}

            {/* <p className="text-sm mt-2 mb-4">
            <Trans
                i18nKey="wayback_export_description"
                components={{
                    'offline-app-link': (
                        <a
                            href="https://developers.arcgis.com/documentation/mapping-apis-and-services/offline/"
                            target="_blank"
                            rel="noreferrer"
                        />
                    ),
                    'summary-link': (
                        <a
                            href="https://downloads2.esri.com/arcgisonline/docs/tou_summary.pdf"
                            target="_blank"
                            rel="noreferrer"
                        />
                    ),
                    'terms-of-use-link': (
                        <a
                            href="https://www.esri.com/en-us/legal/terms/full-master-agreement"
                            target="_blank"
                            rel="noreferrer"
                        />
                    ),
                }}
            />
        </p>

        <ul className="list-inside list-disc text-xs opacity-80">
            <li>{t('wayport_export_instruction_1')}</li>
            <li>{t('wayport_export_instruction_2')}</li>
            <li>{t('wayport_export_instruction_3')}</li>
            <li>{t('wayport_export_instruction_4')}</li>
        </ul> */}
        </div>
    );
};
