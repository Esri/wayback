import React from 'react';
// import './style.css';

import classnames from 'classnames';

type Props = {
    isOpen: boolean;
    onClickHandler: () => void;
};

const SwipeWidgetToggleBtn: React.FC<Props> = ({
    isOpen,
    onClickHandler,
}: Props) => {
    return (
        <div
            className={classnames(
                'relative w-full text-center my-3 cursor-pointer',
                {
                    'is-open': isOpen,
                }
            )}
            onClick={onClickHandler}
            title="Toggle Swipe Mode"
        >
            <calcite-icon icon="compare" scale="l" />
        </div>
    );
};

export default SwipeWidgetToggleBtn;
