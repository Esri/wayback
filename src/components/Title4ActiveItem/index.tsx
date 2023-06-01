import React from 'react';

import { IWaybackItem } from '../../types';

interface IProps {
    isMobile: boolean;
    activeWaybackItem: IWaybackItem;
    previewWaybackItem: IWaybackItem;
    shouldShowPreviewItemTitle: boolean;
}

// interface IState {}

class Title4ActiveItem extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            activeWaybackItem,
            previewWaybackItem,
            shouldShowPreviewItemTitle,
            isMobile,
        } = this.props;

        const releaseDate = shouldShowPreviewItemTitle
            ? previewWaybackItem.releaseDateLabel
            : activeWaybackItem.releaseDateLabel;

        const subtitle = !isMobile ? (
            <span className="font-size--3">Click map for imagery details</span>
        ) : null;

        return (
            <div className="text-center text-blue">
                <h4 className="font-size-2 avenir-light trailer-0">
                    Wayback {releaseDate}
                </h4>
                {subtitle}
            </div>
        );
    }
}

export default Title4ActiveItem;
