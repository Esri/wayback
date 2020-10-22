import * as React from 'react';
import './style.scss';

import classnames from 'classnames';

type Props = {
    isOpen: boolean;
    marginTop: string;
    onClickHandler:()=>void;
}

const SwipeWidgetToggleBtn:React.FC<Props> = ({
    isOpen,
    marginTop,
    onClickHandler
}) => {

    const classNames = classnames('swipe-widget-toggle-btn', {
        'is-open': isOpen
    })

    return (
        <div
            style={{
                marginTop: marginTop
            }}
            className={classNames}
            onClick={onClickHandler}
            title="Toggle Swipe Mode"
        >
        </div>
    )
}

export default SwipeWidgetToggleBtn
