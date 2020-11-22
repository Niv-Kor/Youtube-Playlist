import Playlist from './PlaylistReducer';
import InputFocus from './ElementsReducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
    Playlist,
    InputFocus
});

export default reducers;