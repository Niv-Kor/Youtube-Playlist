import { retrievePlaylist } from '../../Socket';

const playlistReducer = async (state = [], action) => {
    switch (action.type) {
        case 'RETRIEVE_PLAYLIST':
            return await retrievePlaylist();

        default: return state;
    }
}

export default playlistReducer;