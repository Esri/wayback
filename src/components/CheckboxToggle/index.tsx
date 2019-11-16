import './style.scss';
import * as React from 'react';

interface IProps {
    isActive: boolean;
    // label:string,
    onChange: () => void;
}

// interface IState {}

class CheckboxToggle extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { isActive, onChange } = this.props;

        const iconSvg = isActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24"><path d="M19.719 2H3.28A1.281 1.281 0 0 0 2 3.281v16.437A1.282 1.282 0 0 0 3.281 21h16.437A1.282 1.282 0 0 0 21 19.718V3.281A1.281 1.281 0 0 0 19.719 2zM20 19.719a.281.281 0 0 1-.281.281H3.28a.281.281 0 0 1-.28-.281V3.28A.281.281 0 0 1 3.281 3H19.72a.281.281 0 0 1 .281.281zm-14-7.03l.637-.636L9.5 14.727l7.022-6.87.637.637L9.5 16z"/></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24"><path d="M20.719 3H4.28A1.281 1.281 0 0 0 3 4.281v16.437A1.282 1.282 0 0 0 4.281 22h16.437A1.282 1.282 0 0 0 22 20.718V4.281A1.281 1.281 0 0 0 20.719 3zM21 20.719a.281.281 0 0 1-.281.281H4.28a.281.281 0 0 1-.28-.281V4.28A.281.281 0 0 1 4.281 4H20.72a.281.281 0 0 1 .281.281z"/></svg>
        );

        return (
            <div className="checkbox-toggle-control" onClick={onChange}>
                <span className={`checkbox-icon margin-right-quarter text-dark-gray`}>
                    {iconSvg}
                </span>
                <span className="font-size--2">
                    Only versions with{' '}
                    <span className="text-white">local changes</span>
                </span>
            </div>
        );
    }
}

export default CheckboxToggle;
