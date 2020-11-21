import { connectServer, retrievePlaylist, addVideo, removeVideo, changeOrder } from '../../Socket';

const connectServerAction = playlistReloadCB => {
    return {
        type: 'CONNECT_SERVER',
        payload: async () => connectServer(playlistReloadCB)
    }
}

const retrievePlaylistAction = () => {
    return {
        type: 'RETRIEVE_PLAYLIST',
        payload: async () => retrievePlaylist()
    }
}

const setPlaylistAction = newPlaylist => {
    return {
        type: 'SET_PLAYLIST',
        payload: newPlaylist
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

export {
    connectServerAction,
    retrievePlaylistAction,
    setPlaylistAction,
    addVideoAction,
    removeVideoAction,
    changeOrderAction
};