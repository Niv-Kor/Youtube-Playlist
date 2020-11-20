const playlistReducer = (state = [], action) => {
    switch (action.type) {
        case 'RETRIEVE_PLAYLIST_FULFILLED':
            return action.payload

        default: return state;
    }
}

export default playlistReducer;