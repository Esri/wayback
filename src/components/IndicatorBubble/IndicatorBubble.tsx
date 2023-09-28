import './IndicatorBubble.css';
import React, { FC } from 'react';

type Props = {
    children?: React.ReactNode;
};

export const IndicatorBubble: FC<Props> = ({ children }) => {
    return <div className="indicator-bubble">{children}</div>;
};
