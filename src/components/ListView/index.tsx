import './style.scss';
import * as React from 'react';

interface IProps {

}

interface IState {

}

class ListView extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){
        return(
            <div className='list-view-container'>ListView</div>
        );
    }

};

export default ListView;