import './style.scss';
import * as React from 'react';

import classnames from 'classnames';
import config from '../../app-config';
import WaybackManager from '../../core/WaybackManager';
import OAuthUtils from '../../utils/Esri-OAuth';
import {
    encodeSearchParam,
    getPortalUrlInSearchParam,
} from '../../utils/UrlSearchParam';
import { getServiceUrl } from '../../utils/Tier';
import {
    getDefaultExtent,
    getCustomPortalUrl,
    getShouldShowUpdatesWithLocalChanges,
    setShouldOpenSaveWebMapDialog,
    getShouldOpenSaveWebMapDialog,
} from '../../utils/LocalStorage';

import Map from '../Map';
import AboutThisApp from '../ModalAboutApp';
import ListView from '../ListView';
import MetadataPopUp from '../PopUp';
import SaveAsWebmapBtn from '../SaveAsWebmapBtn';
import SaveAsWebMapDialog from '../SaveAsWebmapDialog';
import CheckboxToggle from '../CheckboxToggle';
import BarChart from '../BarChart';
import Title4ActiveItem from '../Title4ActiveItem';
import TilePreviewWindow from '../PreviewWindow';
import AppTitleText from '../TitleText';
import MobileHeader from '../MobileHeader';
import SidebarToggleBtn from '../SidebarToggleBtn';
import SettingDialog from '../SettingDialog';
import Gutter from '../Gutter';
import ShareDialog from '../ShareDialog';
import SwipeWidget from '../SwipeWidget/SwipeWidget';
import SwipeWidgetToggleBtn from '../SwipeWidgetToggleBtn/SwipeWidgetToggleBtn';
import SwipeWidgetLayerSelector from '../SwipeWidgetLayerSelector/SwipeWidgetLayerSelector'

import {
    IWaybackItem,
    IMapPointInfo,
    IExtentGeomety,
    IUserSession,
    ISearchParamData,
} from '../../types';

interface IWaybackItemsReleaseNum2IndexLookup {
    [key: number]: number;
}

interface IProps {
    data2InitApp?: ISearchParamData;
    // isDev?:boolean
    isMobile?: boolean;
    waybackManager: WaybackManager;
    waybackData2InitApp: {
        waybackItems: Array<IWaybackItem>;
    };
}

interface IState {
    waybackItems: Array<IWaybackItem>;
    waybackItemsReleaseNum2IndexLookup: IWaybackItemsReleaseNum2IndexLookup;
    rNum4SelectedWaybackItems: Array<number>;
    rNum4WaybackItemsWithLocalChanges: Array<number>;
    activeWaybackItem: IWaybackItem;
    previewWaybackItem: IWaybackItem;
    alternativeRNum4RreviewWaybackItem: number;

    mapExtent: IExtentGeomety;

    isSaveAsWebmapDialogVisible: boolean;
    shouldOnlyShowItemsWithLocalChange: boolean;
    shouldShowPreviewItemTitle: boolean;
    userSession: IUserSession;
    isGutterHide: boolean;
    isSideBarHide: boolean;
    isSwipeWidgetOpen: boolean;

    swipeWidgetLeadingLayer: IWaybackItem;
    swipeWidgetTrailingLayer: IWaybackItem;

    currentUrl: string;
}

class App extends React.PureComponent<IProps, IState> {
    // private waybackManager:WaybackManager;
    private oauthUtils: OAuthUtils;

    private delay4TogglePreviewWaybackItem: NodeJS.Timeout;

    constructor(props: IProps) {
        super(props);

        const { data2InitApp, isMobile } = props;

        this.oauthUtils = new OAuthUtils();

        this.state = {
            waybackItems: [],
            waybackItemsReleaseNum2IndexLookup: null,
            rNum4SelectedWaybackItems:
                data2InitApp && data2InitApp.rNum4SelectedWaybackItems
                    ? data2InitApp.rNum4SelectedWaybackItems
                    : [],
            rNum4WaybackItemsWithLocalChanges: [],
            activeWaybackItem: null,
            previewWaybackItem: null,
            alternativeRNum4RreviewWaybackItem: null,
            isSaveAsWebmapDialogVisible: false,
            shouldOnlyShowItemsWithLocalChange:
                data2InitApp && data2InitApp.shouldOnlyShowItemsWithLocalChange
                    ? data2InitApp.shouldOnlyShowItemsWithLocalChange
                    : getShouldShowUpdatesWithLocalChanges(),
            // we want to show the release date in wayback title only when hover over the bar chart
            shouldShowPreviewItemTitle: false,
            userSession: null,
            mapExtent: null,
            isGutterHide: isMobile ? true : false,
            isSideBarHide: false,
            isSwipeWidgetOpen: false,
            swipeWidgetLeadingLayer: null,
            swipeWidgetTrailingLayer: null,
            currentUrl: location.href,
        };

        this.setActiveWaybackItem = this.setActiveWaybackItem.bind(this);
        this.setPreviewWaybackItem = this.setPreviewWaybackItem.bind(this);
        this.toggleSelectWaybackItem = this.toggleSelectWaybackItem.bind(this);
        this.queryLocalChanges = this.queryLocalChanges.bind(this);
        this.unselectAllWaybackItems = this.unselectAllWaybackItems.bind(this);
        this.toggleSaveAsWebmapDialog = this.toggleSaveAsWebmapDialog.bind(
            this
        );
        this.setMapExtent = this.setMapExtent.bind(this);
        this.toggleShouldOnlyShowItemsWithLocalChange = this.toggleShouldOnlyShowItemsWithLocalChange.bind(
            this
        );
        this.toggleIsGutterHide = this.toggleIsGutterHide.bind(this);
        this.toggleIsSideBarHide = this.toggleIsSideBarHide.bind(this);
        this.toggleSignInBtnOnClick = this.toggleSignInBtnOnClick.bind(this);
        this.toggleSwipeWidget = this.toggleSwipeWidget.bind(this);
    }

    async setWaybackItems(waybackItems: Array<IWaybackItem>) {
        // use the lookup table to quickly locate the wayback item from waybackItems by looking up the release number
        const waybackItemsReleaseNum2IndexLookup = {};

        waybackItems.forEach((d, i) => {
            const key = d.releaseNum;
            waybackItemsReleaseNum2IndexLookup[key] = i;
        });

        // show the most recent release by default
        const activeWaybackItem = waybackItems[0];

        this.setState(
            {
                waybackItems,
                waybackItemsReleaseNum2IndexLookup,
                activeWaybackItem,
            },
            () => {
                // console.log('waybackItems is ready', activeWaybackItem);
            }
        );
    }

    setActiveWaybackItem(releaseNum: number) {
        const activeWaybackItem = this.getWaybackItemByReleaseNumber(
            releaseNum
        );

        this.setState({
            activeWaybackItem,
        });
    }

    setPreviewWaybackItem(
        releaseNum?: number,
        shouldShowPreviewItemTitle?: boolean
    ) {
        const { mapExtent } = this.state;
        const { isMobile } = this.props;

        if (mapExtent && !isMobile) {
            clearTimeout(this.delay4TogglePreviewWaybackItem);

            this.delay4TogglePreviewWaybackItem = global.setTimeout(() => {
                const previewWaybackItem = releaseNum
                    ? this.getWaybackItemByReleaseNumber(releaseNum)
                    : null;

                const alternativeRNum4RreviewWaybackItem = releaseNum
                    ? this.getAlternativeReleaseNumber(releaseNum)
                    : null;

                shouldShowPreviewItemTitle =
                    shouldShowPreviewItemTitle || false;

                this.setState({
                    previewWaybackItem,
                    shouldShowPreviewItemTitle,
                    alternativeRNum4RreviewWaybackItem,
                });
            }, 200);
        }
    }

    // for wayback item, if that release doesn't have any changes for the given area, then it will use the tile from previous release instead
    // therefore we need to find the alternative release number to make sure we have the tile image to display in the preview window for each release
    getAlternativeReleaseNumber(rNum: number) {
        const { waybackItems, rNum4WaybackItemsWithLocalChanges } = this.state;

        if (rNum4WaybackItemsWithLocalChanges.indexOf(rNum) > -1) {
            return rNum;
        }

        // getting a list of release numbers ordered by release dates (desc) that only includes release has changes for the given area and the input release number,
        // in this case, we are sure the release number next to the input release number in this list must be the item does come with changes, or a legit tile image
        const rNums = waybackItems
            .filter((d) => {
                const hasLocalChange =
                    rNum4WaybackItemsWithLocalChanges.indexOf(d.releaseNum) >
                    -1;
                return hasLocalChange || d.releaseNum === rNum;
            })
            .map((d) => d.releaseNum);

        const indexOfInputRNum = rNums.indexOf(rNum);

        return rNums[indexOfInputRNum + 1] || rNum;
    }

    setRNum4WaybackItemsWithLocalChanges(
        rNum4WaybackItemsWithLocalChanges?: number[]
    ) {
        this.setState({
            rNum4WaybackItemsWithLocalChanges:
                rNum4WaybackItemsWithLocalChanges || [],
        });
    }

    // get list of wayback items that do provide updated imagery for the given location
    async queryLocalChanges(centerPointInfo: IMapPointInfo) {
        // console.log('queryLocalChanges', centerPointInfo);

        const { waybackManager } = this.props;

        try {
            const rNums = await waybackManager.getLocalChanges(centerPointInfo);
            // console.log(rNums);

            this.setRNum4WaybackItemsWithLocalChanges(rNums);
        } catch (err) {
            console.error('failed to query local changes', err);
            this.setRNum4WaybackItemsWithLocalChanges();
        }
    }

    toggleSelectWaybackItem(releaseNum: number) {
        // console.log(releaseNum);

        const { rNum4SelectedWaybackItems } = this.state;

        const idxForItemToToggle = rNum4SelectedWaybackItems.indexOf(
            releaseNum
        );

        const newListOfRNum = [...rNum4SelectedWaybackItems];

        if (idxForItemToToggle > -1) {
            // item already in the list, let's remove it
            newListOfRNum.splice(idxForItemToToggle, 1);
        } else {
            // item not found in the list, add it to the selectedWaybackItems
            newListOfRNum.push(releaseNum);
        }

        this.setState({
            rNum4SelectedWaybackItems: newListOfRNum,
        });
    }

    unselectAllWaybackItems() {
        this.setState({
            rNum4SelectedWaybackItems: [],
        });
    }

    setUserSession(userSession: IUserSession) {
        // console.log('setUserSession', userSession);
        this.setState({
            userSession,
        });
    }

    setMapExtent(mapExtent: IExtentGeomety) {
        // console.log('setMapExtent', mapExtent);
        this.setState({
            mapExtent,
        });
    }

    toggleShouldOnlyShowItemsWithLocalChange(val?: boolean) {
        const { shouldOnlyShowItemsWithLocalChange } = this.state;

        const newVal =
            typeof val === 'boolean'
                ? val
                : !shouldOnlyShowItemsWithLocalChange;

        this.setState({
            shouldOnlyShowItemsWithLocalChange: newVal,
        });
    }

    toggleIsGutterHide() {
        const { isGutterHide } = this.state;

        this.setState({
            isGutterHide: !isGutterHide,
        });
    }

    toggleIsSideBarHide() {
        const { isSideBarHide } = this.state;

        this.setState({
            isSideBarHide: !isSideBarHide,
        });
    }

    getWaybackItemByReleaseNumber(releaseNum: number) {
        const { waybackItems, waybackItemsReleaseNum2IndexLookup } = this.state;
        const index = waybackItemsReleaseNum2IndexLookup[releaseNum];
        return waybackItems[index];
    }

    toggleSaveAsWebmapDialog(isVisible?: boolean) {
        // console.log('toggleSaveAsWebmapDialog', isVisible);
        const { isSaveAsWebmapDialogVisible, userSession } = this.state;

        isVisible =
            typeof isVisible === 'boolean'
                ? isVisible
                : !isSaveAsWebmapDialogVisible;

        if (isVisible && !userSession) {
            // set the ShouldOpenSaveWebMapDialog flag in local storage as true, when the app knows to open the dialog after user is signed in
            setShouldOpenSaveWebMapDialog();

            // sign in first before opening the save as web map dialog because the userSession is required to create web map
            this.oauthUtils.sigIn();
        } else {
            this.setState({
                isSaveAsWebmapDialogVisible: isVisible,
            });
        }
    }

    toggleSwipeWidget(){

        const { isSwipeWidgetOpen } = this.state;

        this.setState({
            isSwipeWidgetOpen: !isSwipeWidgetOpen
        });
    }

    toggleSignInBtnOnClick(shouldSignIn?: boolean) {
        const { oauthUtils } = this;

        if (shouldSignIn) {
            oauthUtils.sigIn();
        } else {
            oauthUtils.signOut();
        }
    }

    updateUrlSearchParams() {
        const {
            // activeWaybackItem,
            shouldOnlyShowItemsWithLocalChange,
            rNum4SelectedWaybackItems,
            mapExtent,
        } = this.state;

        // let's igonre the activeWaybackItem for now
        encodeSearchParam({
            mapExtent,
            rNum4SelectedWaybackItems,
            // rNum4ActiveWaybackItem: activeWaybackItem ? activeWaybackItem.releaseNum : null,
            shouldOnlyShowItemsWithLocalChange,
        });

        this.setState({
            currentUrl: location.href,
        });
    }

    // getTargetLayerForMetadataPopup(){
    //     const { 
    //         isSwipeWidgetOpen, 
    //         activeWaybackItem,
    //         swipeWidgetLeadingLayer,
    //         swipeWidgetTrailingLayer
    //     } = this.state;

    //     if(!isSwipeWidgetOpen){
    //         return activeWaybackItem
    //     }

    //     return swipeWidgetLeadingLayer
    // }

    getSidebarContent() {
        const { isMobile } = this.props;

        const {
            waybackItems,
            activeWaybackItem,
            previewWaybackItem,
            shouldShowPreviewItemTitle,
            shouldOnlyShowItemsWithLocalChange,
            rNum4SelectedWaybackItems,
            rNum4WaybackItemsWithLocalChanges,
            isSideBarHide,
            isSwipeWidgetOpen
        } = this.state;

        if(isSwipeWidgetOpen){
            return null;
        }

        const sidebarClasses = classnames('sidebar', {
            'is-hide': isSideBarHide,
        });

        const appTitle = !isMobile ? (
            <div className="content-wrap leader-half trailer-quarter">
                <AppTitleText />
            </div>
        ) : null;

        const sidebarToggleBtn = isMobile ? (
            <SidebarToggleBtn
                isSideBarHide={isSideBarHide}
                onClick={this.toggleIsSideBarHide}
            />
        ) : null;

        const loadingIndicator =
            !activeWaybackItem && !isSideBarHide ? (
                <div className="loader is-active padding-leader-1 padding-trailer-1">
                    <div className="loader-bars"></div>
                </div>
            ) : null;

        const barChart =
            !isMobile && activeWaybackItem && !isSideBarHide ? (
                <div className="content-wrap trailer-quarter">
                    <BarChart
                        waybackItems={waybackItems}
                        activeWaybackItem={activeWaybackItem}
                        rNum4WaybackItemsWithLocalChanges={
                            rNum4WaybackItemsWithLocalChanges
                        }
                        shouldOnlyShowItemsWithLocalChange={
                            shouldOnlyShowItemsWithLocalChange
                        }
                        onClick={this.setActiveWaybackItem}
                        onMouseEnter={this.setPreviewWaybackItem}
                        onMouseOut={this.setPreviewWaybackItem}
                    />
                </div>
            ) : null;

        const titleForActiveItem = activeWaybackItem ? (
            <div className="content-wrap leader-quarter trailer-quarter">
                <Title4ActiveItem
                    isMobile={isMobile}
                    activeWaybackItem={activeWaybackItem}
                    previewWaybackItem={previewWaybackItem}
                    shouldShowPreviewItemTitle={shouldShowPreviewItemTitle}
                />
            </div>
        ) : null;

        const localChangeOnlyToggle =
            activeWaybackItem && !isSideBarHide ? (
                <div className="content-wrap trailer-half">
                    <CheckboxToggle
                        isActive={shouldOnlyShowItemsWithLocalChange}
                        onChange={this.toggleShouldOnlyShowItemsWithLocalChange}
                    />
                </div>
            ) : null;

        const listView =
            activeWaybackItem && !isSideBarHide ? (
                <div className="y-scroll-visible x-scroll-hide fancy-scrollbar is-flexy">
                    <div className="content-wrap">
                        <ListView
                            isMobile={isMobile}
                            waybackItems={waybackItems}
                            activeWaybackItem={activeWaybackItem}
                            shouldOnlyShowItemsWithLocalChange={
                                shouldOnlyShowItemsWithLocalChange
                            }
                            rNum4SelectedWaybackItems={
                                rNum4SelectedWaybackItems
                            }
                            rNum4WaybackItemsWithLocalChanges={
                                rNum4WaybackItemsWithLocalChanges
                            }
                            onClick={this.setActiveWaybackItem}
                            onMouseEnter={this.setPreviewWaybackItem}
                            onMouseOut={this.setPreviewWaybackItem}
                            toggleSelect={this.toggleSelectWaybackItem}
                        />
                    </div>
                </div>
            ) : null;

        const sidebarContent = (
            <div className={sidebarClasses}>
                {sidebarToggleBtn}
                {appTitle}
                {loadingIndicator}
                {barChart}
                {titleForActiveItem}
                {localChangeOnlyToggle}
                {listView}
            </div>
        );

        return sidebarContent;
    }

    render() {
        const { data2InitApp, waybackManager, isMobile } = this.props;

        const {
            waybackItems,
            activeWaybackItem,
            previewWaybackItem,
            rNum4SelectedWaybackItems,
            rNum4WaybackItemsWithLocalChanges,
            isSaveAsWebmapDialogVisible,
            userSession,
            mapExtent,
            alternativeRNum4RreviewWaybackItem,
            isGutterHide,
            currentUrl,
            isSwipeWidgetOpen
        } = this.state;

        const defaultExtentFromUrl =
            data2InitApp && data2InitApp.mapExtent
                ? data2InitApp.mapExtent
                : null;
        const defaultExtentFromLocalStorage = getDefaultExtent();

        const sidebar = this.getSidebarContent();

        const appContentClasses = classnames('app-content', {
            'is-mobile': isMobile,
            'is-gutter-hide': isGutterHide,
        });

        const mobileHeader = isMobile ? (
            <MobileHeader
                isGutterHide={isGutterHide}
                leftNavBtnOnClick={this.toggleIsGutterHide}
            />
        ) : null;

        return (
            <div className={appContentClasses}>
                {mobileHeader}

                <Gutter
                    settingsBtnDisabled={isSwipeWidgetOpen}
                >
                    <SaveAsWebmapBtn
                        selectedWaybackItems={rNum4SelectedWaybackItems}
                        disabled={isSwipeWidgetOpen}
                        onClick={this.toggleSaveAsWebmapDialog}
                        clearAll={this.unselectAllWaybackItems}
                    />

                    <SwipeWidgetToggleBtn 
                        isOpen={isSwipeWidgetOpen}
                        marginTop={rNum4SelectedWaybackItems.length ? '1rem' : 'unset'}
                        onClickHandler={this.toggleSwipeWidget}
                    />
                </Gutter>

                {sidebar}

                <div 
                    className={classnames('map-container', {
                        'is-swipe-layer-selectors-open': isSwipeWidgetOpen
                    })}
                >
  
                    <Map
                        defaultExtent={
                            defaultExtentFromUrl || defaultExtentFromLocalStorage
                        }
                        activeWaybackItem={activeWaybackItem}
                        isSwipeWidgetOpen={isSwipeWidgetOpen}
                        onUpdateEnd={this.queryLocalChanges}
                        onExtentChange={this.setMapExtent}
                    >
                        <TilePreviewWindow
                            // no need to show preview window in mobile view, therefore just pass the null as previewWaybackItem
                            previewWaybackItem={
                                !isMobile ? previewWaybackItem : null
                            }
                            alternativeRNum4RreviewWaybackItem={
                                alternativeRNum4RreviewWaybackItem
                            }
                        />

                        <MetadataPopUp
                            // disabled={isSwipeWidgetOpen}
                            waybackManager={waybackManager}
                            targetLayer={activeWaybackItem}
                            previewWaybackItem={previewWaybackItem}
                        />

                        <SwipeWidget 
                            waybackItem4LeadingLayer={this.state.swipeWidgetLeadingLayer}
                            waybackItem4TrailingLayer={this.state.swipeWidgetTrailingLayer}
                            isOpen={isSwipeWidgetOpen}
                        />
                    </Map>

                    { 
                        isSwipeWidgetOpen ? (
                            <>
                                <SwipeWidgetLayerSelector 
                                    key='leading'
                                    targetLayerType='leading' 
                                    waybackItems={waybackItems}
                                    rNum4WaybackItemsWithLocalChanges={
                                        rNum4WaybackItemsWithLocalChanges
                                    }
                                    selectedItem={this.state.swipeWidgetLeadingLayer}
                                    onSelect={(waybackItem)=>{
                                        this.setState({
                                            swipeWidgetLeadingLayer: waybackItem
                                        })
                                    }}
                                />

                                <SwipeWidgetLayerSelector 
                                    key='trailing'
                                    targetLayerType='trailing' 
                                    waybackItems={waybackItems}
                                    rNum4WaybackItemsWithLocalChanges={
                                        rNum4WaybackItemsWithLocalChanges
                                    }
                                    selectedItem={this.state.swipeWidgetTrailingLayer}
                                    onSelect={(waybackItem)=>{
                                        this.setState({
                                            swipeWidgetTrailingLayer: waybackItem
                                        })
                                    }}
                                />
                            </>
                        ) : null
                    }

                </div>


                <SaveAsWebMapDialog
                    waybackItems={waybackItems}
                    rNum4SelectedWaybackItems={rNum4SelectedWaybackItems}
                    userSession={userSession}
                    isVisible={isSaveAsWebmapDialogVisible}
                    mapExtent={mapExtent}
                    onClose={this.toggleSaveAsWebmapDialog}
                />

                <SettingDialog
                    mapExtent={mapExtent}
                    userSession={userSession}
                    toggleSignInBtnOnClick={this.toggleSignInBtnOnClick}
                    shouldShowLocalChangesByDefaultOnClick={
                        this.toggleShouldOnlyShowItemsWithLocalChange
                    }
                />

                <ShareDialog currentUrl={currentUrl} />

                <AboutThisApp />
            </div>
        );
    }

    async componentDidMount() {
        const { waybackData2InitApp } = this.props;

        const arcgisPortal = getServiceUrl('portal-url');

        // const customizedPortal = getPortalUrlInSearchParam(); //'https://rags19003.ags.esri.com/portal';
        const customizedPortal = getCustomPortalUrl();
        // console.log(customizedPortal)

        try {
            // please note the appId used here only works for apps hosted under *.arcgis.com domain
            // need to switch to using appropriate appId if the app will be hosted under different domain
            const userSession = await this.oauthUtils.init({
                appId: config.appId,
                portalUrl: customizedPortal || arcgisPortal,
            });
            this.setUserSession(userSession);
            console.log(userSession);

            // const waybackData2InitApp = await this.waybackManager.init();
            // console.log(waybackData2InitApp);
            this.setWaybackItems(waybackData2InitApp.waybackItems);

            if (getShouldOpenSaveWebMapDialog() && userSession) {
                this.toggleSaveAsWebmapDialog(true);
            }
        } catch (err) {
            console.error('failed to get waybackData2InitApp');
        }
    }

    componentDidUpdate() {
        this.updateUrlSearchParams();
    }
}

export default App;
