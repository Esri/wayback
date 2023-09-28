import React from 'react';
import classnames from 'classnames';

import { IWaybackItem, IStaticTooltipData } from '@typings/index';
import { getServiceUrl } from '@utils/Tier';

interface IProps {
    data: IWaybackItem;
    isActive: boolean;
    isSelected: boolean;
    isHighlighted: boolean;
    /**
     * if true, download button should be disabled
     */
    shouldDownloadButtonBeDisabled?: boolean;

    toggleSelect?: (releaseNum: number) => void;
    onClick?: (releaseNum: number) => void;
    downloadButtonOnClick: (releaseNum: number) => void;
    onMouseEnter?: (
        releaseNum: number,
        shouldShowPreviewItemTitle: boolean
    ) => void;
    onMouseOut?: () => void;
    toggleTooltip?: (data?: IStaticTooltipData) => void;
}

// interface IState {}

const ButtonWrapperClassnames = `relative h-full items-center px-2 cursor-pointer text-white`;

class ListViewCard extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);

        this.openItem = this.openItem.bind(this);
        // this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    openItem() {
        const { data } = this.props;

        const itemId = data.itemID;

        const agolHost = getServiceUrl('portal-url');

        const itemUrl = `${agolHost}/home/item.html?id=${itemId}`;

        window.open(itemUrl, '_blank');
    }

    // showTooltip(evt: React.MouseEvent) {
    //     const { toggleTooltip } = this.props;
    //     const boundingRect = evt.currentTarget.getBoundingClientRect();

    //     toggleTooltip({
    //         content: evt.currentTarget.getAttribute('data-tooltip-content'),
    //         left: boundingRect.left + evt.currentTarget.clientWidth + 5,
    //         top: boundingRect.top + 3,
    //     });
    // }

    hideTooltip() {
        const { toggleTooltip } = this.props;
        toggleTooltip();
    }

    render() {
        const {
            data,
            isActive,
            isSelected,
            isHighlighted,
            shouldDownloadButtonBeDisabled,
            onClick,
            onMouseEnter,
            onMouseOut,
            toggleSelect,
            downloadButtonOnClick,
        } = this.props;

        const showControlButtons = isActive || isSelected;

        return (
            <div
                className="py-1"
                onMouseEnter={onMouseEnter.bind(this, data.releaseNum, false)}
                onMouseLeave={onMouseOut}
                data-release-num={data.releaseNum}
            >
                <div
                    className={classnames('list-card group', {
                        // 'is-active' indicates if is viewing this release on map
                        'is-active': isActive,
                        // 'is-highlighted' indicates if this release has local change
                        'is-highlighted': isHighlighted,
                        // 'is-selected' indicates if this release is being selected
                        'is-selected': isSelected,
                    })}
                >
                    <div
                        className="is-flexy cursor-pointer"
                        onClick={onClick.bind(this, data.releaseNum)}
                    >
                        <a
                            className="margin-left-half link-light-gray cursor-pointer"
                            // onClick={onClick.bind(this, data.releaseNum)}
                        >
                            {data.releaseDateLabel}
                        </a>
                    </div>

                    <div
                        className={classnames(ButtonWrapperClassnames, {
                            flex: showControlButtons,
                            'hidden group-hover:flex': !showControlButtons,
                        })}
                        onClick={this.openItem}
                        title="Learn more about this release..."
                    >
                        <calcite-icon icon="information" scale="m" />
                    </div>

                    {/* <div
                        className={classnames(ButtonWrapperClassnames, {
                            flex: showControlButtons,
                            'hidden group-hover:flex': !showControlButtons,
                            'cursor-default opacity-50':
                                shouldDownloadButtonBeDisabled,
                        })}
                        onClick={() => {
                            if (shouldDownloadButtonBeDisabled) {
                                return;
                            }

                            downloadButtonOnClick(data.releaseNum);
                        }}
                        title={
                            shouldDownloadButtonBeDisabled
                                ? 'Reached the maximum limit for download jobs'
                                : 'Download a local copy of imagery tiles'
                        }
                    >
                        <calcite-icon icon="download-to" scale="m" />
                    </div> */}

                    <div
                        className={classnames(ButtonWrapperClassnames, {
                            flex: showControlButtons,
                            'hidden group-hover:flex': !showControlButtons,
                            'bg-white bg-opacity-20': isSelected,
                        })}
                        onClick={toggleSelect.bind(this, data.releaseNum)}
                        title={
                            isSelected
                                ? 'Remove this release from your ArcGIS Online Map'
                                : 'Add this release to an ArcGIS Online Map'
                        }
                    >
                        <calcite-icon icon="arcgis-online" scale="m" />
                    </div>

                    {/* <div
                        className="add-to-webmap-btn cursor-pointer"
                        // onMouseOver={this.showTooltip}
                        // onMouseOut={this.hideTooltip}
                        onClick={toggleSelect.bind(this, data.releaseNum)}
                        title={tooltipContentAdd2WebmapBtn}
                    ></div> */}
                </div>
            </div>
        );
    }
}

export default ListViewCard;
