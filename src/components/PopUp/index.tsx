import './style.scss';
import * as React from 'react';

interface IProps {

}

interface IState {

}

class PopUp extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){
        return(
            <div className='popup-conatiner'>PopUp</div>
        );
    }

};

export default PopUp;