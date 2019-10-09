import './style.scss';
import * as React from 'react';

interface IProps {
    isActive:boolean
    onClick:()=>void
}

interface IState {

}

class ReferenceLayerToggle extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){

        const { isActive, onClick } = this.props;

        const icon = isActive ? <span className='icon-ui-checkbox-checked'></span> : <span className='icon-ui-checkbox-unchecked'></span>;

        return(
            <div className='reference-layer-toggle text-white'>
                <div className='inline-block margin-left-half cursor-pointer' onClick={onClick}>
                    {icon}
                </div>
                <div className='inline-block'>reference label overlay</div>
            </div>
        );
    }

};

export default ReferenceLayerToggle;