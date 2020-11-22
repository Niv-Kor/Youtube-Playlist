import { connectServer, retrievePlaylist, addVideo, removeVideo, changeOrder } from '../../server/Socket';

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

const removeVideoAction = url => {
    return {
        type: 'REMOVE_VIDEO',
        payload: async () => removeVideo(url)
    }
}

const changeOrderAction = data => {
    return {
        type: 'CHANGE_ORDER',
        payload: async () => changeOrder(data.oldIndex, data.newIndex)
    }
}

const focusVideoInputAction = flag => {
    return {
        type: 'FOCUS_VIDEO_INPUT',
        flag
    }
}

export {
    connectServerAction,
    retrievePlaylistAction,
    setPlaylistAction,
    addVideoAction,
    removeVideoAction,
    changeOrderAction,
    focusVideoInputAction
};