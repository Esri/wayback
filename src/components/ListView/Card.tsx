import './style.scss';
import * as React from 'react';
import classnames from 'classnames';

import { IWaybackItem, IStaticTooltipData } from '../../types';
import { isDevMode } from '../../utils/Tier';
import config from '../../config';

interface IProps {
    data:IWaybackItem
    isActive:boolean
    isSelected:boolean
    isHighlighted:boolean

    toggleSelect?:(releaseNum:number)=>void
    onClick?:(releaseNum:number)=>void
    onMouseEnter?:(releaseNum:number, shouldShowPreviewItemTitle:boolean)=>void
    onMouseOut?:()=>void
    toggleTooltip?:(data?:IStaticTooltipData)=>void
}

interface IState {

}

class ListViewCard extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.openItem = this.openItem.bind(this);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    openItem(){
        const { data } = this.props;

        const itemId = data.itemID;

        const agolHost = isDevMode() ? config.dev["portal-url"] : config.prod["portal-url"];

        const itemUrl = `${agolHost}/home/item.html?id=${itemId}`;

        window.open(itemUrl, '_blank');
    }

    showTooltip(evt:React.MouseEvent){
        const { toggleTooltip } = this.props;
        const boundingRect = evt.currentTarget.getBoundingClientRect();

        toggleTooltip({
            content: evt.currentTarget.getAttribute('data-tooltip-content'),
            left: boundingRect.left + evt.currentTarget.clientWidth + 5,
            top: boundingRect.top + 3
        });
    }

    hideTooltip(){
        const { toggleTooltip } = this.props;
        toggleTooltip();
    }

    render(){

        const { data, isActive, isSelected, isHighlighted, onClick, onMouseEnter, onMouseOut, toggleSelect } = this.props;

        const cardClass = classnames('list-card trailer-half', {
            // 'is-active' indicates if is viewing this release on map
            'is-active': isActive,
            // 'is-highlighted' indicates if this release has local change
            'is-highlighted': isHighlighted,
            // 'is-selected' indicates if this release is being selected
            'is-selected': isSelected
        });

        const tooltipContentAdd2WebmapBtn = isSelected 
            ? 'Remove this release from your ArcGIS Online Map'
            : 'Add this release to an ArcGIS Online Map'; 

        return (
            <div className={cardClass} onMouseEnter={onMouseEnter.bind(this, data.releaseNum, false)} onMouseLeave={onMouseOut}>
                <a className='margin-left-half link-light-gray cursor-pointer' onClick={onClick.bind(this, data.releaseNum)}>{data.releaseDateLabel}</a>

                <div className='add-to-webmap-btn inline-block cursor-pointer right' onMouseOver={this.showTooltip} onMouseOut={this.hideTooltip} onClick={toggleSelect.bind(this, data.releaseNum)} data-tooltip-content={tooltipContentAdd2WebmapBtn}></div>

                <div className='open-item-btn icon-ui-link-external margin-right-half inline-block cursor-pointer right link-light-gray' onMouseOver={this.showTooltip} onMouseOut={this.hideTooltip} onClick={this.openItem} data-tooltip-content='Learn more about this release...'></div>
            </div>
        );
    }

};

export default ListViewCard;