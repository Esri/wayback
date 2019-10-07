import './style.scss';
import * as React from 'react';
import classNames from 'classnames'

import { IWaybackItem } from '../../types';

interface IProps {
    selectedWaybackItems:Array<number>,

    onClick?:()=>void
    clearAll?:()=>void
}

interface IState {

}

class SaveAsWebmapBtn extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){

        const { selectedWaybackItems, onClick, clearAll } = this.props;

        const isActive = selectedWaybackItems.length ? true : false;

        const btnClass = classNames('gutter-nav-btn create-agol-webmap', {
            'is-active': isActive
        });

        const clearBtn = isActive 
            ? ( <div className='font-size--4 text-center cursor-pointer leader-quarter' onClick={clearAll.bind(this)}>clear all</div> ) 
            : null;

        return(
            <div className='save-as-webmap-btn-container'>
                <div className={btnClass} onClick={onClick.bind(this)} data-tooltip-content='Choose updates from the list to build a set of Wayback layers for use in a new Web Map' data-tooltip-content-alt='Open these updates in a new Web Map'>
                    <div className='overlay-label text-white text-center'>
                        <span className='val-holder-count-of-selected-items'>{selectedWaybackItems.length}</span>
                    </div>
                </div>
                { clearBtn }
            </div>
        );
    }

};

export default SaveAsWebmapBtn;