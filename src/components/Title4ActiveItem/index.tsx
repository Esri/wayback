import * as React from 'react';

import { IWaybackItem } from '../../types';

interface IProps {
    activeWaybackItem:IWaybackItem
    previewWaybackItem:IWaybackItem
    shouldShowPreviewItemTitle:boolean
}

interface IState {

}

class Title4ActiveItem extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){

        const { activeWaybackItem, previewWaybackItem, shouldShowPreviewItemTitle } = this.props;

        const releaseDate = shouldShowPreviewItemTitle ? previewWaybackItem.releaseDateLabel : activeWaybackItem.releaseDateLabel;

        return(
            <div className='text-center text-blue'>
                <h4 className='font-size-2 avenir-light trailer-0'>Wayback {releaseDate}</h4>
                <span className='font-size--3'>Click map for imagery details</span>
            </div>
        );
    }

};

export default Title4ActiveItem;