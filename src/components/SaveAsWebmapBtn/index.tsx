import './style.css';
import React from 'react';
import classNames from 'classnames';

interface IProps {
    selectedWaybackItems: Array<number>;
    disabled: boolean;
    onClick?: (val: boolean) => void;
    clearAll?: () => void;
}

// interface IState {}

class SaveAsWebmapBtn extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler() {
        const { selectedWaybackItems, onClick } = this.props;

        if (selectedWaybackItems.length) {
            onClick(true);
        }
    }

    render() {
        const { selectedWaybackItems, disabled, clearAll } = this.props;

        const isActive = selectedWaybackItems.length ? true : false;

        const tooltipContent = isActive
            ? 'Open these versions in a new Web Map'
            : 'Choose versions from the list to build a set of Wayback layers for use in a new Web Map';

        return (
            <div
                className={classNames(
                    'save-as-webmap-btn-container relative w-full text-center',
                    {
                        'is-disabled': disabled,
                    }
                )}
            >
                <div
                    // className={btnClass}
                    className={classNames('relative', {
                        'cursor-pointer': isActive,
                    })}
                    onClick={this.onClickHandler}
                    title={tooltipContent}
                >
                    <calcite-icon icon="arcgis-online" scale="l" />

                    {isActive && (
                        <div className="indicator-count-of-selected-items">
                            <span>{selectedWaybackItems.length}</span>
                        </div>
                    )}
                </div>

                {isActive && (
                    <div
                        className="text-center cursor-pointer text-xs"
                        onClick={clearAll.bind(this)}
                    >
                        clear all
                    </div>
                )}
            </div>
        );
    }
}

export default SaveAsWebmapBtn;
