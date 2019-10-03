import './style.scss';
import * as React from 'react';

import { IWaybackItem } from '../../types';

interface IProps {
    data:IWaybackItem
}

interface IState {

}

class ListViewCard extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){

        const { data } = this.props;

        return (
            <div className='list-view-card'>{data.releaseDateLabel}</div>
        );
    }

};

export default ListViewCard;