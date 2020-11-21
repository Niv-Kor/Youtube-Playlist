import { connectServer, retrievePlaylist, addVideo, removeVideo, changeOrder } from '../../Socket';

const connectServerAction = () => {
    return {
        type: 'CONNECT_SERVER',
        payload: connectServer
    }
}

const addVideoAction = data => {
    return {
        type: 'ADD_VIDEO',
        payload: async () => addVideo(data)
    }
}

const removeVideoAction = data => {
    return {
        type: 'REMOVE_VIDEO',
        payload: async () => removeVideo(data)
    }
}

const changeOrderAction = data => {
    return {
        type: 'CHANGE_ORDER',
        payload: async () => changeOrder(data.oldIndex, data.newIndex)
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
    removeVideoAction,
    changeOrderAction,
    retrievePlaylistAction,
    listReloadedAction
};