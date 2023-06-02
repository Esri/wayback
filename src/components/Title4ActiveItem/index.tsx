import React from 'react';

import { IWaybackItem } from '../../types';

interface IProps {
    isMobile: boolean;
    activeWaybackItem: IWaybackItem;
    previewWaybackItem: IWaybackItem;
    shouldShowPreviewItemTitle: boolean;
}

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

        return (
            <div className="flex text-custom-theme-blue justify-center items-center">
                <div className="leading-none">
                    <span className="text-xs">Selected release</span>
                    <br />
                    <span className="text-xl font-medium">{releaseDate}</span>
                </div>

                {!isMobile && (
                    <>
                        <div className="ml-3 pl-3 border-l border-custom-theme-blue-dark w-2/5 leading-none">
                            <span className="text-xs">
                                Click map for imagery details
                            </span>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default Title4ActiveItem;
