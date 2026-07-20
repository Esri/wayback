import { useAppDispatch } from '@store/configureStore';
import { updateShouldUseHybridReferenceLayer } from '@store/Map/thunks';
import React, { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';

type ReferenceLayerSettingProps = {
    shouldUseHybridReferenceLayer: boolean;
};

type ReferenceLayerOption = 'hybrid' | 'app-language';

type ReferenceLayerOptionData = {
    value: ReferenceLayerOption;
    label: string;
    selected: boolean;
};

export const ReferenceLayerSetting: FC<ReferenceLayerSettingProps> = ({
    shouldUseHybridReferenceLayer,
}) => {
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    const radioButtonOptions: ReferenceLayerOptionData[] = useMemo(() => {
        return [
            {
                value: 'app-language',
                label: t('reference_layer_app_language'),
                selected: !shouldUseHybridReferenceLayer,
            },
            {
                value: 'hybrid',
                label: t('hybrid_reference_layer'),
                selected: shouldUseHybridReferenceLayer,
            },
        ];
    }, [shouldUseHybridReferenceLayer]);

    return (
        <div className="absolute w-full top-full p-2 text-sm bg-custom-background text-custom-foreground ">
            <calcite-radio-button-group
                name="reference-layer-setting-group"
                // label="Reference Layer Setting"
                layout="vertical"
                scale="s"
                oncalciteRadioButtonGroupChange={(event) => {
                    const selectedItem = event.target.selectedItem;

                    if (!selectedItem) {
                        // console.error('No selected item found in the radio button group.');
                        return;
                    }

                    const selectedValue =
                        selectedItem.value as ReferenceLayerOption;
                    // console.log('Selected Reference Layer Option:', selectedValue);
                    // Here you can dispatch an action or update state based on the selected value

                    const shouldUseHybrid = selectedValue === 'hybrid';

                    dispatch(
                        updateShouldUseHybridReferenceLayer(shouldUseHybrid)
                    );
                }}
            >
                {radioButtonOptions.map((option) => (
                    <calcite-radio-button
                        className="mb-1"
                        key={option.value}
                        value={option.value}
                        label-text={option.label}
                        checked={option.selected}
                    />
                ))}
            </calcite-radio-button-group>
        </div>
    );
};
