import './style.scss';
import * as React from 'react';

interface IProps {

}

interface IState {

}

class SaveAsWebmapDialog extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){
        return(
            <div className='save-as-webmap-dialog-container'>SaveAsWebmapDialog</div>
        );
    }

};

export default SaveAsWebmapDialog;