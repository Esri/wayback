import './style.scss';
import * as React from 'react';

import { IWaybackItem } from '../../types';

import Card from './Card';

interface IProps {
    waybackItems:Array<IWaybackItem>,
    shouldOnlyShowItemsWithLocalChange:boolean,
    
    onSelect?:(releaseNum:number)=>void
}

interface IState {

}

class ListView extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    getListViewCards(){
        const { waybackItems } = this.props;
        
        const cards = waybackItems.map((d, i)=>{
            return (
                <Card 
                    key={`list-view-card-${i}`} 
                    data={d} 
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