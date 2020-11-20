import { fetchPlaylist } from '../../Socket';

const addVideo = data => {
    return {
        type: 'ADD_VIDEO',
        data
    }
}

const retrievePlaylist = () => {
    return {
        type: 'RETRIEVE_PLAYLIST',
        payload: fetchPlaylist
    }
}

export {
    addVideo,
    retrievePlaylist
};