import React from 'react';
import './style.css';

interface IProps {
    isSideBarHide: boolean;
    onClick: () => void;
}

// interface IState {}

class SidebarToggleBtn extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { isSideBarHide, onClick } = this.props;

        const icon = isSideBarHide ? (
            // open btn
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                viewBox="0 0 24 24"
            >
                <path d="M22 13h-9v9h-1v-9H3v-1h9V3h1v9h9z" />
            </svg>
        ) : (
            // close btn
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                viewBox="0 0 24 24"
            >
                <path d="M13.207 12.5l7.778 7.778-.707.707-7.778-7.778-7.778 7.778-.707-.707 7.778-7.778-7.778-7.778.707-.707 7.778 7.778 7.778-7.778.707.707z" />
            </svg>
        );

        return (
            <div
                className="sidebar-toggle-btn"
                onClick={onClick}
                style={{
                    position: 'absolute',
                    top: '.75rem',
                    right: '.5rem',
                }}
            >
                {icon}
            </div>
        );
    }
}

export default SidebarToggleBtn;
