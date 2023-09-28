import './style.css';
import React from 'react';
import { MOBILE_HEADER_HEIGHT } from '@constants/UI';

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
                {/* gradient effect on right side of gutter */}
                <div
                    className="absolute top-0 lef-0 z-0 w-full h-full"
                    style={{
                        background: `linear-gradient(90deg, rgba(0,0,0,0) 80%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,1) 100%)`,
                    }}
                ></div>

                <div className="py-2">
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
                            <calcite-icon icon="share" scale="l" />
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

                {/* divider with shadow effect */}
                <div
                    className="w-full h-2"
                    style={{
                        background: `linear-gradient(5deg, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 100%)`,
                    }}
                ></div>

                {this.props.children}
            </div>
        );
    }
}

export default Gutter;
