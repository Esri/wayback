import './style.scss';
import * as React from 'react';

import { IWaybackItem, IStaticTooltipData } from '../../types';

import Card from './Card';
import StaticTooltip from '../StaticTooltip';

interface IProps {
    isMobile:boolean
    waybackItems:Array<IWaybackItem>,
    activeWaybackItem:IWaybackItem,
    shouldOnlyShowItemsWithLocalChange:boolean,
    rNum4SelectedWaybackItems:Array<number>,
    rNum4WaybackItemsWithLocalChanges:Array<number>,
    
    toggleSelect?:(releaseNum:number)=>void
    onClick?:(releaseNum:number)=>void
    onMouseEnter?:(releaseNum:number)=>void
    onMouseOut?:()=>void
}

interface IState {
    tooltipData: IStaticTooltipData 
}

class ListView extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.state = {
            tooltipData: {
                content: '',
                top: 0,
                left:0,
            }
        }

        this.setTooltipData = this.setTooltipData.bind(this)
    }

    setTooltipData(data?:IStaticTooltipData){

        const tooltipData = data ? data : {
            content: '',
            top: 0,
            left:0,
        }

        this.setState({
            tooltipData
        })
    }

    getListViewCards(){
        const { 
            waybackItems, 
            activeWaybackItem, 
            rNum4SelectedWaybackItems, 
            rNum4WaybackItemsWithLocalChanges, 
            shouldOnlyShowItemsWithLocalChange, 
            toggleSelect, 
            onClick,
            onMouseEnter,
            onMouseOut
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
                    onMouseEnter={onMouseEnter}
                    onMouseOut={onMouseOut}
                    toggleTooltip={this.setTooltipData}
                />
            );
        });

        return cards;
    }

    render(){

        const cards = this.getListViewCards();

        // need to use a static tooltip that has the position relative to the window because the list view wrap has the "overflow-y: auto"
        // css property, which make the default tooltip hide by the container. 
        const { tooltipData } = this.state;
        const { isMobile } = this.props;

        const staticTooltip = !isMobile 
            ? <StaticTooltip 
                top={tooltipData.top}
                left={tooltipData.left}
                content={tooltipData.content}
            /> 
            : null;

        return(
            <div>
                <div className='list-view-container'>{cards}</div>
                { staticTooltip }
            </div>
            
        );
    }

};

export default ListView;