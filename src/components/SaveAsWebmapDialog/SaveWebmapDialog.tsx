import { CalciteButton } from '@esri/calcite-components-react';
import { WaybackItem } from '@esri/wayback-core';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { WebmapLayersList } from './WebmapLayersList';
import { WebmapInputForm } from './WebmapInputForm';
import { OpenSavedWebmap } from './OpenSavedWebmap';
import classNames from 'classnames';

type Props = {
    /**
     * Whether the user has permissions to create a webmap or not. This is determined by checking the user's portal privileges.
     */
    canCreateWebmap: boolean;
    activeWaybackItem: WaybackItem;
    waybackItemsToSave: WaybackItem[];
    /**
     * If true, it is in the process of saving a webmap, and the input form will be disabled and show loading state
     */
    isCreatingWebmap: boolean;
    /**
     * Error message to display if saving webmap failed. If it is an empty string, no error message will be displayed.
     */
    errorMessage: string;
    /**
     * ID of the created webmap item, used to display link to the created webmap after saving successfully
     */
    webmapItemId: string;
    /**
     * If true, the user is not signed in, and the panel will be disabled with a prompt to sign in to save the webmap. Otherwise, it will show the content of the panel.
     */
    notSignedIn: boolean;
    // /**
    //  * Emits when user choose the active wayback item to save as webmap. The release number of the chosen wayback item is passed as parameter.
    //  * @param releaseNum
    //  * @returns
    //  */
    // chooseActiveItemOnClick: (releaseNum: number) => void;
    openExploreModeOnClick: () => void;
    /**
     * Emits when user clicks the button to clear all selected wayback items. This will unselect all wayback items and reset the dialog to initial state.
     * @returns
     */
    clearAllSelectedItemsOnClick: () => void;
    /**
     * Emits when user clicks the button to remove a wayback item from the list of items to save. The release number of the wayback item to remove is passed as parameter.
     * @param releaseNum
     * @returns
     */
    removeWaybackItemOnClick: (releaseNum: number) => void;
    /**
     * Emits when user clicks the button to set a wayback item as the active item. The release number of the wayback item is passed as parameter.
     * @param releaseNum
     * @returns
     */
    setActiveWaybackItemOnClick: (releaseNum: number) => void;
    /**
     * Emits when user clicks the button to sign in using a different account. This will trigger the sign in process and refresh the dialog after successful sign in.
     * @returns
     */
    signInUsingDifferentAccountOnClick: () => void;
    /**
     * Emits when user clicks the button to save the webmap. The title, tags and description input by user in the form are passed as parameters.
     * @param params
     * @returns
     */
    saveButtonOnClick: (params: {
        title: string;
        tags: string;
        snippet: string;
    }) => void;
};
export const SaveWebmapDialog: FC<Props> = ({
    canCreateWebmap,
    activeWaybackItem,
    waybackItemsToSave,
    isCreatingWebmap,
    errorMessage,
    webmapItemId,
    notSignedIn,
    openExploreModeOnClick,
    // chooseActiveItemOnClick,
    clearAllSelectedItemsOnClick,
    removeWaybackItemOnClick,
    setActiveWaybackItemOnClick,
    signInUsingDifferentAccountOnClick,
    saveButtonOnClick,
}) => {
    // const { t } = useTranslation();

    const getContent = () => {
        // If webmap is saved successfully, show the link to the created webmap item
        if (webmapItemId) {
            return (
                <OpenSavedWebmap
                    itemId={webmapItemId}
                    onWebmapOpened={clearAllSelectedItemsOnClick}
                />
            );
        }

        // If there is at least one wayback item selected to save, show the input form to create webmap with the selected wayback items
        // If user is not signed in, just disable the input form to provider user an hint that they need to sign in to enable the form
        if (waybackItemsToSave && waybackItemsToSave.length > 0) {
            // If there is at least one wayback item selected to save, show the input form to create webmap with the selected wayback items
            return (
                <div
                    className={classNames({
                        disabled: notSignedIn,
                    })}
                >
                    <WebmapLayersList
                        activeWaybackItem={activeWaybackItem}
                        waybackItemsToSave={waybackItemsToSave}
                        disableRemoveAction={
                            isCreatingWebmap || webmapItemId !== ''
                        }
                        setActiveWaybackItemOnClick={
                            setActiveWaybackItemOnClick
                        }
                        clearAllSelectedItemsOnClick={
                            clearAllSelectedItemsOnClick
                        }
                        removeWaybackItemOnClick={removeWaybackItemOnClick}
                    />

                    <WebmapInputForm
                        canCreateWebmap={canCreateWebmap}
                        notSignedIn={notSignedIn}
                        isCreatingWebmap={isCreatingWebmap}
                        errorMessage={errorMessage}
                        waybackItemsToSave={waybackItemsToSave}
                        saveButtonOnClick={({ title, tags, snippet }) => {
                            // console.log('Save button clicked with values:', {
                            //     title,
                            //     tags,
                            //     description,
                            // });
                            saveButtonOnClick({ title, tags, snippet });
                        }}
                        signInUsingDifferentAccountOnClick={
                            signInUsingDifferentAccountOnClick
                        }
                    />
                </div>
            );
        }

        // If signed in but no wayback item is selected to save, show the prompt to select wayback items to save as webmap
        if (notSignedIn === false) {
            return (
                <div className="text-white font-light text-sm w-full mb-2">
                    <Trans
                        i18nKey="prompt_to_select_wayback_item_to_save_as_webmap"
                        // values={{
                        //     waybackReleaseDate:
                        //         activeWaybackItem?.releaseDateLabel ||
                        //         'Unknown',
                        // }}
                        components={{
                            action: (
                                <button
                                    className="font-semibold underline cursor-pointer text-custom-theme-blue-light"
                                    // onClick={chooseActiveItemOnClick.bind(
                                    //     null,
                                    //     activeWaybackItem.releaseNum
                                    // )}
                                    onClick={openExploreModeOnClick}
                                />
                            ),
                        }}
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <div className={classNames('py-1 px-1 w-full mb-2')}>
            {getContent()}
        </div>
    );
};
