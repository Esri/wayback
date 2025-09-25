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

import React, { useContext } from 'react';

import { useAppDispatch, useAppSelector } from '@store/configureStore';

import {
    activeDialogUpdated,
    isSettingModalOpenSelector,
    // isSettingModalOpenToggled,
    // shouldOnlyShowItemsWithLocalChangeToggled,
} from '@store/UI/reducer';

import { mapExtentSelector } from '@store/Map/reducer';

// import { AppContext } from '@contexts/AppContextProvider';
import {
    getSignedInUser,
    isAnonymouns,
    signIn,
    signOut,
} from '@utils/Esri-OAuth';
import SettingDialogContent from './SettingDialogContent';
import { Modal } from '@components/Modal/Modal';

const SettingDialogContainer = () => {
    const dispatch = useAppDispatch();

    // const { userSession, oauthUtils } = useContext(AppContext);

    const mapExtent = useAppSelector(mapExtentSelector);

    const isOpen = useAppSelector(isSettingModalOpenSelector);

    const user = getSignedInUser();

    const onCloseHandler = () => {
        dispatch(activeDialogUpdated());
    };

    const toggleSignInBtnOnClick = (shouldSignIn?: boolean) => {
        if (shouldSignIn) {
            signIn();
        } else {
            signOut();
        }
    };

    // const shouldShowLocalChangesByDefaultOnClick = (val: boolean) => {
    //     dispatch(shouldOnlyShowItemsWithLocalChangeToggled(val));
    // };

    // return isOpen ? (
    //     <SetttingDialog
    //         mapExtent={mapExtent}
    //         signedInAlready={isAnonymouns() === false}
    //         toggleSignInBtnOnClick={toggleSignInBtnOnClick}
    //         // shouldShowLocalChangesByDefaultOnClick={
    //         //     shouldShowLocalChangesByDefaultOnClick
    //         // }
    //         onClose={onCloseHandler}
    //     />
    // ) : null;

    return (
        <Modal isOpen={isOpen} width="m" onClose={onCloseHandler}>
            <SettingDialogContent
                mapExtent={mapExtent}
                signedInUser={user}
                signedInAlready={isAnonymouns() === false}
                toggleSignInBtnOnClick={toggleSignInBtnOnClick}
            />
        </Modal>
    );
};

export default SettingDialogContainer;
