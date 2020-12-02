import { combineReducers } from 'redux';
import UI from './UI';
import SwipeView from './SwipeView';
import WaybackItems from './WaybackItems'

export default combineReducers({
    UI,
    SwipeView,
    WaybackItems
});
