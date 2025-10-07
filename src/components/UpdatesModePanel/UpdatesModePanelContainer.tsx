import React, { useContext, useEffect } from 'react';
import { UpdatesModeHeader } from './UpdatesModeHeader';
import { StatusFilter } from './Filters/StatusFilter';
import { CategoryFilter } from './Filters/CategoryFilter';
import { DateFilter } from './Filters/DateFilter';
import { RegionFilter } from './Filters/RegionFilter';
import { signIn, signInUsingDifferentAccount } from '@utils/Esri-OAuth';
import classNames from 'classnames';
import { AppContext } from '@contexts/AppContextProvider';

export const UpdatesPanelContainer = () => {
    // useEffect(() => {
    //     if (isAnonymouns()) {
    //         signIn();
    //     }
    // }, []);

    const { notSignedIn, signedInWithArcGISPublicAccount } =
        useContext(AppContext);

    const disabled = notSignedIn || signedInWithArcGISPublicAccount;

    return (
        <div
            className="p-2 pb-4 flex flex-col gap-1 overflow-y-auto fancy-scrollbar"
            style={{
                maxHeight: 'calc(100vh - 60px)',
            }}
        >
            <UpdatesModeHeader
                showSignInPrompt={notSignedIn}
                showSignInWithOrgAccountPrompt={signedInWithArcGISPublicAccount}
                signInButtonOnClick={() => {
                    if (notSignedIn) {
                        signIn();
                    } else {
                        signInUsingDifferentAccount();
                    }
                }}
            />

            <div
                className={classNames({
                    disabled: disabled,
                })}
            >
                <CategoryFilter disabled={disabled} />
                <StatusFilter disabled={disabled} />
                <DateFilter disabled={disabled} />
                <RegionFilter disabled={disabled} />
            </div>
        </div>
    );
};
