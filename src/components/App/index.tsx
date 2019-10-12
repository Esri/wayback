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
import Title4ActiveItem from '../Title4ActiveItem';
import TilePreviewWindow from '../PreviewWindow';

import { IWaybackItem, IMapPointInfo, IExtentGeomety, IUserSession, ISearchParamData } from '../../types';

interface IWaybackItemsReleaseNum2IndexLookup {
    [key:number]:number
};

interface IProps {
    data2InitApp?:ISearchParamData
    isDev?:boolean
    waybackManager:WaybackManager
    waybackData2InitApp: {
        waybackItems:Array<IWaybackItem>
    }
}

interface IState {
    waybackItems:Array<IWaybackItem>
    waybackItemsReleaseNum2IndexLookup:IWaybackItemsReleaseNum2IndexLookup
    rNum4SelectedWaybackItems:Array<number>
    rNum4WaybackItemsWithLocalChanges:Array<number>
    activeWaybackItem:IWaybackItem,
    previewWaybackItem:IWaybackItem,
    alternativeRNum4RreviewWaybackItem:number

    mapExtent:IExtentGeomety

    isSaveAsWebmapDialogVisible:boolean
    shouldOnlyShowItemsWithLocalChange:boolean
    shouldShowPreviewItemTitle:boolean
    userSession:IUserSession
}

class App extends React.PureComponent<IProps, IState> {

    // private waybackManager:WaybackManager;
    private oauthUtils:OAuthUtils;

    private delay4TogglePreviewWaybackItem:NodeJS.Timeout

    constructor(props:IProps){
        super(props);

        const { data2InitApp } = props;

        // this.waybackManager = new WaybackManager({isDev});

        this.oauthUtils = new OAuthUtils();

        this.state = {
            waybackItems: [],
            waybackItemsReleaseNum2IndexLookup: null,
            rNum4SelectedWaybackItems: data2InitApp && data2InitApp.rNum4SelectedWaybackItems ? data2InitApp.rNum4SelectedWaybackItems : [],
            rNum4WaybackItemsWithLocalChanges: [],
            activeWaybackItem: null,
            previewWaybackItem: null,
            alternativeRNum4RreviewWaybackItem:null,
            isSaveAsWebmapDialogVisible: false,
            shouldOnlyShowItemsWithLocalChange: data2InitApp && data2InitApp.shouldOnlyShowItemsWithLocalChange ? data2InitApp.shouldOnlyShowItemsWithLocalChange : false,
            // we want to show the release date in wayback title only when hover over the bar chart
            shouldShowPreviewItemTitle:false,
            userSession:null,
            mapExtent:null
        }

        this.setActiveWaybackItem = this.setActiveWaybackItem.bind(this);
        this.setPreviewWaybackItem = this.setPreviewWaybackItem.bind(this);
        this.toggleSelectWaybackItem = this.toggleSelectWaybackItem.bind(this);
        this.queryLocalChanges = this.queryLocalChanges.bind(this);
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

        const activeWaybackItem = this.getWaybackItemByReleaseNumber(releaseNum);

        this.setState({
            activeWaybackItem
        });
    }

    setPreviewWaybackItem(releaseNum?:number, shouldShowPreviewItemTitle?:boolean){

        clearTimeout(this.delay4TogglePreviewWaybackItem);

        this.delay4TogglePreviewWaybackItem = global.setTimeout(()=>{

            const previewWaybackItem = releaseNum ? this.getWaybackItemByReleaseNumber(releaseNum) : null;

            const alternativeRNum4RreviewWaybackItem = releaseNum ? this.getAlternativeReleaseNumber(releaseNum) : null;
    
            shouldShowPreviewItemTitle = shouldShowPreviewItemTitle || false;
    
            this.setState({
                previewWaybackItem,
                shouldShowPreviewItemTitle,
                alternativeRNum4RreviewWaybackItem
            });

        }, 200);

    }

    // for wayback item, if that release doesn't have any changes for the given area, then it will use the tile from previous release instead
    // therefore we need to find the alternative release number to make sure we have the tile image to display in the preview window for each release
    getAlternativeReleaseNumber(rNum:number){
        const { waybackItems, rNum4WaybackItemsWithLocalChanges } = this.state;

        if(rNum4WaybackItemsWithLocalChanges.indexOf(rNum) > -1){
            return rNum;
        }

        // getting a list of release numbers ordered by release dates (desc) that only includes release has changes for the given area and the input release number,
        // in this case, we are sure the release number next to the input release number in this list must be the item does come with changes, or a legit tile image
        const rNums = waybackItems
            .filter(d=>{
                const hasLocalChange = rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) > -1;
                return hasLocalChange || d.releaseNum === rNum;
            })
            .map(d=>d.releaseNum);

        const indexOfInputRNum = rNums.indexOf(rNum);

        return rNums[indexOfInputRNum + 1] || rNum;
    }

    setRNum4WaybackItemsWithLocalChanges(rNum4WaybackItemsWithLocalChanges?:number[]){
        this.setState({
            rNum4WaybackItemsWithLocalChanges: rNum4WaybackItemsWithLocalChanges || []
        });
    }

    // get list of wayback items that do provide updated imagery for the given location
    async queryLocalChanges(centerPointInfo:IMapPointInfo){
        // console.log('queryLocalChanges', centerPointInfo);

        const { waybackManager } = this.props;

        try { 
            const rNums = await waybackManager.getLocalChanges(centerPointInfo);
            // console.log(rNums);

            this.setRNum4WaybackItemsWithLocalChanges(rNums);

        } catch(err){
            console.error('failed to query local changes', err);
            this.setRNum4WaybackItemsWithLocalChanges();
        }
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

    
    getWaybackItemByReleaseNumber(releaseNum:number){
        const { waybackItems, waybackItemsReleaseNum2IndexLookup } = this.state;
        const index = waybackItemsReleaseNum2IndexLookup[releaseNum];
        return waybackItems[index];
    }

    async componentDidMount(){

        const { isDev, waybackData2InitApp } = this.props;

        try {

            const userSession = await this.oauthUtils.init({
                appId: config.appId,
                portalUrl: isDev ? config.dev["portal-url"] : config.prod["portal-url"]
            });
            this.setUserSession(userSession);

            // const waybackData2InitApp = await this.waybackManager.init();
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
            previewWaybackItem,
            shouldShowPreviewItemTitle,
            shouldOnlyShowItemsWithLocalChange, 
            rNum4SelectedWaybackItems,
            rNum4WaybackItemsWithLocalChanges
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
                    rNum4WaybackItemsWithLocalChanges={rNum4WaybackItemsWithLocalChanges}
                    shouldOnlyShowItemsWithLocalChange={shouldOnlyShowItemsWithLocalChange}
                    onClick={this.setActiveWaybackItem}
                    onMouseEnter={this.setPreviewWaybackItem}
                    onMouseOut={this.setPreviewWaybackItem}
                />
            </div>
        ) : null;

        const titleForActiveItem = activeWaybackItem ? (
            <div className='content-wrap leader-quarter trailer-quarter'>
                <Title4ActiveItem 
                    activeWaybackItem={activeWaybackItem}
                    previewWaybackItem={previewWaybackItem}
                    shouldShowPreviewItemTitle={shouldShowPreviewItemTitle}
                />
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
                        rNum4WaybackItemsWithLocalChanges={rNum4WaybackItemsWithLocalChanges}

                        onClick={this.setActiveWaybackItem}
                        onMouseEnter={this.setPreviewWaybackItem}
                        onMouseOut={this.setPreviewWaybackItem}
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

        const { data2InitApp, waybackManager } = this.props;

        const { 
            waybackItems, 
            activeWaybackItem, 
            previewWaybackItem,
            rNum4SelectedWaybackItems,
            isSaveAsWebmapDialogVisible,
            userSession,
            mapExtent,
            alternativeRNum4RreviewWaybackItem
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

                <Map
                    defaultExtent={defaultExtent}
                    activeWaybackItem={activeWaybackItem}

                    onUpdateEnd={this.queryLocalChanges}
                    onExtentChange={this.setMapExtent}
                >
                    <TilePreviewWindow
                        previewWaybackItem={previewWaybackItem}
                        alternativeRNum4RreviewWaybackItem={alternativeRNum4RreviewWaybackItem}
                    />

                    <MetadataPopUp 
                        waybackManager={waybackManager}
                        activeWaybackItem={activeWaybackItem}
                        previewWaybackItem={previewWaybackItem}
                    />
                </Map>

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