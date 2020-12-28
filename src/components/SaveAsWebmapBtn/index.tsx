import './style.scss';
import * as React from 'react';
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

        const containerClass = classNames('save-as-webmap-btn-container customized-tooltip', {
            'is-disabled': disabled
        })

        const btnClass = classNames(
            'create-agol-webmap tooltip tooltip-multiline tooltip-right',
            {
                'is-active': isActive,
            }
        );

        const clearBtn = isActive ? (
            <div
                className="font-size--4 text-center cursor-pointer leader-quarter"
                onClick={clearAll.bind(this)}
            >
                clear all
            </div>
        ) : null;

        const tooltipContent = isActive
            ? 'Open these versions in a new Web Map'
            : 'Choose versions from the list to build a set of Wayback layers for use in a new Web Map';

        return (
            <div className={containerClass}>
                <div
                    className={btnClass}
                    onClick={this.onClickHandler}
                    aria-label={tooltipContent}
                >
                    <div className="overlay-label text-white text-center">
                        <span>
                            {selectedWaybackItems.length}
                        </span>
                    </div>
                </div>
                {clearBtn}
            </div>
        );
    }
}

export default SaveAsWebmapBtn;
