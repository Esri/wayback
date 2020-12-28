import React from 'react';
import './style.scss';

import classnames from 'classnames';

type Props = {
    isOpen: boolean;
    onClickHandler:()=>void;
}

const SwipeWidgetToggleBtn:React.FC<Props> = ({
    isOpen,
    onClickHandler
}) => {

    const classNames = classnames('swipe-widget-toggle-btn', {
        'is-open': isOpen
    })

    return (
        <div
            className={classNames}
            onClick={onClickHandler}
            title="Toggle Swipe Mode"
        >
        </div>
    )
}

export default SwipeWidgetToggleBtn
