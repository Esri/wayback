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

import { useSelector, useDispatch } from 'react-redux';

import {
    isSaveAsWebmapDialogOpenSelector,
    isSaveAsWebmapDialogOpenToggled,
} from '@store/UI/reducer';

import { mapExtentSelector } from '@store/Map/reducer';

import {
    allWaybackItemsSelector,
    releaseNum4SelectedItemsSelector,
} from '@store/Wayback/reducer';

// import { AppContext } from '@contexts/AppContextProvider';

import SaveAsWebMapDialog from './index';
import { IExtentGeomety, IWaybackItem } from '@typings/index';
import {
    getPortalBaseUrl,
    getToken,
    getUserRole,
    isAnonymouns,
    signInUsingDifferentAccount,
} from '@utils/Esri-OAuth';

const SaveAsWebmapDialogContainer = () => {
    const dispatch = useDispatch();

    // const { userSession, oauthUtils } = useContext(AppContext);

    const mapExtent: IExtentGeomety = useSelector(mapExtentSelector);

    const waybackItems: IWaybackItem[] = useSelector(allWaybackItemsSelector);

    const rNum4SelectedWaybackItems: number[] = useSelector(
        releaseNum4SelectedItemsSelector
    );

    const isOpen: boolean = useSelector(isSaveAsWebmapDialogOpenSelector);

    const onCloseHandler = () => {
        dispatch(isSaveAsWebmapDialogOpenToggled());
    };

    // useEffect(() => {
    //     console.log(isOpen);
    // }, [isOpen]);

    return isOpen ? (
        <SaveAsWebMapDialog
            waybackItems={waybackItems}
            rNum4SelectedWaybackItems={rNum4SelectedWaybackItems}
            hasSignedInAlready={isAnonymouns() === false}
            portalBaseURL={getPortalBaseUrl()}
            token={getToken()}
            userRole={getUserRole()}
            mapExtent={mapExtent}
            onClose={onCloseHandler}
            signInButtonOnClick={() => {
                signInUsingDifferentAccount();
            }}
        />
    ) : null;
};

export default SaveAsWebmapDialogContainer;
