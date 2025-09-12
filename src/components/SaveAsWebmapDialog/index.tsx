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
    portalBaseURL: string;
    mapExtent: IExtentGeomety;

    // onClose: (val: boolean) => void;
    signInButtonOnClick: () => void;
}

const SaveAsWebmapDialog: React.FC<IProps> = (props) => {
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
        const creatingIndicator = isCreatingWebmap ? (
            <span className="text-sm mr-1 web-map-on-creating-indicator">
                Creating Web Map...
            </span>
        ) : null;

        const creatWebMapBtnClasses = classnames({
            disabled: isRequiredFieldMissing,
        });

        const creatWebMapBtn = !isCreatingWebmap ? (
            <div className={creatWebMapBtnClasses}>
                <CalciteButton onClick={saveAsWebmap}>
                    Create Wayback Map
                </CalciteButton>
            </div>
        ) : null;

        return (
            <div className="dialog-content">
                <h5 className="text-xl mb-4">Wayback Map Settings:</h5>

                <div className="w-full mb-2">
                    <h5>Title</h5>
                    <input
                        type="text"
                        placeholder="Tilte is required"
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
                    <h5>Tags</h5>
                    <input
                        type="text"
                        className="w-full outline-none p-1"
                        spellCheck="false"
                        placeholder="tags are optional"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        disabled={isCreatingWebmap}
                    />
                </div>

                <div className="w-full mb-2">
                    <h5>Description: (Optional)</h5>
                    <textarea
                        className="w-full outline-none p-1"
                        spellCheck="false"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isCreatingWebmap}
                    ></textarea>
                </div>

                <div className="mt-4 text-right w-full">
                    {creatingIndicator}
                    {creatWebMapBtn}
                </div>
            </div>
        );
    };

    const getOpenWebmapContent = () => (
        <div className="w-full">
            <p className="message-webamap-is-ready mb-4">
                Your Wayback Map is ready!
            </p>
            <div onClick={openWebmap}>
                <CalciteButton width="full">Open Wayback Map</CalciteButton>
            </div>
        </div>
    );

    const getWarningMessage4OrgUser = () => (
        <div>
            <p>
                You signed in using a account that does not have privilege to
                create content in your ArcGIS Online organization.
            </p>
            <p>
                Please{' '}
                <span
                    className=" text-custom-theme-blue-brand cursor-pointer"
                    onClick={props.signInButtonOnClick}
                >
                    sign in
                </span>{' '}
                again using a different account.
            </p>
        </div>
    );

    const { portalUser } = props;
    const { role, privileges } = portalUser || {};
    // const hasNoPrivilege2CreateContent = userRole === 'org_user';

    // determine if user can create webmap, check the role first, in case this user has custome role,
    // then check the privileges to see if user has privilige to create content
    const canCreateWebmap =
        role === 'org_admin' ||
        role === 'org_publisher' ||
        (privileges && privileges.some((p) => p.endsWith('createItem')));

    return (
        <div className="w-80">
            {!isWebmapReady && canCreateWebmap && getEditDialog()}
            {isWebmapReady && canCreateWebmap && getOpenWebmapContent()}
            {!canCreateWebmap && getWarningMessage4OrgUser()}
        </div>
    );
};

export default SaveAsWebmapDialog;
