import { HYBRID_REFERENCE_LAYERS } from '@constants/map';
import {
    referenceLayerLocaleUpdated,
    selectReferenceLayerLocale,
} from '@store/Map/reducer';
import { updateReferenceLayerLocale } from '@store/Map/thunks';
// import { setPreferredReferenceLayerLocale } from '@utils/LocalStorage';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const LocaleSwitch = () => {
    const dispatch = useDispatch();

    const selectedLocale = useSelector(selectReferenceLayerLocale);

    // useEffect(() => {
    //     setPreferredReferenceLayerLocale(selectedLocale);
    // }, [selectedLocale]);

    return (
        <div className="absolute w-full top-full px-2 text-sm bg-custom-background text-custom-foreground overflow-y-auto fancy-scrollbar max-h-[420px]">
            {HYBRID_REFERENCE_LAYERS.map((layer, index) => {
                const isSelected = layer.language === selectedLocale;

                return (
                    <div
                        key={layer.id}
                        className="flex items-center my-2 text-xs bg-custom-list-card-background cursor-pointer p-1"
                        onClick={() => {
                            dispatch(
                                updateReferenceLayerLocale(layer.language)
                            );
                        }}
                    >
                        {isSelected ? (
                            <calcite-icon
                                icon="circle-f"
                                scale="s"
                            ></calcite-icon>
                        ) : (
                            <calcite-icon
                                icon="circle"
                                scale="s"
                            ></calcite-icon>
                        )}
                        <span className="ml-2 mt-[2px]">{layer.language}</span>
                    </div>
                );
            })}
        </div>
    );
};
