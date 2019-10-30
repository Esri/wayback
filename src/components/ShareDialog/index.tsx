import './style.scss';
import * as React from 'react';
import { modal } from 'calcite-web/dist/js/calcite-web.min.js';
import config from './config';

interface IProps {

}

interface IState {

}

class ShareDialog extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    componentDidMount(){
        modal();
    }

    render(){
        return(
            <div className="js-modal modal-overlay customized-modal" data-modal="share">
                <div className="modal-content column-7" role="dialog" aria-labelledby="modal">

                    <div className='trailer-1'>
                        <span className="js-modal-toggle cursor-pointer right" aria-label="close-modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 32 32" className="svg-icon"><path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z"/></svg>
                        </span>

                        <h4 className='text-center'>Share World Imagery Wayback</h4>
                    </div>

                    <div className='input-2-copy-url trailer-half'>
                        <div className="input-group">
                            <input className="input-group-input" type="text" />
                            <span className="input-group-button">
                                <button className="btn">Copy</button>
                            </span>
                        </div>
                    </div>

                    <div className='trailer-half social-media-icons'>
                        <span className="icon-social-twitter cursor-pointer font-size-2" aria-label="Twitter"></span>
                        <span className="icon-social-linkedin cursor-pointer" aria-label="LinkedIn"></span>
                        <span className="icon-social-facebook cursor-pointer" aria-label="Facebook"></span>
                        <a className="icon-social-github cursor-pointer" href={config["github-repo-url"]} target='_blank' aria-label="github"></a>
                    </div>
                
                </div>
            </div>
        );
    }

};

export default ShareDialog;