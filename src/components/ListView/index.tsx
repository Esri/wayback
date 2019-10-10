import './style.scss';
import * as React from 'react';

import { IWaybackItem } from '../../types';

import Card from './Card';

interface IProps {
    waybackItems:Array<IWaybackItem>,
    activeWaybackItem:IWaybackItem,
    shouldOnlyShowItemsWithLocalChange:boolean,
    rNum4SelectedWaybackItems:Array<number>,
    rNum4WaybackItemsWithLocalChanges:Array<number>,
    
    toggleSelect?:(releaseNum:number)=>void
    onClick?:(releaseNum:number)=>void
}

interface IState {

}

class ListView extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    getListViewCards(){
        const { 
            waybackItems, 
            activeWaybackItem, 
            rNum4SelectedWaybackItems, 
            rNum4WaybackItemsWithLocalChanges, 
            shouldOnlyShowItemsWithLocalChange, 
            toggleSelect, 
            onClick 
        } = this.props;

        const cardData = shouldOnlyShowItemsWithLocalChange 
            ? waybackItems.filter(d=>{
                return rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) > -1
            })
            : waybackItems;
        
        const cards = cardData.map((d, i)=>{

            const isActive = ( activeWaybackItem.releaseNum === d.releaseNum ) ? true : false;
            const isSelected = rNum4SelectedWaybackItems.indexOf(d.releaseNum) > -1 ? true : false;
            const isHighlighted = rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) > -1 ? true : false;

            return (
                <Card 
                    key={`list-view-card-${i}`} 
                    data={d} 
                    isActive={isActive}
                    isSelected={isSelected}
                    isHighlighted={isHighlighted}
                    toggleSelect={toggleSelect}
                    onClick={onClick}
                />
            );
        });

        return cards;
    }

    render(){

        const cards = this.getListViewCards();

        return(
            <div className='list-view-container'>{cards}</div>
        );
    }

};

export default ListView;