import './style.scss';
import * as React from 'react';

import SaveAsWebmapBtn from '../SaveAsWebmapBtn';

interface IProps {
    selectedWaybackItems:Array<number>
}

interface IState {

}

class Gutter extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){

        const { selectedWaybackItems } = this.props;

        return(
            <div className='gutter-container'>
                
                <div className='gutter-nav-btn text-center shadow-trailer font-size-3'>
                    <span className='icon-ui-description js-modal-toggle' data-modal="about"></span>
                </div>

                <SaveAsWebmapBtn 
                    selectedWaybackItems={selectedWaybackItems}
                />

            </div>
        );
    }

};

export default Gutter;