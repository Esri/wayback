import * as React from 'react';

import { modal } from 'calcite-web/dist/js/calcite-web.min.js';


interface IProps {

}

interface IState {

}

class Drawer extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    componentDidMount(){
        modal();
    }

    render(){
        return(
            <div className="js-modal modal-overlay customized-modal" data-modal="setting">
                <div className="modal-content column-8" role="dialog" aria-labelledby="modal">
                
                    <span className="js-modal-toggle cursor-pointer right" aria-label="close-modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 32 32" className="svg-icon"><path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z"/></svg>
                    </span>
                
                    <h2 className='trailer-half text-center trailer-1'>Settings</h2>

                    <div>
                        <label>
                            Portal URL:
                            <input type="text" placeholder="ArcGIS Enterprise Portal URL"/>
                        </label>
                    </div>


                    <div className='text-right'>
                        <span className='btn'>Save</span>
                    </div>
                </div>
            </div>
        );
    }

};

export default Drawer;