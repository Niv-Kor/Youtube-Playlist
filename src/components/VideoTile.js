import React from 'react';

function VideoTile(props) {
    return (
        <div className="video-tile">
            <span className="video-title">{props.title}</span>
            <span className="video-duration">{props.duration}</span>
        </div>
    )
}

export default VideoTile;