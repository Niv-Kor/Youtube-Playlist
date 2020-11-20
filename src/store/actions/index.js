const addVideo = data => {
    return {
        type: 'ADD_VIDEO',
        data
    }
}

const retrievePlaylist = data => {
    return {
        type: 'RETRIEVE_PLAYLIST',
        data
    }
}

export {
    addVideo,
    retrievePlaylist
};