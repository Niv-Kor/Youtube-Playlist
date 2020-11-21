import React, {Component} from 'react';
import Playlist from './Playlist.js';
import { connect } from 'react-redux';
import { addVideoAction } from '../store/actions/index';

const mapDispatchToProps = dispatch => ({
    addVideo: url => {
        dispatch(addVideoAction(url));
        //dispatch(retrievePlaylistAction());
    }
});

class PlaylistSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVal: ''
        };

        this.addVideo = this.addVideo.bind(this);
        this.setInputValue = this.handleInput.bind(this);
    }

    /**
     * Add a video to the playlist.
     */
    addVideo() {
        if (this.state.inputVal === '') return;
        let url = this.state.inputVal;
        this.props.addVideo(url);
        this.setState({ inputVal: '' });
    }

    /**
     * Change the input value state.
     * 
     * @param {Object} event - Automatic event parameter
     */
    handleInput(event) {
        this.setState({ inputVal: event.target.value });
    }

    render() {
        return (
            <div className="playlist-div">
                <input
                    className="link-input"
                    type="text"
                    placeholder="Video URL"
                    value={this.state.inputVal}
                    onChange={this.setInputValue}
                />
                <button
                    className="add-button"
                    onClick={this.addVideo}
                >
                    Add
                </button>
                <Playlist playlist={this.props.playlist} />
            </div>
        )
    } 
}

export default connect(null, mapDispatchToProps)(PlaylistSection);