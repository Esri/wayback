import './style.scss';
import * as React from 'react';

import Gutter from '../Gutter';
import Map from '../Map';
import Modal from '../ModalAboutApp';

interface IProps {

}

interface IState {

}

class App extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){
        return(
            <div className='app-content'>
                <Gutter />

                <div className='sidebar'>

                </div>

                <div className='map-container'>
                    <Map />
                </div>

                <Modal/>
            </div>
        );
    }

};

export default App;