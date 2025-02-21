import React, { FC } from 'react';
import {
    isReferenceLayerSwitcherOpenToggled,
    referenceLayerLocaleUpdated,
    selectSuggestedReferenceLayerLocale,
} from '@store/Map/reducer';
import { updateReferenceLayerLocale } from '@store/Map/thunks';
import { ReferenceLayerLanguage } from '@constants/map';
import { useAppDispatch, useAppSelector } from '@store/configureStore';

export const NotificationSetReferenceLayerLocale: FC = () => {
    const dispatch = useAppDispatch();

    const suggestedReferenceLayerLocale = useAppSelector(
        selectSuggestedReferenceLayerLocale
    );

    if (!suggestedReferenceLayerLocale) {
        return null;
    }

    return (
        <div className="flex items-center bg-black md:bg-opacity-85 text-white pointer-events-auto p-2 md:text-sm ">
            <p>
                You can set your reference layer language to{' '}
                <span
                    className="cursor-pointer underline"
                    onClick={() => {
                        dispatch(
                            updateReferenceLayerLocale(
                                suggestedReferenceLayerLocale
                            )
                        );

                        dispatch(isReferenceLayerSwitcherOpenToggled(true));
                    }}
                >
                    {suggestedReferenceLayerLocale}
                </span>
                .
            </p>

            <calcite-button
                icon-start="x"
                appearance="transparent"
                kind="neutral"
                onClick={() => {
                    // Set the reference layer locale to English when the close button is clicked to mute this notification.
                    dispatch(
                        updateReferenceLayerLocale(
                            ReferenceLayerLanguage.EnglishUS
                        )
                    );
                }}
            />
        </div>
    );
};
