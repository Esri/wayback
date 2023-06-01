import './style.css';
import React from 'react';
import { MOBILE_HEADER_HEIGHT } from '../../constants/UI';

interface IProps {
    isMobile: boolean;
    settingsBtnDisabled: boolean;
    shareBtnDisabled: boolean;
    // children: JSX.Element[] | JSX.Element;

    aboutButtonOnClick: () => void;
    shareButtonOnClick: () => void;
    settingButtonOnClick: () => void;

    children?: React.ReactNode;
}

class Gutter extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render(): JSX.Element {
        const {
            isMobile,
            shareBtnDisabled,
            shareButtonOnClick,
            aboutButtonOnClick,
            settingButtonOnClick,
        } = this.props;

        return (
            <div
                className="gutter-container"
                style={{
                    top: isMobile ? MOBILE_HEADER_HEIGHT : 0,
                }}
            >
                <div className="shadow-trailer pt-1">
                    <div
                        className="gutter-nav-btn"
                        // data-modal={AboutThisAppModalConfig['modal-id']}
                        title="About this app"
                        onClick={aboutButtonOnClick}
                    >
                        <calcite-icon icon="information" scale="l" />
                    </div>

                    {!shareBtnDisabled && (
                        <div
                            className="gutter-nav-btn mb-1"
                            // data-modal={ShareModalConfig['modal-id']}
                            title="Share"
                            onClick={shareButtonOnClick}
                        >
                            <calcite-icon icon="link" scale="l" />
                        </div>
                    )}

                    <div
                        className={`gutter-nav-btn ${
                            this.props.settingsBtnDisabled ? 'btn-disabled' : ''
                        }`}
                        // data-modal={SettingModalConfig['modal-id']}
                        title="Settings"
                        onClick={settingButtonOnClick}
                    >
                        <calcite-icon icon="gear" scale="l" />
                    </div>
                </div>

                {this.props.children}
            </div>
        );
    }
}

export default Gutter;
