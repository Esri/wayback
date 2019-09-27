import './style.scss';
import * as React from 'react';

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
            <div className='app-content'>I am the app</div>
        );
    }

};

export default App;