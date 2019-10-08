import './style.scss';
import * as React from 'react';

import { dateFns } from 'helper-toolkit-ts';
import { IWaybackMetadataQueryResult, IScreenPoint, IWaybackItem } from '../../types';

interface IProps {
    metadata: IWaybackMetadataQueryResult
    anchorPoint: IScreenPoint
    activeWaybackItem:IWaybackItem,

    onClose:()=>void
}

interface IState {

}

class PopUp extends React.PureComponent<IProps, IState> {

    private readonly Width = 360;
    private readonly PositionOffset = 22.5;

    constructor(props:IProps){
        super(props);
    }

    formatMetadataDate(){
        const { metadata } = this.props;
        const { date } = metadata;

        const metadataDate = new Date(date);

        const year = metadataDate.getFullYear();
        const month = dateFns.getMonthName(metadataDate.getMonth(), true);
        const day = metadataDate.getDate();

        return `${month} ${day}, ${year}`;
    }

    render(){

        const { anchorPoint, metadata, activeWaybackItem, onClose } = this.props;

        if(!metadata || !anchorPoint){
            return null;
        }

        const containerStyle = {
            position: 'absolute',
            top: anchorPoint.y - this.PositionOffset,
            left: anchorPoint.x - this.PositionOffset,
            width: this.Width
        } as React.CSSProperties;

        const { provider, source, resolution, accuracy, date } = metadata;

        const releaseData = activeWaybackItem.releaseDateLabel;
        const formattedDate = this.formatMetadataDate();

        return(
            <div className='popup-container' style={containerStyle}>
                <div className='reticle-wrap'></div>

                <div className='content-wrap text-white'>
                    <div className='text-wrap'>
                        <p className='trailer-half'>{provider} ({source}) image captured on <b>{formattedDate}</b> as shown in the <b>{releaseData}</b> version of the World Imagery map.</p>
                        <p className='trailer-half'><b>Resolution</b>: Pixels in the source image<br/>represent a ground distance of <b>{+resolution.toFixed(2)} meters</b>.</p>
                        <p className='trailer-0'><b>Accuracy</b>: Objects displayed in this image<br/>are within <b>{+accuracy.toFixed(2)} meters</b> of true location.</p>
                    </div>

                    <div className='close-btn text-white text-center cursor-pointer' onClick={onClose}>
                        <span className='icon-ui-close'></span>
                    </div>
                </div>
            </div>

        );
    }

};

export default PopUp;