const inputFocus = (state = false, action) => {
    switch (action.type) {
        case 'FOCUS_VIDEO_INPUT':
            return action.flag;
        
        default: return state;
    }
}

export default inputFocus;