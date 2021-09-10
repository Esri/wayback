import './style.scss';
import React from 'react';

interface IProps {
    isActive: boolean;
    onClick: () => void;
}

// interface IState {}

class ReferenceLayerToggle extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { isActive, onClick } = this.props;

        const icon = isActive ? (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                height="16"
                width="16"
            >
                <path d="M13.071 1H1.93a.929.929 0 0 0-.93.929V13.07a.929.929 0 0 0 .929.929H13.07a.929.929 0 0 0 .929-.929V1.93a.929.929 0 0 0-.928-.93zM13 13H2V2h11zM3.735 7.346l.738-.738 2.084 2.088L11.262 4l.738.738-5.443 5.43z" />
            </svg>
        ) : (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                height="16"
                width="16"
            >
                <path d="M14.071 2H2.93a.929.929 0 0 0-.93.929V14.07a.929.929 0 0 0 .929.929H14.07a.929.929 0 0 0 .929-.929V2.93a.929.929 0 0 0-.928-.93zM14 14H3V3h11z" />
            </svg>
        );

        return (
            <div className="reference-layer-toggle text-white">
                <div
                    className="margin-left-half margin-right-quarter cursor-pointer"
                    onClick={onClick}
                >
                    {icon}
                </div>
                <div className="">reference label overlay</div>
            </div>
        );
    }
}

export default ReferenceLayerToggle;
