import { connectServer, retrievePlaylist, addVideo } from '../../Socket';

const connectServerAction = () => {
    return {
        type: 'CONNECT_SERVER',
        payload: connectServer
    }
}

const addVideoAction = data => {
    return {
        type: 'ADD_VIDEO',
        payload: () => {
            addVideo(data);
            retrievePlaylist();
        }
    }
}

const retrievePlaylistAction = () => {
    return {
        type: 'RETRIEVE_PLAYLIST',
        payload: retrievePlaylist
    }
}

const listReloadedAction = () => {
    return {
        type: 'LIST_RELOADED'
    }
}

export {
    connectServerAction,
    addVideoAction,
    retrievePlaylistAction,
    listReloadedAction
};