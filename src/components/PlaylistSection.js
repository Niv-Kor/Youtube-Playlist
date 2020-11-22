import React, {Component} from 'react';
import Playlist from './Playlist.js';
import { connect } from 'react-redux';
import { addVideoAction, focusVideoInputAction } from '../store/actions/index';

const mapStateToProps = state => {
    return {
        inputFocus: state.InputFocus
    }
};

const mapDispatchToProps = dispatch => ({
    addVideo: url => dispatch(addVideoAction(url)),
    loseInputFocus: () => dispatch(focusVideoInputAction(false))
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

    componentDidUpdate(prevProps) {
        if (this.props.inputFocus && prevProps.inputFocus !== this.props.inputFocus)
            this.nameInput.focus();
    }

    /**
     * Add a video to the playlist.
     */
    addVideo() {
        if (this.state.inputVal === '') return;
        let url = this.trimURLPrefix(this.state.inputVal);
        this.props.addVideo(url);
        this.setState({ inputVal: '' });
    }

    /**
     * @param {String} url - The URL of a youtube video
     * @returns {String} Only the video ID, without the youtube domain prefix.
     */
    trimURLPrefix(url) {
        let trimSpot = url.lastIndexOf('/');

        if (trimSpot === -1) return url;
        else return url.substring(trimSpot + 1, url.length)
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
                    placeholder=" Video URL"
                    value={this.state.inputVal}
                    onChange={this.setInputValue}
                    onKeyDown={e => {
                        if (e.key === 'Enter')
                            this.addVideo();
                    }}
                    ref={input => this.nameInput = input} 
                    onBlur={() => this.props.loseInputFocus()}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistSection);