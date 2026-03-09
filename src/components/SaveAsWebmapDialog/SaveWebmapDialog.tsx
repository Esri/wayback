import { CalciteButton } from '@esri/calcite-components-react';
import { WaybackItem } from '@esri/wayback-core';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { WebmapLayersList } from './WebmapLayersList';
import { WebmapInputForm } from './WebmapInputForm';

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
    chooseActiveItemOnClick: (releaseNum: number) => void;
    clearAllSelectedItemsOnClick: () => void;
    removeWaybackItemOnClick: (releaseNum: number) => void;
    setActiveWaybackItemOnClick: (releaseNum: number) => void;
    signInUsingDifferentAccountOnClick: () => void;
};
export const SaveWebmapDialog: FC<Props> = ({
    canCreateWebmap,
    activeWaybackItem,
    waybackItemsToSave,
    isCreatingWebmap,
    errorMessage,
    webmapItemId,
    chooseActiveItemOnClick,
    clearAllSelectedItemsOnClick,
    removeWaybackItemOnClick,
    setActiveWaybackItemOnClick,
    signInUsingDifferentAccountOnClick,
}) => {
    const { t } = useTranslation();

    const getContent = () => {
        if (!waybackItemsToSave || waybackItemsToSave.length === 0) {
            return (
                <div className="text-white font-light text-sm bg-white bg-opacity-10 p-2 w-full mb-2">
                    <Trans
                        i18nKey="prompt_to_save_active_wayback_item_as_webmap"
                        values={{
                            waybackReleaseDate:
                                activeWaybackItem?.releaseDateLabel ||
                                'Unknown',
                        }}
                        components={{
                            action: (
                                <button
                                    className="font-semibold underline cursor-pointer text-custom-theme-blue-light"
                                    onClick={chooseActiveItemOnClick.bind(
                                        null,
                                        activeWaybackItem.releaseNum
                                    )}
                                />
                            ),
                        }}
                    />
                </div>
            );
        }

        return (
            <div>
                <WebmapLayersList
                    activeWaybackItem={activeWaybackItem}
                    waybackItemsToSave={waybackItemsToSave}
                    disableRemoveAction={
                        isCreatingWebmap || webmapItemId !== ''
                    }
                    setActiveWaybackItemOnClick={setActiveWaybackItemOnClick}
                    clearAllSelectedItemsOnClick={clearAllSelectedItemsOnClick}
                    removeWaybackItemOnClick={removeWaybackItemOnClick}
                />

                <WebmapInputForm
                    canCreateWebmap={canCreateWebmap}
                    isCreatingWebmap={isCreatingWebmap}
                    errorMessage={errorMessage}
                    saveButtonOnClick={({ title, tags, description }) => {
                        console.log('Save button clicked with values:', {
                            title,
                            tags,
                            description,
                        });
                        // Implement the logic to save the webmap using the provided values
                    }}
                    signInUsingDifferentAccountOnClick={
                        signInUsingDifferentAccountOnClick
                    }
                />
            </div>
        );
    };

    return <div className="py-1 px-1 w-full mb-2">{getContent()}</div>;
};
