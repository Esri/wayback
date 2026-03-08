import React, { FC, useState } from 'react';
import config from './config';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
    CalciteButton,
    CalciteInputText,
    CalciteTextArea,
} from '@esri/calcite-components-react';

type Props = {
    isCreatingWebmap: boolean;
    disabled?: boolean;
    saveButtonOnClick: ({
        title,
        tags,
        description,
    }: {
        title: string;
        tags?: string;
        description?: string;
    }) => void;
};

export const WebmapInputForm: FC<Props> = ({
    isCreatingWebmap,
    disabled = false,
    saveButtonOnClick,
}) => {
    const { t } = useTranslation();

    const [title, setTitle] = useState(config.title);
    const [tags, setTags] = useState(config.tags);
    const [description, setDescription] = useState(config.description);

    const shouldDisableInputFields = isCreatingWebmap || disabled;

    return (
        <div className="mt-4">
            <div className="w-full mb-2">
                <h5>{t('webmap_title_label')}</h5>
                <CalciteInputText
                    // type="text"
                    placeholder={t('webmap_title_placeholder')}
                    spellCheck="false"
                    // className={classNames('w-full outline-none p-1', {
                    //     outline: !title,
                    //     'outline-red-400': !title,
                    // })}
                    status={title ? 'valid' : 'invalid'}
                    value={title}
                    // onChange={(e) => setTitle(e.target.value)}
                    onCalciteInputTextInput={(e) => {
                        const val = e.target.value;
                        setTitle(val);
                    }}
                    required={true}
                    disabled={shouldDisableInputFields}
                    data-testid="webmap-title-input"
                />
            </div>

            <div className="w-full mb-2">
                <h5>{t('webmap_tags_label')}</h5>
                <CalciteInputText
                    // type="text"
                    className="w-full outline-none p-1"
                    spellCheck="false"
                    placeholder={t('webmap_tags_placeholder')}
                    value={tags}
                    // onChange={(e) => setTags(e.target.value)}
                    onCalciteInputTextInput={(e) => {
                        const val = e.target.value;
                        setTags(val);
                    }}
                    disabled={shouldDisableInputFields}
                />
            </div>

            <div className="w-full mb-2">
                <h5>{t('webmap_description_label')}</h5>
                <CalciteTextArea
                    className="w-full outline-none p-1"
                    spellCheck="false"
                    value={description}
                    // onChange={(e) => setDescription(e.target.value)}
                    onCalciteTextAreaInput={(e) => {
                        const val = e.target.value;
                        setDescription(val);
                    }}
                    disabled={shouldDisableInputFields}
                ></CalciteTextArea>
            </div>

            <CalciteButton
                onClick={() => saveButtonOnClick({ title, tags, description })}
                loading={isCreatingWebmap}
                width={'full'}
                disabled={!title || isCreatingWebmap || disabled}
                label={
                    isCreatingWebmap
                        ? t('creating_wayback_map')
                        : t('create_wayback_map')
                }
                data-testid="create-wayback-webmap-button"
            >
                {isCreatingWebmap
                    ? t('creating_wayback_map')
                    : t('create_wayback_map')}
            </CalciteButton>
        </div>
    );
};
