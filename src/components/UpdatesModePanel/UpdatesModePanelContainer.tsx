/* Copyright 2024 Esri
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

import React, { useContext, useEffect } from 'react';
import { UpdatesModeHeader } from './UpdatesModeHeader';
// import { StatusFilter } from './Filters/StatusFilter';
import { CategoryFilter } from './Filters/CategoryFilter';
import { DateFilter } from './Filters/DateFilter';
import { RegionFilter } from './Filters/RegionFilter';
import { signIn, signInUsingDifferentAccount } from '@utils/Esri-OAuth';
import classNames from 'classnames';
import { AppContext } from '@contexts/AppContextProvider';
import { SummaryInfo } from './Filters/SummaryInfo';

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
                data-testid="updates-mode-filters-container"
            >
                <SummaryInfo />
                <CategoryFilter disabled={disabled} />
                {/* <StatusFilter disabled={disabled} /> */}
                <DateFilter disabled={disabled} />
                <RegionFilter disabled={disabled} />
            </div>
        </div>
    );
};
