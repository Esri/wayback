import './style.scss';
import * as React from 'react';
import classnames from 'classnames';
import * as calcite from 'calcite-web/dist/js/calcite-web.min.js';
import {
    savePortalUrlInSearchParam,
    getPortalUrlInSearchParam,
    getMapExtent,
} from '../../utils/UrlSearchParam';
import {
    saveDefaultExtent,
    setShouldShowUpdatesWithLocalChanges,
    getShouldShowUpdatesWithLocalChanges,
} from '../../utils/LocalStorage';
import { IExtentGeometry, IUserSession } from '../../types';
import config from './config';

type SaveBtnLabelValue = 'Save' | 'Saved';

interface IProps {
    mapExtent?: IExtentGeometry;
    userSession?: IUserSession;

    toggleSignInBtnOnClick: (shouldSignIn: boolean) => void;
    shouldShowLocalChangesByDefaultOnClick: (
        shouldShowLocalChangesByDefault: boolean
    ) => void;
}

interface IState {
    portalUrl: string;
    shouldUseCustomPortalUrl: boolean;
    shouldSaveAsDefaultExtent: boolean;
    shouldShowLocalChangesByDefault: boolean;
    saveBtnLable: SaveBtnLabelValue;
}

type StateKeys = keyof IState;

class SettingDialog extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            portalUrl: getPortalUrlInSearchParam(),
            shouldUseCustomPortalUrl: false,
            shouldSaveAsDefaultExtent: false,
            shouldShowLocalChangesByDefault: getShouldShowUpdatesWithLocalChanges(),
            saveBtnLable: 'Save',
        };

        this.saveSettings = this.saveSettings.bind(this);
        this.portalUrlInputOnChange = this.portalUrlInputOnChange.bind(this);
        this.toggleBooleanStateVal = this.toggleBooleanStateVal.bind(this);
    }

    portalUrlInputOnChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const portalUrl = evt.currentTarget.value;

        this.setState({
            portalUrl,
        });
    }

    toggleBooleanStateVal(stateKey: StateKeys) {
        if (typeof this.state[stateKey] === 'boolean') {
            const newVal = !this.state[stateKey];

            this.setState((prevState) => ({
                ...prevState,
                [stateKey]: newVal,
            }));
        }
    }

    saveSettings() {
        const {
            portalUrl,
            shouldSaveAsDefaultExtent,
            shouldShowLocalChangesByDefault,
        } = this.state;

        const { shouldShowLocalChangesByDefaultOnClick } = this.props;

        if (shouldSaveAsDefaultExtent) {
            const mapExt = getMapExtent();
            saveDefaultExtent(mapExt);
        }

        if (
            shouldShowLocalChangesByDefault !==
            getShouldShowUpdatesWithLocalChanges()
        ) {
            setShouldShowUpdatesWithLocalChanges(
                shouldShowLocalChangesByDefault
            );

            shouldShowLocalChangesByDefaultOnClick(
                shouldShowLocalChangesByDefault
            );
        }

        if (portalUrl) {
            savePortalUrlInSearchParam(portalUrl);
            window.location.reload();
        }

        this.toggleSaveBtnLabel(true);

        this.close();
    }

    toggleSaveBtnLabel(isSaved = false) {
        const newVal = isSaved ? 'Saved' : 'Save';

        this.setState(
            {
                saveBtnLable: newVal,
            },
            () => {
                if (newVal === 'Saved') {
                    setTimeout(() => {
                        this.toggleSaveBtnLabel();
                    }, 2000);
                }
            }
        );
    }

    close() {
        calcite.bus.emit('modal:close');
    }

    componentDidUpdate(prevProps: IProps) {
        const { mapExtent } = this.props;

        // turn off shouldSaveAsDefaultExtent every time the map extent changes
        if (mapExtent !== prevProps.mapExtent) {
            this.setState({
                shouldSaveAsDefaultExtent: false,
            });
        }
    }

    componentDidMount() {
        calcite.modal();
    }

    render() {
        const { userSession, toggleSignInBtnOnClick } = this.props;
        const {
            portalUrl,
            shouldUseCustomPortalUrl,
            shouldSaveAsDefaultExtent,
            shouldShowLocalChangesByDefault,
            saveBtnLable,
        } = this.state;

        const isShouldShowLocalChangesByDefaultChanged =
            shouldShowLocalChangesByDefault !==
            getShouldShowUpdatesWithLocalChanges();

        const saveBtnClasses = classnames('btn', {
            'btn-disabled':
                !portalUrl &&
                !shouldSaveAsDefaultExtent &&
                !isShouldShowLocalChangesByDefaultChanged
                    ? true
                    : false,
        });

        const signOutBtn = (
            <span
                className="btn btn-transparent"
                onClick={toggleSignInBtnOnClick.bind(this, false)}
            >
                Sign Out
            </span>
        );

        return (
            <div
                className="js-modal modal-overlay customized-modal setting-dialog"
                data-modal={config['modal-id']}
            >
                <div
                    className="modal-content column-8"
                    role="dialog"
                    aria-labelledby="modal"
                >
                    <span
                        className="js-modal-toggle cursor-pointer right"
                        aria-label="close-modal"
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

                    <h2 className="text-center trailer-1">Settings</h2>

                    <div className="leader-half trailer-1">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                className="toggle-switch-input"
                                checked={
                                    shouldSaveAsDefaultExtent ? true : false
                                }
                                onChange={this.toggleBooleanStateVal.bind(
                                    this,
                                    'shouldSaveAsDefaultExtent'
                                )}
                            />
                            <span className="toggle-switch-track margin-right-1"></span>
                            <span className="toggle-switch-label font-size--1">
                                Save current map extent as default
                            </span>
                        </label>
                    </div>

                    <div className="leader-half trailer-1">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                className="toggle-switch-input"
                                checked={
                                    shouldShowLocalChangesByDefault
                                        ? true
                                        : false
                                }
                                onChange={this.toggleBooleanStateVal.bind(
                                    this,
                                    'shouldShowLocalChangesByDefault'
                                )}
                            />
                            <span className="toggle-switch-track margin-right-1"></span>
                            <span className="toggle-switch-label font-size--1">
                                Show only versions with local changes by default
                            </span>
                        </label>
                    </div>

                    <div className="leader-half trailer-1">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                className="toggle-switch-input"
                                checked={
                                    shouldUseCustomPortalUrl ? true : false
                                }
                                onChange={this.toggleBooleanStateVal.bind(
                                    this,
                                    'shouldUseCustomPortalUrl'
                                )}
                            />
                            <span className="toggle-switch-track margin-right-1"></span>
                            <span className="toggle-switch-label font-size--1">
                                Use ArcGIS Enterprise URL to save map
                            </span>
                        </label>

                        {shouldUseCustomPortalUrl ? (
                            <label>
                                <input
                                    type="text"
                                    placeholder="https://<my-enterprise-url>/portal"
                                    onChange={this.portalUrlInputOnChange}
                                    value={portalUrl}
                                />
                            </label>
                        ) : null}
                    </div>

                    <div className="text-right">
                        <span className="margin-right-1">
                            {userSession ? signOutBtn : null}
                        </span>

                        <span
                            className={saveBtnClasses}
                            onClick={this.saveSettings}
                        >
                            {saveBtnLable}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingDialog;
