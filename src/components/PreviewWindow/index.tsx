import './style.scss';
import * as React from 'react';

interface IProps {

}

interface IState {

}

class PreviewWindow extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){
        return(
            <div className='preview-window-container'>PreviewWindow</div>
        );
    }

};

export default PreviewWindow;