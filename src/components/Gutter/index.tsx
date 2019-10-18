import './style.scss';
import * as React from 'react';

interface IProps {
    // selectedWaybackItems:Array<number>
}

interface IState {

}

class Gutter extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){

        return(
            <div className='gutter-container'>
                
                <div className='gutter-nav-btn js-modal-toggle' data-modal="about">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height='24' width='24'><path d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1zm1 5h-2V4h2zm2 11v1H9v-1h1l1-1v-5l-1-1V9h3v7l1 1z"/></svg>
                </div>

                <div className='gutter-nav-btn js-modal-toggle' data-modal='setting'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height='24' width='24'><path d="M3.254 9.089L0 10.294l.013 3.5 3.269 1.183a9.229 9.229 0 0 0 .476 1.146l-1.45 3.156 2.484 2.465L7.94 20.27a9.157 9.157 0 0 0 1.148.476L10.294 24l3.5-.013 1.183-3.269a9.242 9.242 0 0 0 1.146-.476l3.156 1.45 2.465-2.484-1.474-3.149a9.145 9.145 0 0 0 .476-1.148L24 13.706l-.013-3.5-3.269-1.183a9.223 9.223 0 0 0-.476-1.146l1.45-3.156-2.484-2.465L16.06 3.73a9.158 9.158 0 0 0-1.148-.476L13.706 0l-3.5.013-1.183 3.269a9.245 9.245 0 0 0-1.146.476l-3.156-1.45-2.465 2.484L3.73 7.94a9.14 9.14 0 0 0-.476 1.148zm4.651 2.24a4.15 4.15 0 1 1 3.423 4.766 4.15 4.15 0 0 1-3.423-4.767z"/></svg>
                </div>

                {this.props.children}

            </div>
        );
    }

};

export default Gutter;