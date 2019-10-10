import './style.scss';
import * as React from 'react';
import { IWaybackItem } from '../../types';

interface IProps {
    imageUrl?:string,
    previewWaybackItem?:IWaybackItem,
    topPos?:number,
    leftPos?:number
}

interface IState {

}

class PreviewWindow extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){

        const { previewWaybackItem, imageUrl } = this.props;

        // if( !previewWaybackItem || !imageUrl ){
        //     return null;
        // }

        return (
            <div className="tile-preview-window">
                <img />
                <div className='tile-preview-title'>
                    <div className='margin-left-half trailer-0'><span className='release-date-text val-holder-release-date'></span></div>
                </div>
            </div>
        );
    }

};

export default PreviewWindow;