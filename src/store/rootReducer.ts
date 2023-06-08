import { combineReducers } from 'redux';
import UI from './UI/reducer';
import Map from './Map/reducer';
import SwipeView from './Swipe/reducer';
import WaybackItems from './Wayback/reducer';
import AnimationMode from './AnimationMode/reducer';
import DownloadMode from './DownloadMode/reducer';

export default combineReducers({
    UI,
    Map,
    SwipeView,
    WaybackItems,
    AnimationMode,
    DownloadMode,
});
