import React, { FC } from 'react';
import {
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
        <div className="flex items-center bg-black bg-opacity-75 text-white pointer-events-auto p-2 text-sm ">
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
                            ReferenceLayerLanguage.English
                        )
                    );
                }}
            />
        </div>
    );
};
