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
            <div className='gutter-container'>Gutter</div>
        );
    }

};

export default Gutter;