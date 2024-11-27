import React, { FC } from 'react';
import {
    referenceLayerLocaleUpdated,
    selectSuggestedReferenceLayerLocale,
} from '@store/Map/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { updateReferenceLayerLocale } from '@store/Map/thunks';

export const NotificationSetReferenceLayerLocale: FC = () => {
    const dispatch = useDispatch();

    const suggestedReferenceLayerLocale = useSelector(
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

            <calcite-icon icon="x" />
        </div>
    );
};
