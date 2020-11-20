import './App.css';
import React from 'react';
import { connect } from 'react-redux';
import { retrievePlaylist } from './store/actions/index';
import PlaylistSection from './components/PlaylistSection.js';
import PlayerSection from './components/PlayerSection.js';

const mapDispatchToProps = dispatch => ({
  fetchPlaylist: () => dispatch(retrievePlaylist())
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.loadPlaylist();
  }

  /**
   * Load the videos playlist.
   */
  async loadPlaylist() {
    await this.props.fetchPlaylist();
  }

  render() {
    return (
      <div className="App">
        <PlayerSection />
        <PlaylistSection />
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(App);