import './style.scss';
import React from 'react'

import classnames from 'classnames';

type Props = {
    isSelected?: boolean;
    showArrowOnLeft?: boolean;
    showBoarderOnLeft?: boolean;
    children:React.ReactNode;
    onClick: ()=>void;
}

const LayerSelector:React.FC<Props> = ({
    isSelected=false,
    showArrowOnLeft=false,
    showBoarderOnLeft=false,
    children,
    onClick
}:Props) => {

    const classNames = classnames(
        'layer-selector',
        {
            'is-selected': isSelected,
            'is-arrow-on-left': showArrowOnLeft,
        }
    );

    return (
        <div
            className={classNames}
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: '38px',
                margin: '.5rem 0',
                padding: '0 .5rem',
                backgroundColor: isSelected ? '#2267AE' : '#1C1C1C',
                color: isSelected ? '#fff' : 'unset',
                borderLeft:
                    !showArrowOnLeft && isSelected || showBoarderOnLeft
                        ? ' 4px solid #fff'
                        : '4px solid transparent',
                borderRight:
                    showArrowOnLeft && isSelected
                        ? ' 4px solid #fff'
                        : '4px solid transparent',
                boxSizing: 'border-box',
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            { children }
        </div>
    );
}

export default LayerSelector
