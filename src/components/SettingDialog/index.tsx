import * as React from 'react';
import classnames from 'classnames'
import { modal } from 'calcite-web/dist/js/calcite-web.min.js';
import { savePortalUrlInSearchParam, getPortalUrlInSearchParam, getMapExtent } from '../../utils/UrlSearchParam';
import { saveDefaultExtent } from '../../utils/LocalStorage'
import { IExtentGeomety } from '../../types';

type SaveBtnLabelValue = 'Save' | 'Saved';

interface IProps {
    mapExtent?:IExtentGeomety
}

interface IState {
    portalUrl:string
    shouldSaveAsDefaultExtent:boolean,
    saveBtnLable:SaveBtnLabelValue
}

class SettingDialog extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.state = {
            portalUrl: getPortalUrlInSearchParam(),
            shouldSaveAsDefaultExtent: false,
            saveBtnLable: 'Save'
        }

        this.saveSettings = this.saveSettings.bind(this);
        this.portalUrlInputOnChange = this.portalUrlInputOnChange.bind(this);
        this.shouldSaveAsDefaultExtentOnChange = this.shouldSaveAsDefaultExtentOnChange.bind(this);
    }

    portalUrlInputOnChange(evt:React.ChangeEvent<HTMLInputElement>){
        const portalUrl = evt.currentTarget.value;

        this.setState({
            portalUrl
        });
    }

    shouldSaveAsDefaultExtentOnChange(){
        const { shouldSaveAsDefaultExtent } = this.state;
        const newVal = !shouldSaveAsDefaultExtent;

        this.setState({
            shouldSaveAsDefaultExtent: newVal
        }, ()=>{
            console.log('shouldSaveAsDefaultExtent', newVal);
        })
    }

    saveSettings(){
        const { portalUrl, shouldSaveAsDefaultExtent } = this.state;

        if(shouldSaveAsDefaultExtent){
            const mapExt = getMapExtent();
            saveDefaultExtent(mapExt);
        }

        if(portalUrl){
            savePortalUrlInSearchParam(portalUrl);
            window.location.reload();
        }

        this.toggleSaveBtnLabel(true);
    }

    toggleSaveBtnLabel(isSaved=false){
        const newVal = isSaved ? 'Saved' : 'Save';

        this.setState({
            saveBtnLable: newVal
        }, ()=>{

            if(newVal === 'Saved'){
                setTimeout(()=>{
                    this.toggleSaveBtnLabel();
                }, 2000);
            }
        });
    }

    componentDidUpdate(prevProps:IProps){
        const { mapExtent } = this.props;
        
        // turn off shouldSaveAsDefaultExtent every time the map extent changes
        if(mapExtent !== prevProps.mapExtent){
            this.setState({
                shouldSaveAsDefaultExtent: false
            })
        }
    }

    componentDidMount(){
        modal();
    }

    render(){

        const { portalUrl, shouldSaveAsDefaultExtent, saveBtnLable } = this.state;

        const saveBtnClasses = classnames('btn', {
            'btn-disabled': !portalUrl && !shouldSaveAsDefaultExtent ? true : false
        })

        return(
            <div className="js-modal modal-overlay customized-modal" data-modal="setting">
                <div className="modal-content column-8" role="dialog" aria-labelledby="modal">
                
                    <span className="js-modal-toggle cursor-pointer right" aria-label="close-modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 32 32" className="svg-icon"><path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z"/></svg>
                    </span>
                
                    <h2 className='trailer-half text-center trailer-1'>Settings</h2>

                    <div className='trailer-1'>
                        <label>
                            Portal URL:
                            <input type="text" placeholder="ArcGIS Enterprise Portal URL" onChange={this.portalUrlInputOnChange} value={portalUrl}/>
                        </label>
                    </div>

                    <div className='leader-half'>
                        <label className="toggle-switch modifier-class">
                            <input type="checkbox" className="toggle-switch-input" checked={shouldSaveAsDefaultExtent ? true : false} onChange={this.shouldSaveAsDefaultExtentOnChange}/>
                            <span className="toggle-switch-track margin-right-1"></span>
                            <span className="toggle-switch-label font-size--1">Save current map extent as default</span>
                        </label>
                    </div>

                    <div className='text-right'>
                        <span className={saveBtnClasses} onClick={this.saveSettings}>{saveBtnLable}</span>
                    </div>
                </div>
            </div>
        );
    }

};

export default SettingDialog;