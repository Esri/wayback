/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import config from './config';

import { IWaybackItem, IExtentGeomety } from '@typings/index';
import createWebmap from './createWebmap';
import { useAppSelector } from '@store/configureStore';
import { useSelecteReferenceLayer } from '@components/ReferenceLayer/useSelectedReferenceLayer';
import { CalciteButton } from '@esri/calcite-components-react';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';

interface IProps {
    // isVisible?: boolean;
    waybackItems: Array<IWaybackItem>;
    rNum4SelectedWaybackItems: Array<number>;
    /**
     * if ture, user has signed in alredy
     */
    hasSignedInAlready: boolean;
    /**
     * privileges of signed in user
     */
    portalUser: __esri.PortalUser;
    /**
     * access token of signe in user
     */
    token: string;
    /** base url of the portal */
    portalBaseURL: string;
    mapExtent: IExtentGeomety;
    /**
     * if true, the dialog is disabled (user not signed in or no privilege to create content)
     */
    disabled?: boolean;
    /**
     * if true, the user is not signed in and should be prompted to sign in
     */
    promptToSignIn?: boolean;

    // onClose: (val: boolean) => void;
    signInButtonOnClick: () => void;
}

export const SaveAsWebmapDialog: React.FC<IProps> = (props) => {
    const { t } = useTranslation();

    const [title, setTitle] = useState(config.title);
    const [tags, setTags] = useState(config.tags);
    const [description, setDescription] = useState(config.description);
    const [isCreatingWebmap, setIsCreatingWebmap] = useState(false);
    const [isWebmapReady, setIsWebmapReady] = useState(false);
    const [webmapId, setWebmapId] = useState('');
    const [isRequiredFieldMissing, setIsRequiredFieldMissing] = useState(false);

    const checkIsRequiredFieldMissing = useCallback(() => {
        setIsRequiredFieldMissing(!title);
    }, [title]);

    const selectedReferenceLayer = useSelecteReferenceLayer();

    useEffect(() => {
        checkIsRequiredFieldMissing();
    }, [title, checkIsRequiredFieldMissing]);

    useEffect(() => {
        if (
            props.rNum4SelectedWaybackItems !== props.rNum4SelectedWaybackItems
        ) {
            setWebmapId('');
        }
    }, [props.rNum4SelectedWaybackItems]);

    const saveAsWebmap = async () => {
        const { waybackItems, rNum4SelectedWaybackItems, mapExtent } = props;

        const waybackItemsToSave = waybackItems.filter((d) => {
            return rNum4SelectedWaybackItems.indexOf(d.releaseNum) > -1;
        });

        try {
            setIsCreatingWebmap(true);

            const createWebmapResponse = await createWebmap({
                title,
                tags,
                description,
                mapExtent,
                waybackItemsToSave,
                referenceLayer: selectedReferenceLayer,
            });

            if (createWebmapResponse.id) {
                setWebmapId(createWebmapResponse.id);
                setIsWebmapReady(true);
            }
        } catch (err) {
            console.error(err);
        }

        setIsCreatingWebmap(false);
    };

    const openWebmap = () => {
        const { hasSignedInAlready, portalBaseURL } = props;

        const itemUrl =
            hasSignedInAlready && webmapId
                ? `${portalBaseURL}/home/item.html?id=${webmapId}`
                : null;

        if (itemUrl) {
            window.open(itemUrl, '_blank');
        }
    };

    const getEditDialog = () => {
        // const creatingIndicator = isCreatingWebmap ? (
        //     <span className="text-sm mr-1 web-map-on-creating-indicator">
        //         Creating Web Map...
        //     </span>
        // ) : null;

        // const creatWebMapBtnClasses = classnames({
        //     disabled: isRequiredFieldMissing || isCreatingWebmap || props.disabled,
        // });

        const creatWebMapBtn = (
            <CalciteButton
                onClick={saveAsWebmap}
                loading={isCreatingWebmap}
                disabled={
                    isRequiredFieldMissing || isCreatingWebmap || props.disabled
                }
                label={
                    isCreatingWebmap
                        ? t('creating_wayback_map')
                        : t('create_wayback_map')
                }
            >
                {isCreatingWebmap
                    ? t('creating_wayback_map')
                    : t('create_wayback_map')}
            </CalciteButton>
        );

        return (
            <div className={classNames('w-full', { disabled: props.disabled })}>
                {/* <h5 className="text-xl mb-4">Wayback Map Settings:</h5> */}

                <div className="w-full mb-2">
                    <h5>{t('webmap_title_label')}</h5>
                    <input
                        type="text"
                        placeholder={t('webmap_title_placeholder')}
                        spellCheck="false"
                        className={classnames('w-full outline-none p-1', {
                            outline: !title,
                            'outline-red-400': !title,
                        })}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required={true}
                        disabled={isCreatingWebmap}
                    />
                </div>

                <div className="w-full mb-2">
                    <h5>{t('webmap_tags_label')}</h5>
                    <input
                        type="text"
                        className="w-full outline-none p-1"
                        spellCheck="false"
                        placeholder={t('webmap_tags_placeholder')}
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        disabled={isCreatingWebmap}
                    />
                </div>

                <div className="w-full mb-2">
                    <h5>{t('webmap_description_label')}</h5>
                    <textarea
                        className="w-full outline-none p-1"
                        spellCheck="false"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isCreatingWebmap}
                    ></textarea>
                </div>

                <div className="mt-4 text-right w-full">
                    {/* {creatingIndicator} */}
                    {creatWebMapBtn}
                </div>
            </div>
        );
    };

    const getOpenWebmapContent = () => (
        <div className="w-full">
            <p className="message-webamap-is-ready mb-4">
                {t('webmap_ready_message')}
            </p>
            <div onClick={openWebmap}>
                <CalciteButton width="full">
                    {t('open_wayback_map')}
                </CalciteButton>
            </div>
        </div>
    );

    const getWarningMessage4OrgUser = () => (
        <div>
            <p className="mb-2">{t('no_privilege_message')}</p>
            <p>
                <Trans
                    i18nKey="sign_in_again_prompt"
                    components={{
                        action: (
                            <button
                                className="text-custom-theme-blue-light  cursor-pointer"
                                onClick={props.signInButtonOnClick}
                                aria-label={t('sign_in')}
                            />
                        ),
                    }}
                />
            </p>
        </div>
    );

    const { portalUser } = props;
    const { role, privileges, orgId } = portalUser || {};
    // const hasNoPrivilege2CreateContent = userRole === 'org_user';

    // Determine if the user has privileges to create a web map
    // Org admins and publishers can create content by default
    // Other roles need to have 'createItem' privilege
    // Public accounts (orgId is null) can also create web map (https://doc.arcgis.com/en/arcgis-online/reference/faq.htm#anchor34)
    const canCreateWebmap =
        role === 'org_admin' ||
        role === 'org_publisher' ||
        (privileges && privileges.some((p) => p.endsWith('createItem'))) ||
        orgId === null ||
        orgId === undefined; // for public account, orgId is null

    if (!canCreateWebmap) {
        return <div className="w-96">{getWarningMessage4OrgUser()}</div>;
    }

    return (
        <div className={classnames('w-96 p-1')}>
            {props.promptToSignIn && (
                <p className="mb-4">
                    <Trans
                        i18nKey="sign_in_prompt_save_webmap_panel"
                        components={{
                            action: (
                                <button
                                    className="font-semibold underline cursor-pointer text-custom-theme-blue-light"
                                    aria-label={t('sign_in')}
                                    onClick={() => {
                                        if (props.signInButtonOnClick) {
                                            props.signInButtonOnClick();
                                        }
                                    }}
                                />
                            ),
                        }}
                    />
                </p>
            )}
            {isWebmapReady ? getOpenWebmapContent() : getEditDialog()}
        </div>
    );
};

// export default SaveAsWebmapDialog;
