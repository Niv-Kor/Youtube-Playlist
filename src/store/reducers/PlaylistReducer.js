const playlist = (state = [], action) => {
    switch (action.type) {
        case 'RETRIEVE_PLAYLIST_FULFILLED':
            return action.payload;

        case 'SET_PLAYLIST':
            return action.payload;
        
        case 'ADD_VIDEO_FULFILLED':
            return action.payload

        case 'REMOVE_VIDEO_FULFILLED':
            return action.payload;

        case 'CHANGE_ORDER_FULFILLED':
            return action.payload;
        
        default: return state;
    }
}

export default playlist;