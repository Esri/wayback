import './style.scss';
import * as React from 'react';

interface IProps {

}

interface IState {

}

class Gutter extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){
        return(
            <div className='gutter-container'>
                
                <div className='gutter-nav-btn text-center shadow-trailer font-size-3'>
                    <span className='icon-ui-description js-modal-toggle' data-modal="about"></span>
                </div>

            </div>
        );
    }

};

export default Gutter;