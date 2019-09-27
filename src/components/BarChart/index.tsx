import './style.scss';
import * as React from 'react';

interface IProps {

}

interface IState {

}

class BarChart extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){
        return(
            <div className='bar-chart-container'>BarChart</div>
        );
    }

};

export default BarChart;