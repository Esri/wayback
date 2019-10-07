import './style.scss';
import * as React from 'react';

import WaybackManager from '../../core/WaybackManager';


import Map from '../Map';
import Modal from '../ModalAboutApp';
import ListView from '../ListView';
import MetadataPopUp from '../PopUp';
import SaveAsWebmapBtn from '../SaveAsWebmapBtn';

import { IWaybackItem, IMapPointInfo, IWaybackMetadataQueryResult, IScreenPoint } from '../../types';

interface IWaybackItemsReleaseNum2IndexLookup {
    [key:number]:number
};

interface IProps {

}

interface IState {
    waybackItems:Array<IWaybackItem>
    waybackItemsReleaseNum2IndexLookup:IWaybackItemsReleaseNum2IndexLookup
    rNum4SelectedWaybackItems:Array<number>
    activeWaybackItem:IWaybackItem,

    metadataQueryResult:IWaybackMetadataQueryResult,
    metadataAnchorScreenPoint:IScreenPoint,

    isSaveAsWebmapDialogVisible:boolean
    shouldOnlyShowItemsWithLocalChange:boolean
}

class App extends React.PureComponent<IProps, IState> {

    private waybackManager = new WaybackManager();

    constructor(props:IProps){
        super(props);

        this.state = {
            waybackItems: [],
            waybackItemsReleaseNum2IndexLookup: null,
            rNum4SelectedWaybackItems: [],
            activeWaybackItem: null,
            metadataQueryResult:null,
            metadataAnchorScreenPoint:null,
            isSaveAsWebmapDialogVisible: false,
            shouldOnlyShowItemsWithLocalChange:false,
        }

        this.setActiveWaybackItem = this.setActiveWaybackItem.bind(this);
        this.toggleSelectWaybackItem = this.toggleSelectWaybackItem.bind(this);
        this.queryLocalChanges = this.queryLocalChanges.bind(this);
        this.queryMetadata = this.queryMetadata.bind(this);
        this.setMetadataAnchorScreenPoint = this.setMetadataAnchorScreenPoint.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.unselectAllWaybackItems = this.unselectAllWaybackItems.bind(this);
        this.saveSelectedWaybackItemsAsWebmap = this.saveSelectedWaybackItemsAsWebmap.bind(this);
    }

    async setWaybackItems(waybackItems:Array<IWaybackItem>){

        // always show the most recent release by default
        const activeWaybackItem = waybackItems[0];

        // use the lookup table to quickly locate the wayback item from waybackItems by looking up the release number
        const waybackItemsReleaseNum2IndexLookup = {};

        waybackItems.forEach((d,i)=>{
            const key = d.releaseNum;
            waybackItemsReleaseNum2IndexLookup[key] = i;
        })

        this.setState({
            waybackItems,
            waybackItemsReleaseNum2IndexLookup,
            activeWaybackItem
        }, ()=>{
            console.log('waybackItems is ready', activeWaybackItem);
        })
    }

    setActiveWaybackItem(releaseNum:number){

        const { waybackItems, waybackItemsReleaseNum2IndexLookup } = this.state;

        const activeWaybackItemIndex = waybackItemsReleaseNum2IndexLookup[releaseNum];

        const activeWaybackItem = waybackItems[activeWaybackItemIndex];

        this.setState({
            activeWaybackItem
        });
    }

    // get list of wayback items that do provide updated imagery for the given location
    async queryLocalChanges(centerPoint:IMapPointInfo){
        // console.log('queryLocalChanges', centerPoint);
    }

    async queryMetadata(pointInfo:IMapPointInfo, screenPoint:IScreenPoint){

        const { activeWaybackItem } = this.state;

        try {
            const queryRes = await this.waybackManager.getMetadata({
                releaseNum: activeWaybackItem.releaseNum,
                pointGeometry: pointInfo.geometry,
                zoom:pointInfo.zoom
            });
    
            this.setState({
                metadataQueryResult: queryRes,
                metadataAnchorScreenPoint: screenPoint
            }, ()=>{
                console.log('queryMetadata result', queryRes);
                console.log('metadataAnchorScreenPoint', screenPoint);
            });

        } catch(err){
            console.error(err);
        }

    }

    setMetadataAnchorScreenPoint(screenPoint:IScreenPoint){
        this.setState({
            metadataAnchorScreenPoint: screenPoint
        });
    }

    closePopup(){
        this.setState({
            metadataQueryResult: null,
            metadataAnchorScreenPoint: null
        });
    }

    toggleSelectWaybackItem(releaseNum:number){
        // console.log(releaseNum);

        const { rNum4SelectedWaybackItems } = this.state;

        const idxForItemToToggle = rNum4SelectedWaybackItems.indexOf(releaseNum);

        let newListOfRNum = [...rNum4SelectedWaybackItems];

        if( idxForItemToToggle > -1){
            // item already in the list, let's remove it
            newListOfRNum.splice(idxForItemToToggle, 1);
        } else {
            // item not found in the list, add it to the selectedWaybackItems
            newListOfRNum.push(releaseNum);
        }

        this.setState({
            rNum4SelectedWaybackItems: newListOfRNum
        });
    }

    unselectAllWaybackItems(){
        this.setState({
            rNum4SelectedWaybackItems: []
        });
    }

    saveSelectedWaybackItemsAsWebmap(){
        console.log('save as web map')
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

        const { waybackItems, activeWaybackItem, shouldOnlyShowItemsWithLocalChange, metadataQueryResult, metadataAnchorScreenPoint, rNum4SelectedWaybackItems } = this.state;

        return(
            <div className='app-content'>

                <div className='gutter-container'>
                    <div className='gutter-nav-btn text-center shadow-trailer font-size-3'>
                        <span className='icon-ui-description js-modal-toggle' data-modal="about"></span>
                    </div>

                    <SaveAsWebmapBtn 
                        selectedWaybackItems={rNum4SelectedWaybackItems}
                        onClick={this.saveSelectedWaybackItemsAsWebmap}
                        clearAll={this.unselectAllWaybackItems}
                    />
                </div>

                <div className='sidebar'>

                    <div className='content-wrap leader-half trailer-half'>
                        <div className='app-title-text text-center'>
                            <span className='font-size-2 avenir-light'>World Imagery <span className='text-white'>Wayback</span></span>
                        </div>
                    </div>

                    <div className='y-scroll-visible x-scroll-hide fancy-scrollbar'>
                        <div className='content-wrap'>
                            <ListView 
                                waybackItems={waybackItems}
                                activeWaybackItem={activeWaybackItem}
                                shouldOnlyShowItemsWithLocalChange={shouldOnlyShowItemsWithLocalChange}
                                rNum4SelectedWaybackItems={rNum4SelectedWaybackItems}

                                onClick={this.setActiveWaybackItem}
                                toggleSelect={this.toggleSelectWaybackItem}
                            />
                        </div>
                    </div>

                </div>

                <div className='map-container'>
                    <Map
                        activeWaybackItem={activeWaybackItem}
                        isPopupVisible={ metadataQueryResult ? true : false}

                        onClick={this.queryMetadata}
                        onZoom={this.closePopup}
                        onUpdateEnd={this.queryLocalChanges}
                        popupScreenPointOnChange={this.setMetadataAnchorScreenPoint}
                    />

                    <MetadataPopUp 
                        metadata={metadataQueryResult}
                        anchorPoint={metadataAnchorScreenPoint}
                        activeWaybackItem={activeWaybackItem}

                        onClose={this.closePopup}
                    />
                </div>

                <Modal/>
            </div>
        );
    }

};

export default App;