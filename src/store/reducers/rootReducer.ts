import { combineReducers } from 'redux';
import UI from './UI';
import Map from './Map';
import SwipeView from './SwipeView';
import WaybackItems from './WaybackItems';

export default combineReducers({
    UI,
    Map,
    SwipeView,
    WaybackItems,
});
