import React, { useContext } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import SetttingDialog from './index';

import {
    isSettingModalOpenSelector,
    isSettingModalOpenToggled,
    shouldOnlyShowItemsWithLocalChangeToggled,
} from '../../store/reducers/UI';

import { mapExtentSelector } from '../../store/reducers/Map';

import { AppContext } from '../../contexts/AppContextProvider';

const SettingDialogContainer = () => {
    const dispatch = useDispatch();

    const { userSession, oauthUtils } = useContext(AppContext);

    const mapExtent = useSelector(mapExtentSelector);

    const isOpen = useSelector(isSettingModalOpenSelector);

    const onCloseHandler = () => {
        dispatch(isSettingModalOpenToggled());
    };

    const toggleSignInBtnOnClick = (shouldSignIn?: boolean) => {
        if (shouldSignIn) {
            oauthUtils.signIn();
        } else {
            oauthUtils.signOut();
        }
    };

    const shouldShowLocalChangesByDefaultOnClick = (val: boolean) => {
        dispatch(shouldOnlyShowItemsWithLocalChangeToggled(val));
    };

    return isOpen ? (
        <SetttingDialog
            mapExtent={mapExtent}
            userSession={userSession}
            toggleSignInBtnOnClick={toggleSignInBtnOnClick}
            shouldShowLocalChangesByDefaultOnClick={
                shouldShowLocalChangesByDefaultOnClick
            }
            onClose={onCloseHandler}
        />
    ) : null;
};

export default SettingDialogContainer;
