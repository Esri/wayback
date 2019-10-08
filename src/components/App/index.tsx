import './style.scss';
import * as React from 'react';

import config from '../../config';
import WaybackManager from '../../core/WaybackManager';
import OAuthUtils from '../../utils/Esri-OAuth';
import { encodeSearchParam } from '../../utils/UrlSearchParam';

import Map from '../Map';
import Modal from '../ModalAboutApp';
import ListView from '../ListView';
import MetadataPopUp from '../PopUp';
import SaveAsWebmapBtn from '../SaveAsWebmapBtn';
import SaveAsWebMapDialog from '../SaveAsWebmapDialog';
import CheckboxToggle from '../CheckboxToggle';
import BarChart from '../BarChart';

import { IWaybackItem, IMapPointInfo, IWaybackMetadataQueryResult, IScreenPoint, IExtentGeomety, IUserSession, ISearchParamData } from '../../types';

interface IWaybackItemsReleaseNum2IndexLookup {
    [key:number]:number
};

interface IProps {
    data2InitApp?:ISearchParamData
    isDev?:boolean
}

interface IState {
    waybackItems:Array<IWaybackItem>
    waybackItemsReleaseNum2IndexLookup:IWaybackItemsReleaseNum2IndexLookup
    rNum4SelectedWaybackItems:Array<number>
    activeWaybackItem:IWaybackItem,

    metadataQueryResult:IWaybackMetadataQueryResult,
    metadataAnchorScreenPoint:IScreenPoint,

    mapExtent:IExtentGeomety

    isSaveAsWebmapDialogVisible:boolean
    shouldOnlyShowItemsWithLocalChange:boolean
    userSession:IUserSession
}

class App extends React.PureComponent<IProps, IState> {

    private waybackManager:WaybackManager;
    private oauthUtils:OAuthUtils;

    constructor(props:IProps){
        super(props);

        const { isDev, data2InitApp } = props;

        this.waybackManager = new WaybackManager({isDev});

        this.oauthUtils = new OAuthUtils();

        this.state = {
            waybackItems: [],
            waybackItemsReleaseNum2IndexLookup: null,
            rNum4SelectedWaybackItems: data2InitApp && data2InitApp.rNum4SelectedWaybackItems ? data2InitApp.rNum4SelectedWaybackItems : [],
            activeWaybackItem: null,
            metadataQueryResult:null,
            metadataAnchorScreenPoint:null,
            isSaveAsWebmapDialogVisible: false,
            shouldOnlyShowItemsWithLocalChange: data2InitApp && data2InitApp.shouldOnlyShowItemsWithLocalChange ? data2InitApp.shouldOnlyShowItemsWithLocalChange : false,
            userSession:null,
            mapExtent:null
        }

        this.setActiveWaybackItem = this.setActiveWaybackItem.bind(this);
        this.toggleSelectWaybackItem = this.toggleSelectWaybackItem.bind(this);
        this.queryLocalChanges = this.queryLocalChanges.bind(this);
        this.queryMetadata = this.queryMetadata.bind(this);
        this.setMetadataAnchorScreenPoint = this.setMetadataAnchorScreenPoint.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.unselectAllWaybackItems = this.unselectAllWaybackItems.bind(this);
        this.toggleSaveAsWebmapDialog = this.toggleSaveAsWebmapDialog.bind(this);
        this.setMapExtent = this.setMapExtent.bind(this);
        this.toggleShouldOnlyShowItemsWithLocalChange = this.toggleShouldOnlyShowItemsWithLocalChange.bind(this);
    }

    async setWaybackItems(waybackItems:Array<IWaybackItem>){

        // use the lookup table to quickly locate the wayback item from waybackItems by looking up the release number
        const waybackItemsReleaseNum2IndexLookup = {};

        waybackItems.forEach((d,i)=>{
            const key = d.releaseNum;
            waybackItemsReleaseNum2IndexLookup[key] = i;
        });

        // show the most recent release by default
        const activeWaybackItem = waybackItems[0]

        this.setState({
            waybackItems,
            waybackItemsReleaseNum2IndexLookup,
            activeWaybackItem
        }, ()=>{
            // console.log('waybackItems is ready', activeWaybackItem);
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

    toggleSaveAsWebmapDialog(isVisible?:boolean){
        // console.log('save as web map')
        const { isSaveAsWebmapDialogVisible, userSession } = this.state;

        isVisible = typeof isVisible === 'boolean' ? isVisible : !isSaveAsWebmapDialogVisible;

        if( isVisible && !userSession){
            // sign in first before opening the save as web map dialog because the userSession is required to create web map
            this.oauthUtils.sigIn();
        } else {
            this.setState({
                isSaveAsWebmapDialogVisible: isVisible
            });
        }
    }

    setUserSession(userSession:IUserSession){
        // console.log('setUserSession', userSession);
        this.setState({
            userSession
        });
    }

    setMapExtent(mapExtent:IExtentGeomety){
        // console.log('setMapExtent', mapExtent);
        this.setState({
            mapExtent
        });
    }

    toggleShouldOnlyShowItemsWithLocalChange(){
        const { shouldOnlyShowItemsWithLocalChange } = this.state;

        this.setState({
            shouldOnlyShowItemsWithLocalChange: !shouldOnlyShowItemsWithLocalChange
        });
    }

    async componentDidMount(){

        const { isDev } = this.props;

        try {

            const userSession = await this.oauthUtils.init({
                appId: config.appId,
                portalUrl: isDev ? config.dev["portal-url"] : config.prod["portal-url"]
            });
            this.setUserSession(userSession);

            const waybackData2InitApp = await this.waybackManager.init();
            // console.log(waybackData2InitApp);
            this.setWaybackItems(waybackData2InitApp.waybackItems);
            
        } catch(err){
            console.error('failed to get waybackData2InitApp');
        }
    }

    componentDidUpdate(){
        const { 
            // activeWaybackItem, 
            shouldOnlyShowItemsWithLocalChange,
            rNum4SelectedWaybackItems,
            mapExtent
        } = this.state;

        // let's igonre the activeWaybackItem for now
        encodeSearchParam({
            mapExtent,
            rNum4SelectedWaybackItems,
            // rNum4ActiveWaybackItem: activeWaybackItem ? activeWaybackItem.releaseNum : null,
            shouldOnlyShowItemsWithLocalChange,
        });
    }

    getSidebarContent(){
        const { 
            waybackItems, 
            activeWaybackItem, 
            shouldOnlyShowItemsWithLocalChange, 
            rNum4SelectedWaybackItems,
        } = this.state;

        const appTitle = (
            <div className='content-wrap leader-half trailer-quarter'>
                <div className='app-title-text text-center'>
                    <span className='font-size-2 avenir-light trailer-0'>World Imagery <span className='text-white'>Wayback</span></span>
                </div>
            </div>
        );

        const loadingIndicator = !activeWaybackItem ? (
            <div className="loader is-active padding-leader-1 padding-trailer-1">
                <div className="loader-bars"></div>
            </div>
        ) : null;

        const barChart = activeWaybackItem ? (
            <div className='content-wrap trailer-quarter'>
                <BarChart 
                    waybackItems={waybackItems}
                    activeWaybackItem={activeWaybackItem}
                    shouldOnlyShowItemsWithLocalChange={shouldOnlyShowItemsWithLocalChange}
                />
            </div>
        ) : null;

        const titleForActiveItem = activeWaybackItem ? (
            <div className='content-wrap leader-quarter trailer-quarter'>
                <div className='text-center text-blue'>
                    <h4 className='font-size-2 avenir-light trailer-0'>Wayback {activeWaybackItem.releaseDateLabel}</h4>
                    <span className='font-size--3'>Click map for imagery details</span>
                </div>
            </div>
        ) : null;

        const localChangeOnlyToggle = activeWaybackItem ? (
            <div className='content-wrap trailer-half'>
                <CheckboxToggle 
                    isActive={shouldOnlyShowItemsWithLocalChange} 
                    onChange={this.toggleShouldOnlyShowItemsWithLocalChange} 
                />
            </div>
        ) : null

        const listView = activeWaybackItem ? (
            <div className='y-scroll-visible x-scroll-hide fancy-scrollbar is-flexy'>
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

        ) : null;

        const sidebarContent = (
            <div className='sidebar'>
                { appTitle }
                { loadingIndicator }
                { barChart }
                { titleForActiveItem }
                { localChangeOnlyToggle }
                { listView }
            </div>
        );

        return sidebarContent;
    }

    render(){

        const { data2InitApp } = this.props;

        const { 
            waybackItems, 
            activeWaybackItem, 
            shouldOnlyShowItemsWithLocalChange, 
            metadataQueryResult, 
            metadataAnchorScreenPoint, 
            rNum4SelectedWaybackItems,
            isSaveAsWebmapDialogVisible,
            userSession,
            mapExtent
        } = this.state;

        const defaultExtent = data2InitApp && data2InitApp.mapExtent ? data2InitApp.mapExtent : null;

        const sidebar = this.getSidebarContent();

        return(
            <div className='app-content'>

                <div className='gutter-container'>
                    <div className='gutter-nav-btn text-center shadow-trailer font-size-3'>
                        <span className='icon-ui-description js-modal-toggle' data-modal="about"></span>
                    </div>

                    <SaveAsWebmapBtn 
                        selectedWaybackItems={rNum4SelectedWaybackItems}
                        onClick={this.toggleSaveAsWebmapDialog}
                        clearAll={this.unselectAllWaybackItems}
                    />
                </div>

                { sidebar }

                <div className='map-container'>
                    <Map
                        defaultExtent={defaultExtent}
                        activeWaybackItem={activeWaybackItem}
                        isPopupVisible={ metadataQueryResult ? true : false}

                        onClick={this.queryMetadata}
                        onZoom={this.closePopup}
                        onUpdateEnd={this.queryLocalChanges}
                        popupScreenPointOnChange={this.setMetadataAnchorScreenPoint}
                        onExtentChange={this.setMapExtent}
                    />

                    <MetadataPopUp 
                        metadata={metadataQueryResult}
                        anchorPoint={metadataAnchorScreenPoint}
                        activeWaybackItem={activeWaybackItem}

                        onClose={this.closePopup}
                    />
                </div>

                <SaveAsWebMapDialog 
                    waybackItems={waybackItems}
                    rNum4SelectedWaybackItems={rNum4SelectedWaybackItems}
                    userSession={userSession}
                    isVisible={isSaveAsWebmapDialogVisible}
                    mapExtent={mapExtent}

                    onClose={this.toggleSaveAsWebmapDialog}
                />

                <Modal/>
            </div>
        );
    }

};

export default App;