import * as React from 'react';

import { modal } from 'calcite-web/dist/js/calcite-web.min.js';
import { savePortalUrlInSearchParam, getPortalUrlInSearchParam } from '../../utils/UrlSearchParam';


interface IProps {

}

interface IState {
    portalUrl:string
}

class Drawer extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.state = {
            portalUrl: getPortalUrlInSearchParam()
        }

        this.saveSettings = this.saveSettings.bind(this);
        this.portalUrlInputOnChange = this.portalUrlInputOnChange.bind(this);
    }

    portalUrlInputOnChange(evt:React.ChangeEvent<HTMLInputElement>){
        const portalUrl = evt.currentTarget.value;

        this.setState({
            portalUrl
        });
    }

    saveSettings(){
        const { portalUrl } = this.state;

        if(portalUrl){
            savePortalUrlInSearchParam(portalUrl);
            window.location.reload();
        }
    }

    componentDidMount(){
        modal();
    }

    render(){

        const { portalUrl } = this.state;

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
                            <input type="text" placeholder="ArcGIS Enterprise Portal URL" onChange={this.portalUrlInputOnChange} value={portalUrl}/>
                        </label>
                    </div>


                    <div className='text-right'>
                        <span className='btn' onClick={this.saveSettings}>Save</span>
                    </div>
                </div>
            </div>
        );
    }

};

export default Drawer;