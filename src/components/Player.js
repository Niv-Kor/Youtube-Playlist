import React from 'react';
import { connect } from 'react-redux';
import { removeVideoAction } from '../store/actions/index';

const mapDispatchToProps = dispatch => ({
    removeVideo: url => dispatch(removeVideoAction(url))
});

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            player: null,
            done: false,
            YT: null,
            loaded: false,
            firstLoad: true,
            empty: true
        }

        this.init();
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        window['onYouTubeIframeAPIReady'] = async () => {
            let firstUrl = this.getFirstVideoUrl();
            this.setState({ empty: firstUrl === '' });
            this.loadVideo = this.loadVideo.bind(this);

            this.state.YT = window['YT'];
            this.state.player = new this.state.YT.Player('player', {
                videoId: firstUrl,
                events: {
                    'onStateChange': this.onPlayerStateChange.bind(this),
                    'onError': err => console.error('Player error:', err),
                    'onReady': e => {
                        this.state.player.stopVideo();
                        this.setState({ empty: this.getFirstVideoUrl() === '' });
                        this.loadVideo();
                        this.setState({ loaded: true });
                    }
                }
            });
        }
    }

    init() {
        var tag = document.createElement('script');
        tag.src = 'http://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    componentDidUpdate(prevProps) {
        if (!this.state.player || !this.state.loaded) return;

        let changed = prevProps.playlist !== this.props.playlist;
        let exists = this.props.playlist.length > 0;

        if (!exists) this.state.player.stopVideo();
        else if (!this.state.empty && this.state.loaded && (changed || this.state.firstLoad)) {
            this.setState({ videoId: this.getFirstVideoUrl() });
            this.setState({ firstLoad: false });
            this.loadVideo();
            this.state.player.playVideo();
        }
    }

    /**
     * Invoke different actions according to the user's interaction with the player.
     * 
     * @param {Object} event - Automatic event parameter
     */
    onPlayerStateChange(event) {
        switch (event.data) {
            case this.state.YT.PlayerState.PLAYING:
                break;

            case this.state.YT.PlayerState.PAUSED:
                break;

            case this.state.YT.PlayerState.ENDED:
                this.state.player.stopVideo();
                this.setState({ empty: this.props.playlist.length === 1 });
                this.props.removeVideo(this.props.playlist[0].url);
                break;

            default: return;
        };
    };

    /**
     * @returns {Number} The time that has passed since the beginning of the video.
     */
    getPassedTime() {
        return Math.round(this.state.player.getCurrentTime())
    };

    /**
     * @returns {String} The URL of the first video in the playlist.
     */
    getFirstVideoUrl() {
        let playlist = this.props.playlist;
        if (!playlist || !playlist.length) return '';
        else return playlist[0] ? playlist[0].url : '';
    }

    /**
     * Load the first video in the playlist.
     */
    loadVideo() {
        if (!this.state.loaded || !this.props.playlist || !this.props.playlist.length) return;
        else this.setState({ empty: false });
        
        this.state.player.loadVideoById({
            'videoId': this.props.playlist[0].url,
            'startSeconds': 0
        });
    }

    render() {
        return (
            <div id="player"></div>
        )
    }
}

export default connect(null, mapDispatchToProps)(Player);