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
    setActiveWaybackItem,
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

    const portalUser = getSignedInUser();

    const notSignedIn = React.useMemo(() => isAnonymouns(), []);

    // Determine if the user has privileges to create a web map
    // Org admins and publishers can create content by default
    // Other roles need to have 'createItem' privilege
    // Public accounts (orgId is null) can also create web map (https://doc.arcgis.com/en/arcgis-online/reference/faq.htm#anchor34)
    const canCreateWebmap = useMemo(() => {
        if (notSignedIn) {
            return false;
        }

        const { role, privileges, orgId } = portalUser || {};

        return (
            role === 'org_admin' ||
            role === 'org_publisher' ||
            (privileges && privileges.some((p) => p.endsWith('createItem'))) ||
            orgId === null ||
            orgId === undefined
        ); // for public account, orgId is null
    }, [notSignedIn, portalUser]);

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
                canCreateWebmap={canCreateWebmap}
                activeWaybackItem={activeWaybackItem}
                waybackItemsToSave={waybackItemsToSave}
                chooseActiveItemOnClick={(releaseNum) => {
                    dispatch(toggleSelectWaybackItem(releaseNum));
                }}
                clearAllSelectedItemsOnClick={() => {
                    dispatch(releaseNum4SelectedItemsCleaned());
                }}
                removeWaybackItemOnClick={(releaseNum) => {
                    dispatch(toggleSelectWaybackItem(releaseNum));
                }}
                setActiveWaybackItemOnClick={(releaseNum) => {
                    dispatch(setActiveWaybackItem(releaseNum));
                }}
                signInUsingDifferentAccountOnClick={() => {
                    signInUsingDifferentAccount();
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
