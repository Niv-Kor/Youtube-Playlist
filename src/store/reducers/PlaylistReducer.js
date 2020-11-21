const playlist = (state = { playlist: [], reload: false }, action) => {
    switch (action.type) {
        case 'RETRIEVE_PLAYLIST_FULFILLED':
            return {
                playlist: action.payload,
                reload: true
            }
        
        case 'ADD_VIDEO_FULFILLED':
            return {
                playlist: action.payload,
                reload: true
            }

        case 'LIST_RELOADED':
            return {
                ...state.playlist,
                reload: false
            }
        
        default: return state;
    }
}

export default playlist;