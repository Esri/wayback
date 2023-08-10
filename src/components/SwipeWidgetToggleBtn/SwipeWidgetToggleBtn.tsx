import React from 'react';
// import './style.css';

import classnames from 'classnames';

type Props = {
    /**
     * if true, the animation mode is on and the swipe button should be set to semi-transparent
     */
    inactive: boolean;
    onClickHandler: () => void;
};

const SwipeWidgetToggleBtn: React.FC<Props> = ({
    inactive,
    onClickHandler,
}: Props) => {
    return (
        <div
            className={classnames(
                'relative w-full text-center my-3 cursor-pointer',
                {
                    'opacity-50': inactive,
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
