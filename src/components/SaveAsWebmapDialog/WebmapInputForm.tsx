import React, { FC, use, useEffect, useState } from 'react';
import config from './config';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
    CalciteButton,
    CalciteIcon,
    CalciteInputText,
    CalciteTextArea,
} from '@esri/calcite-components-react';
import { WaybackItem } from '@esri/wayback-core';
import { getSnippetStr } from './createWebmap';

type Props = {
    isCreatingWebmap: boolean;
    canCreateWebmap: boolean;
    notSignedIn: boolean;
    errorMessage: string;
    waybackItemsToSave: WaybackItem[];
    saveButtonOnClick: ({
        title,
        tags,
        snippet,
    }: {
        title: string;
        tags: string;
        snippet: string;
    }) => void;
    signInUsingDifferentAccountOnClick: () => void;
};

export const WebmapInputForm: FC<Props> = ({
    isCreatingWebmap,
    canCreateWebmap,
    notSignedIn,
    errorMessage,
    waybackItemsToSave,
    saveButtonOnClick,
    signInUsingDifferentAccountOnClick,
}) => {
    const { t } = useTranslation();

    const [title, setTitle] = useState(config.title);
    const [tags, setTags] = useState(config.tags);
    // const [description, setDescription] = useState(config.description);
    const [snippet, setSnippet] = useState('');

    const shouldDisableInputFields =
        isCreatingWebmap || canCreateWebmap === false || notSignedIn;

    const shouldDisableSaveButton =
        !title ||
        !snippet ||
        isCreatingWebmap ||
        canCreateWebmap === false ||
        notSignedIn;

    useEffect(() => {
        const snippet = getSnippetStr(waybackItemsToSave);
        setSnippet(snippet);
    }, [waybackItemsToSave]);

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
                <h5>{t('webmap_snippet_label')}</h5>
                <CalciteInputText
                    placeholder={t('webmap_snippet_placeholder')}
                    spellCheck="false"
                    // className={classNames('w-full outline-none p-1', {
                    //     outline: !title,
                    //     'outline-red-400': !title,
                    // })}
                    status={snippet ? 'valid' : 'invalid'}
                    // spellCheck="false"
                    value={snippet}
                    // onChange={(e) => setDescription(e.target.value)}
                    onCalciteInputTextInput={(e) => {
                        const val = e.target.value;
                        setSnippet(val);
                    }}
                    disabled={shouldDisableInputFields}
                ></CalciteInputText>
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

            <CalciteButton
                onClick={() => saveButtonOnClick({ title, tags, snippet })}
                loading={isCreatingWebmap}
                width={'full'}
                disabled={shouldDisableSaveButton}
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

            {notSignedIn === false && !canCreateWebmap && (
                <div className="mt-2 text-sm">
                    <p className="mb-2">{t('no_privilege_message')}</p>
                    <p>
                        <Trans
                            i18nKey="sign_in_again_prompt"
                            components={{
                                action: (
                                    <button
                                        className="text-custom-theme-blue-light  cursor-pointer font-bold underline"
                                        onClick={
                                            signInUsingDifferentAccountOnClick
                                        }
                                        aria-label={t('sign_in')}
                                    />
                                ),
                            }}
                        />
                    </p>
                </div>
            )}

            {errorMessage && (
                <div className="text-red-500 font-light text-sm bg-red-600 bg-opacity-10 p-2 w-full mt-4">
                    <p>
                        {t('save_webmap_failed_message', {
                            errorMessage,
                        })}
                    </p>
                </div>
            )}
        </div>
    );
};
