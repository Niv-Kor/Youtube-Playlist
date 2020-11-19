import React, {Component} from 'react';

class VideoTile extends Component {
    render() {
        return (
            <div className="video-tile">
                <span className="video-title">{this.props.title}</span>
                <span className="video-duration">{this.props.duration}</span>
            </div>
        )
    }
}

export default VideoTile;