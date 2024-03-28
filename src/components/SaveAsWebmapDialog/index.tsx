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

import React from 'react';
import classnames from 'classnames';
import config from './config';

import { IWaybackItem, IExtentGeomety } from '@typings/index';
import createWebmap from './createWebmap';

interface IProps {
    // isVisible?: boolean;
    waybackItems: Array<IWaybackItem>;
    rNum4SelectedWaybackItems: Array<number>;
    /**
     * if ture, user has signed in alredy
     */
    hasSignedInAlready: boolean;
    /**
     * role of signed in user
     */
    userRole: string;
    /**
     * access token of signe in user
     */
    token: string;
    portalBaseURL: string;
    mapExtent: IExtentGeomety;

    // onClose: (val: boolean) => void;
    signInButtonOnClick: () => void;
}

interface IState {
    title: string;
    tags: string;
    description: string;

    isCreatingWebmap: boolean;
    isWebmapReady: boolean;
    webmapId: string;

    isRequiredFieldMissing: boolean;
}

class SaveAsWebmapDialog extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            title: config.title,
            tags: config.tags,
            description: config.description,
            isCreatingWebmap: false,
            isWebmapReady: false,
            webmapId: '',
            isRequiredFieldMissing: false,
        };

        this.setTitle = this.setTitle.bind(this);
        this.setTags = this.setTags.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.saveAsWebmap = this.saveAsWebmap.bind(this);
        this.openWebmap = this.openWebmap.bind(this);
    }

    setWebmapId(webmapId = '') {
        this.setState({
            webmapId,
            isWebmapReady: webmapId ? true : false,
        });
    }

    checkIsRequiredFieldMissing() {
        const { title } = this.state;

        const isRequiredFieldMissing = !title ? true : false;

        this.setState({
            isRequiredFieldMissing,
        });
    }

    setTitle(event: React.ChangeEvent<HTMLInputElement>) {
        const title = event.target.value;

        this.setState(
            {
                title,
            },
            () => {
                this.checkIsRequiredFieldMissing();
            }
        );
    }

    setTags(event: React.ChangeEvent<HTMLInputElement>) {
        const tags = event.target.value;

        this.setState(
            {
                tags,
            }
            // () => {
            //     this.checkIsRequiredFieldMissing();
            // }
        );
    }

    setDescription(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            description: event.target.value,
        });
    }

    toggleIsCreatingWebmap(val = false) {
        this.setState({
            isCreatingWebmap: val,
        });
    }

    async saveAsWebmap() {
        const { waybackItems, rNum4SelectedWaybackItems, mapExtent } =
            this.props;

        const { title, tags, description } = this.state;

        const waybackItemsToSave = waybackItems.filter((d) => {
            return rNum4SelectedWaybackItems.indexOf(d.releaseNum) > -1;
        });

        try {
            this.toggleIsCreatingWebmap(true);

            const createWebmapResponse = await createWebmap({
                title,
                tags,
                description,
                mapExtent,
                waybackItemsToSave,
            });
            // console.log('createWebmapResponse', createWebmapResponse);

            if (createWebmapResponse.id) {
                this.setWebmapId(createWebmapResponse.id);
            }
        } catch (err) {
            console.error(err);
        }

        this.toggleIsCreatingWebmap(false);
    }

    openWebmap() {
        const { hasSignedInAlready, portalBaseURL } = this.props;
        const { webmapId } = this.state;

        // const baseUrl =
        //     userSession &&
        //     userSession.portal.url &&
        //     userSession.portal.urlKey &&
        //     userSession.portal.customBaseUrl
        //         ? `https://${userSession.portal.urlKey}.${userSession.portal.customBaseUrl}`
        //         : userSession.portal.url;

        const itemUrl =
            hasSignedInAlready && webmapId
                ? `${portalBaseURL}/home/item.html?id=${webmapId}`
                : null;

        if (itemUrl) {
            window.open(itemUrl, '_blank');
        }
    }

    getEditDialog() {
        const {
            title,
            tags,
            description,
            isCreatingWebmap,
            isRequiredFieldMissing,
        } = this.state;

        const creatingIndicator = isCreatingWebmap ? (
            <span className="text-sm mr-1 web-map-on-creating-indicator">
                Creating Web Map...
            </span>
        ) : null;

        const creatWebMapBtnClasses = classnames({
            disabled: isRequiredFieldMissing,
        });

        const creatWebMapBtn = !isCreatingWebmap ? (
            <div className={creatWebMapBtnClasses} onClick={this.saveAsWebmap}>
                <calcite-button>Create Wayback Map</calcite-button>
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
                        // className={title ? 'input-success' : 'input-error'}
                        className={classnames('w-full outline-none p-1', {
                            outline: !title,
                            'outline-red-400': !title,
                        })}
                        value={title}
                        onChange={this.setTitle}
                        required={true}
                        disabled={isCreatingWebmap ? true : false}
                    />
                </div>

                <div className="w-full mb-2">
                    <h5>Tags</h5>
                    <input
                        type="text"
                        className="w-full outline-none p-1"
                        spellCheck="false"
                        placeholder="tags are optional"
                        // className={tags ? 'input-success' : 'input-error'}
                        value={tags}
                        onChange={this.setTags}
                        // required={true}
                        disabled={isCreatingWebmap ? true : false}
                    />
                </div>

                <div className="w-full mb-2">
                    <h5>Description: (Optional)</h5>
                    <textarea
                        className="w-full outline-none p-1"
                        spellCheck="false"
                        value={description}
                        onChange={this.setDescription}
                        disabled={isCreatingWebmap ? true : false}
                    ></textarea>
                </div>

                <div className="mt-4 text-right w-full">
                    {creatingIndicator}
                    {creatWebMapBtn}
                </div>
            </div>
        );
    }

    getOpenWebmapContent() {
        return (
            <div className="w-full">
                <p className="message-webamap-is-ready mb-4">
                    Your Wayback Map is ready!
                </p>
                <div onClick={this.openWebmap}>
                    <calcite-button width="full">
                        {' '}
                        Open Wayback Map
                    </calcite-button>
                </div>
            </div>
        );
    }

    /**
     * Get the warning message for the user who does not have privilege to publish content
     */
    getWarningMessage4OrgUser() {
        const { signInButtonOnClick } = this.props;

        return (
            <div>
                <p>
                    You signed in using a account that does not have privilege
                    to create content in your ArcGIS Online organization.
                </p>
                <p>
                    Please{' '}
                    <span
                        className=" text-custom-theme-blue-brand cursor-pointer"
                        onClick={signInButtonOnClick}
                    >
                        sign in
                    </span>{' '}
                    again using a different account.
                </p>
            </div>
        );
    }

    componentDidUpdate(prevPros: IProps) {
        // TODO: this logic is broken after wrapping this component in the container component
        if (
            prevPros.rNum4SelectedWaybackItems !==
            this.props.rNum4SelectedWaybackItems
        ) {
            // reset the webmap id since selected items have changed
            this.setWebmapId();
        }
    }

    render() {
        const { userRole } = this.props;

        const { isWebmapReady } = this.state;

        /**
         * the signed-in user has no privilage to create content if it has the role in the organization equals to 'org_user'
         */
        const hasNoPrivilege2CreateContent = userRole === 'org_user';

        const editDialogContent =
            !isWebmapReady && !hasNoPrivilege2CreateContent
                ? this.getEditDialog()
                : null;

        const openWebmapContent =
            isWebmapReady && !hasNoPrivilege2CreateContent
                ? this.getOpenWebmapContent()
                : null;

        const warningMessage4OrgUser = hasNoPrivilege2CreateContent
            ? this.getWarningMessage4OrgUser()
            : null;

        return (
            <div className="w-80">
                {editDialogContent}
                {openWebmapContent}
                {warningMessage4OrgUser}
            </div>
        );
    }
}

export default SaveAsWebmapDialog;
