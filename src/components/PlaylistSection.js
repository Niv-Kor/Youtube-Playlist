import React, {Component} from 'react';
import Playlist from './Playlist.js';

class PlaylistSection extends Component {
    constructor() {
        super();
        this.state = {
            inputVal: ""
        };

        this.addVideo = this.addVideo.bind(this);
        this.setInputValue = this.handleInput.bind(this);
    }

    /**
     * Add a video to the playlist.
     */
    addVideo() {
        if (this.state.inputVal === "") return;
        /// TODO add video to server

        this.setState({ inputVal: "" });
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
                <Playlist />
            </div>
        )
    } 
}

export default PlaylistSection;