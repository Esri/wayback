import './style.scss';
import React from 'react';

interface IProps {
    content?: string;
    top?: number;
    left?: number;
}

// interface IState {}

// the tooltip component has fixed position
class Tootip extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { content, top, left } = this.props;

        const style = {
            position: 'fixed',
            top,
            left,
        } as React.CSSProperties;

        return content ? (
            <div className="static-tooltip" style={style}>
                {content}
            </div>
        ) : null;
    }
}

export default Tootip;
