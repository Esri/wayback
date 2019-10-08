import './style.scss';
import * as React from 'react';

interface IProps {
    isActive:boolean,
    // label:string,
    onChange:()=>void
}

interface IState {

}

class CheckboxToggle extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){

        const { isActive, onChange } = this.props;

        const iconSvg = isActive 
            ? <span className='icon-ui-checkbox-checked'></span>
            : <span className='icon-ui-checkbox-unchecked text-dark-gray'></span>

        return(
            <div className='checkbox-toggle-control'>
                <span className={`checkbox-icon text-dark-gray`} onClick={onChange}>
                    {iconSvg}
                </span>
                <span className='font-size--2'>
                    Only updates with <span className='text-white'>local changes</span>
                </span>
            </div>
        );
    }

};

export default CheckboxToggle;