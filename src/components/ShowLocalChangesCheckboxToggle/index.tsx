import React from 'react';

interface IProps {
    isActive: boolean;
    // label:string,
    onChange: () => void;
}

class CheckboxToggle extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { isActive, onChange } = this.props;

        return (
            <div
                className="flex items-center justify-center cursor-pointer my-1"
                onClick={onChange}
            >
                {isActive ? (
                    <calcite-icon icon="check-square" scale="s" />
                ) : (
                    <calcite-icon icon="square" scale="s" />
                )}

                <span className="text-sm ml-1">
                    Only versions with{' '}
                    <span className="text-white">local changes</span>
                </span>
            </div>
        );
    }
}

export default CheckboxToggle;
