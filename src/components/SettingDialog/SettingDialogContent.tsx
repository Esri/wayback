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
import {
    saveDefaultExtent,
    getCustomPortalUrl,
    setCustomPortalUrl,
    // setShouldShowUpdatesWithLocalChanges,
    // getShouldShowUpdatesWithLocalChanges,
} from '@utils/LocalStorage';
import { IExtentGeomety } from '@typings/index';
import { Switch } from './Switch';
import { CalciteButton, CalciteIcon } from '@esri/calcite-components-react';
// import config from './config';

type SaveBtnLabelValue = 'Save' | 'Saved';

interface IProps {
    mapExtent?: IExtentGeomety;
    signedInAlready?: boolean;
    signedInUser?: __esri.PortalUser;
    toggleSignInBtnOnClick: (shouldSignIn: boolean) => void;
    // shouldShowLocalChangesByDefaultOnClick: (
    //     shouldShowLocalChangesByDefault: boolean
    // ) => void;
    // onClose: () => void;
}

interface IState {
    portalUrl: string;
    shouldUseCustomPortalUrl: boolean;
    shouldSaveAsDefaultExtent: boolean;
    // shouldShowLocalChangesByDefault: boolean;
    saveBtnLable: SaveBtnLabelValue;
}

type StateKeys = keyof IState;

const CustomUrlFromLocalStorage = getCustomPortalUrl();

class SettingDialogContent extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            // portalUrl: getPortalUrlInSearchParam(),
            portalUrl: CustomUrlFromLocalStorage,
            shouldUseCustomPortalUrl: CustomUrlFromLocalStorage ? true : false,
            shouldSaveAsDefaultExtent: false,
            // shouldShowLocalChangesByDefault:
            //     getShouldShowUpdatesWithLocalChanges(),
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
            shouldUseCustomPortalUrl,
            shouldSaveAsDefaultExtent,
            // shouldShowLocalChangesByDefault,
        } = this.state;

        const { mapExtent } = this.props;

        if (shouldSaveAsDefaultExtent) {
            // const mapExt = getMapExtent();
            saveDefaultExtent(mapExtent);
        }

        // if (
        //     shouldShowLocalChangesByDefault !==
        //     getShouldShowUpdatesWithLocalChanges()
        // ) {
        //     setShouldShowUpdatesWithLocalChanges(
        //         shouldShowLocalChangesByDefault
        //     );

        //     shouldShowLocalChangesByDefaultOnClick(
        //         shouldShowLocalChangesByDefault
        //     );
        // }

        const customPortalUrl =
            shouldUseCustomPortalUrl && portalUrl ? portalUrl : null;

        setCustomPortalUrl(customPortalUrl);

        if (customPortalUrl !== CustomUrlFromLocalStorage) {
            // savePortalUrlInSearchParam(portalUrl);
            window.location.reload();
        }

        this.toggleSaveBtnLabel(true);

        // this.close();

        // onClose();
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

    // close() {
    //     calcite.bus.emit('modal:close');
    // }

    componentDidUpdate(prevProps: IProps) {
        const { mapExtent } = this.props;

        // turn off shouldSaveAsDefaultExtent every time the map extent changes
        if (mapExtent !== prevProps.mapExtent) {
            this.setState({
                shouldSaveAsDefaultExtent: false,
            });
        }
    }

    // componentDidMount() {
    //     calcite.modal();
    // }

    render() {
        const { signedInAlready, signedInUser, toggleSignInBtnOnClick } =
            this.props;
        const {
            portalUrl,
            shouldUseCustomPortalUrl,
            shouldSaveAsDefaultExtent,
            // shouldShowLocalChangesByDefault,
            saveBtnLable,
        } = this.state;

        // const isShouldShowLocalChangesByDefaultChanged =
        //     shouldShowLocalChangesByDefault !==
        //     getShouldShowUpdatesWithLocalChanges();

        // const saveBtnClasses = classnames('btn', {
        //     'btn-disabled': !portalUrl && !shouldSaveAsDefaultExtent,
        // });

        // const signOutBtn = (
        //     <CalciteButton
        //         appearance="transparent"
        //         onClick={toggleSignInBtnOnClick.bind(this, false)}
        //     >
        //         Sign Out
        //     </CalciteButton>
        // );

        // const signInBtn = (
        //     <CalciteButton
        //         appearance="outline"
        //         onClick={toggleSignInBtnOnClick.bind(this, true)}
        //     >
        //         Sign In
        //     </CalciteButton>
        // );

        return (
            <>
                <h2 className="text-3xl text-center mb-4">Settings</h2>

                <div className="mt-2 mb-4">
                    {/* <label className="toggle-switch">
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
                    </label> */}

                    <Switch
                        label="Save current map extent as default"
                        checked={shouldSaveAsDefaultExtent ? true : false}
                        onChange={() => {
                            // console.log('on change')
                            this.toggleBooleanStateVal(
                                'shouldSaveAsDefaultExtent'
                            );
                        }}
                    />
                </div>

                <div className="mt-2 mb-4">
                    {/* <label className="toggle-switch">
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
                    </label> */}

                    <Switch
                        label="Use ArcGIS Enterprise URL to save map"
                        checked={shouldUseCustomPortalUrl ? true : false}
                        onChange={() => {
                            // console.log('on change')
                            this.toggleBooleanStateVal(
                                'shouldUseCustomPortalUrl'
                            );
                        }}
                    />

                    {shouldUseCustomPortalUrl ? (
                        // <label>
                        //     <input
                        //         type="text"
                        //         placeholder="https://<my-enterprise-url>/portal"
                        //         onChange={this.portalUrlInputOnChange}
                        //         value={portalUrl}
                        //     />
                        // </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                className="w-full p-1 outline-none"
                                placeholder="https://<my-enterprise-url>/portal"
                                onChange={this.portalUrlInputOnChange}
                                value={portalUrl || undefined}
                            />
                        </div>
                    ) : null}
                </div>

                {/* {signedInUser ? (
                    <div
                        className="mb-4 text-sm flex items-center"
                        data-agol-user-role={signedInUser?.role}
                    >
                        <CalciteIcon icon="user" />
                        <span className="ml-1">
                            Signed in as{' '}
                            <strong>{signedInUser?.username}</strong>
                        </span>
                    </div>
                ) : null} */}

                <div className="flex justify-end">
                    {/* <span className="mr-4">
                        {signedInAlready ? signOutBtn : signInBtn}
                    </span> */}

                    <div
                        className={classnames({
                            disabled: !portalUrl && !shouldSaveAsDefaultExtent,
                        })}
                    >
                        <CalciteButton onClick={this.saveSettings}>
                            {saveBtnLable}
                        </CalciteButton>
                    </div>
                    {/* <span
                        className={saveBtnClasses}
                        onClick={this.saveSettings}
                    >
                        {saveBtnLable}
                    </span> */}
                </div>
            </>
        );
    }
}

export default SettingDialogContent;
