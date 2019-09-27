import './style.scss';
import * as React from 'react';

interface IProps {

}

interface IState {

}

class Map extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){
        return(
            <div id='mapDiv'>Map</div>
        );
    }

};

export default Map;