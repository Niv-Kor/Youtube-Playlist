import React from 'react';
import TrashIcon from '../res/trash.png';
import { connect } from 'react-redux';
import { removeVideoAction } from '../store/actions';

const mapDispatchToProps = dispatch => ({
    removeVideo: url => dispatch(removeVideoAction(url))
});

class VideoTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBinHovered: false
        }

        this.onMouseHover = this.onMouseHover.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    /**
     * Activate when the mouse hovers the video tile.
     */
    onMouseHover() {
        this.setState({ isBinHovered: true })
    }

    /**
     * Activate when the mouse leaves the video tile.
     */
    onMouseLeave() {
        this.setState({ isBinHovered: false })
    }

    render() {
        return (
            <div
                className="video-tile"
                onMouseOver={this.onMouseHover}
                onMouseLeave={this.onMouseLeave}
            >
                <span className="video-title">{this.props.title}</span>
                <span
                    className="video-duration"
                    style={{ display: this.state.isBinHovered ? 'none' : 'unset' }}
                >
                    {this.props.duration}
                </span>
                <img
                    className="video-tile-trash"
                    src={TrashIcon}
                    alt=''
                    onClick={() => this.props.removeVideo(this.props.src)}
                    style={{ display: this.state.isBinHovered ? 'unset' : 'none' }}
                />
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(VideoTile);