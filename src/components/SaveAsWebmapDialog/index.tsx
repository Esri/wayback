import './style.scss';
import React from 'react';
// import * as calcite from 'calcite-web/dist/js/calcite-web.min.js';
import classnames from 'classnames';
import config from './config';

import { IWaybackItem, IUserSession, IExtentGeomety } from '../../types';
import createWebmap from './createWebmap';

interface IProps {
    // isVisible?: boolean;
    waybackItems: Array<IWaybackItem>;
    rNum4SelectedWaybackItems: Array<number>;
    userSession: IUserSession;
    mapExtent: IExtentGeomety;

    onClose: (val: boolean) => void;
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
        const {
            userSession,
            waybackItems,
            rNum4SelectedWaybackItems,
            mapExtent,
        } = this.props;
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
                userSession,
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
        const { userSession } = this.props;
        const { webmapId } = this.state;

        const baseUrl =
            userSession &&
            userSession.portal.url &&
            userSession.portal.urlKey &&
            userSession.portal.customBaseUrl
                ? `https://${userSession.portal.urlKey}.${userSession.portal.customBaseUrl}`
                : userSession.portal.url;

        const itemUrl =
            userSession && webmapId
                ? `${baseUrl}/home/item.html?id=${webmapId}`
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
            <span className="font-size--2 margin-right-quarter web-map-on-creating-indicator">
                Creating Web Map...
            </span>
        ) : null;

        const creatWebMapBtnClasses = classnames('btn upload-webmap-btn', {
            'btn-disabled': isRequiredFieldMissing,
        });

        const creatWebMapBtn = !isCreatingWebmap ? (
            <div className={creatWebMapBtnClasses} onClick={this.saveAsWebmap}>
                Create Wayback Map
            </div>
        ) : null;

        return (
            <div className="dialog-content">
                <h5>Wayback Map Settings:</h5>
                <label>
                    Title
                    <input
                        type="text"
                        placeholder="Tilte is required"
                        className={title ? 'input-success' : 'input-error'}
                        value={title}
                        onChange={this.setTitle}
                        required={true}
                        disabled={isCreatingWebmap ? true : false}
                    />
                </label>

                <label>
                    Tags
                    <input
                        type="text"
                        placeholder="tags are optional"
                        // className={tags ? 'input-success' : 'input-error'}
                        value={tags}
                        onChange={this.setTags}
                        // required={true}
                        disabled={isCreatingWebmap ? true : false}
                    />
                </label>

                <label>
                    Description: (Optional)
                    <textarea
                        value={description}
                        onChange={this.setDescription}
                        disabled={isCreatingWebmap ? true : false}
                    ></textarea>
                </label>

                <div className="leader-half text-right">
                    {creatingIndicator}
                    {creatWebMapBtn}
                </div>
            </div>
        );
    }

    getOpenWebmapContent() {
        return (
            <div>
                <p className="message-webamap-is-ready">
                    Your Wayback Map is ready!
                </p>
                <div className="btn btn-fill" onClick={this.openWebmap}>
                    Open Wayback Map
                </div>
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
        const { onClose } = this.props;

        const { isWebmapReady } = this.state;

        const editDialogContent = !isWebmapReady ? this.getEditDialog() : null;

        const openWebmapContent = isWebmapReady
            ? this.getOpenWebmapContent()
            : null;

        return (
            <div className="modal-overlay customized-modal is-active">
                <div
                    className="modal-content column-6"
                    role="dialog"
                    aria-labelledby="modal"
                >
                    <div className="trailer-0 text-right">
                        <span
                            className="cursor-pointer"
                            aria-label="close-modal"
                            onClick={onClose.bind(this, false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="21"
                                viewBox="0 0 32 32"
                                className="svg-icon"
                            >
                                <path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z" />
                            </svg>
                        </span>
                    </div>

                    {editDialogContent}

                    {openWebmapContent}
                </div>
            </div>
        );
    }
}

export default SaveAsWebmapDialog;
