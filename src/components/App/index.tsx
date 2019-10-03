import './style.scss';
import * as React from 'react';

import WaybackManager from '../../core/WaybackManager';

import Gutter from '../Gutter';
import Map from '../Map';
import Modal from '../ModalAboutApp';
import ListView from '../ListView';

import { IWaybackItem } from '../../types';

interface IProps {

}

interface IState {
    waybackItems:Array<IWaybackItem>
    shouldOnlyShowItemsWithLocalChange:boolean
}

class App extends React.PureComponent<IProps, IState> {

    private waybackManager = new WaybackManager();

    constructor(props:IProps){
        super(props);

        this.state = {
            waybackItems: [],
            shouldOnlyShowItemsWithLocalChange:false
        }
    }

    async setWaybackItems(waybackItems:Array<IWaybackItem>){
        this.setState({
            waybackItems
        }, ()=>{
            console.log('waybackItems is ready');
        })
    }

    async componentDidMount(){

        try {
            const waybackData2InitApp = await this.waybackManager.init();
            // console.log(waybackData2InitApp);
            this.setWaybackItems(waybackData2InitApp.waybackItems);
            
        } catch(err){
            console.error('failed to get waybackData2InitApp');
        }
    }

    render(){

        const { waybackItems, shouldOnlyShowItemsWithLocalChange } = this.state;

        return(
            <div className='app-content'>
                <Gutter />

                <div className='sidebar'>
                    <ListView 
                        waybackItems={waybackItems}
                        shouldOnlyShowItemsWithLocalChange={shouldOnlyShowItemsWithLocalChange}
                    />
                </div>

                <div className='map-container'>
                    <Map />
                </div>

                <Modal/>
            </div>
        );
    }

};

export default App;