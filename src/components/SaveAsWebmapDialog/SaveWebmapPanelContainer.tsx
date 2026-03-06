import React, { useContext, useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@store/configureStore';

import {
    mapExtentSelector,
    selectIsSaveWebmapModeOn,
} from '@store/Map/reducer';

import {
    activeWaybackItemSelector,
    allWaybackItemsSelector,
    releaseNum4SelectedItemsCleaned,
    releaseNum4SelectedItemsSelector,
    toggleSelectWaybackItem,
} from '@store/Wayback/reducer';

// import { AppContext } from '@contexts/AppContextProvider';

import { SaveAsWebmapDialog } from './SaveAsWebmapDialog';
import { IExtentGeomety, IWaybackItem } from '@typings/index';
import {
    getPortalBaseUrl,
    getSignedInUser,
    getToken,
    // getUserRole,
    isAnonymouns,
    signIn,
    signInUsingDifferentAccount,
} from '@utils/Esri-OAuth';
import { Modal } from '@components/Modal/Modal';
import { useTranslation } from 'react-i18next';
import { PromptToSignIn } from './PromptToSignIn';
import { SaveWebmapDialog } from './SaveWebmapDialog';

export const SaveWebmapPanelContainer = () => {
    const dispatch = useAppDispatch();

    const activeWaybackItem: IWaybackItem = useAppSelector(
        activeWaybackItemSelector
    );

    const mapExtent: IExtentGeomety = useAppSelector(mapExtentSelector);

    const waybackItems: IWaybackItem[] = useAppSelector(
        allWaybackItemsSelector
    );

    const rNum4SelectedWaybackItems: number[] = useAppSelector(
        releaseNum4SelectedItemsSelector
    );

    const waybackItemsToSave = useMemo(() => {
        if (!waybackItems || !rNum4SelectedWaybackItems) {
            return [];
        }

        if (
            waybackItems.length === 0 ||
            rNum4SelectedWaybackItems.length === 0
        ) {
            return [];
        }

        return waybackItems.filter((item) =>
            rNum4SelectedWaybackItems.includes(item.releaseNum)
        );
    }, [waybackItems, rNum4SelectedWaybackItems]);

    // const portalUser = getSignedInUser();

    const notSignedIn = React.useMemo(() => isAnonymouns(), []);

    const getContent = () => {
        if (notSignedIn) {
            return (
                <PromptToSignIn
                    promptToSignIn={notSignedIn}
                    signInButtonOnClick={() => {
                        signIn();
                    }}
                />
            );
        }

        return (
            <SaveWebmapDialog
                activeWaybackItem={activeWaybackItem}
                waybackItemsToSave={waybackItemsToSave}
                chooseActiveItemOnClick={(releaseNum) => {
                    dispatch(toggleSelectWaybackItem(releaseNum));
                }}
                clearAllSelectedItemsOnClick={() => {
                    dispatch(releaseNum4SelectedItemsCleaned());
                }}
            />
        );
    };

    return (
        <div
            className="p-2 pb-4 flex flex-col gap-1 overflow-y-auto fancy-scrollbar text-sm"
            style={{
                maxHeight: 'calc(100vh - 60px)',
                '--calcite-button-text-color': '#fff',
            }}
        >
            {getContent()}
        </div>
    );
};
