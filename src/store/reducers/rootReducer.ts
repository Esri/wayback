import { combineReducers } from 'redux';
import UI from './UI';
import Map from './Map';
import SwipeView from './SwipeView';
import WaybackItems from './WaybackItems';
import AnimationMode from './AnimationMode';
import DownloadMode from './DownloadMode';

export default combineReducers({
    UI,
    Map,
    SwipeView,
    WaybackItems,
    AnimationMode,
    DownloadMode,
});
