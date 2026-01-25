import React, { useContext } from 'react';
import { WayportIntroduction } from './WayportIntroduction';
import { AppContext } from '@contexts/AppContextProvider';
import { signIn } from '@utils/Esri-OAuth';

export const WayportPanelContainer = () => {
    const { notSignedIn, signedInWithArcGISPublicAccount } =
        useContext(AppContext);

    return (
        <div
            className="p-2 pb-4 flex flex-col gap-1 overflow-y-auto fancy-scrollbar"
            style={{
                maxHeight: 'calc(100vh - 60px)',
            }}
        >
            <WayportIntroduction
                promptToSignIn={notSignedIn}
                promptToSignInWithOrgAccount={signedInWithArcGISPublicAccount}
                signInButtonOnClick={() => {
                    signIn();
                }}
            />
        </div>
    );
};
