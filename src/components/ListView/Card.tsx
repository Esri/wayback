import './style.scss';
import * as React from 'react';
import classnames from 'classnames';

import { IWaybackItem } from '../../types';
import { isDevMode } from '../../utils/Tier';
import config from '../../config';

interface IProps {
    data:IWaybackItem
    isActive:boolean
    isSelected:boolean
    isHighlighted:boolean

    toggleSelect?:(releaseNum:number)=>void
    onClick?:(releaseNum:number)=>void
}

interface IState {

}

class ListViewCard extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.openItem = this.openItem.bind(this);
    }

    openItem(){
        const { data } = this.props;

        const itemId = data.itemID;

        const agolHost = isDevMode() ? config.dev["portal-url"] : config.prod["portal-url"];

        const itemUrl = `${agolHost}/home/item.html?id=${itemId}`;

        window.open(itemUrl, '_blank');
    }

    render(){

        const { data, isActive, isSelected, isHighlighted, onClick, toggleSelect } = this.props;

        const cardClass = classnames('list-card trailer-half', {
            // 'is-active' indicates if is viewing this release on map
            'is-active': isActive,
            // 'is-highlighted' indicates if this release has local change
            'is-highlighted': isHighlighted,
            // 'is-selected' indicates if this release is being selected
            'is-selected': isSelected
        });

        return (
            <div className={cardClass}>
                <a className='margin-left-half link-light-gray cursor-pointer' onClick={onClick.bind(this, data.releaseNum)}>{data.releaseDateLabel}</a>

                <div className='add-to-webmap-btn inline-block cursor-pointer right' onClick={toggleSelect.bind(this, data.releaseNum)} data-tooltip-content='Add this release to an ArcGIS Online Map' data-tooltip-content-alt='Remove this release from your ArcGIS Online Map'></div>

                <div className='open-item-btn icon-ui-link-external margin-right-half inline-block cursor-pointer right link-light-gray' onClick={this.openItem} data-tooltip-content='Learn more about this release...'></div>
            </div>
        );
    }

};

export default ListViewCard;