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

        const { previewWaybackItem, imageUrl, topPos, leftPos } = this.props;

        if( !previewWaybackItem || !imageUrl ){
            return null;
        }

        const style = {
            position: 'absolute',
            top: topPos,
            left: leftPos
        } as React.CSSProperties

        return (
            <div className="tile-preview-window" style={style}>
                <img src={imageUrl}/>
                <div className='tile-preview-title'>
                    <div className='margin-left-half trailer-0'>
                        <span className='release-date-text'>{previewWaybackItem.releaseDateLabel}</span>
                    </div>
                </div>
            </div>
        );
    }

};

export default PreviewWindow;