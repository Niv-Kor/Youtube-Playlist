import './App.css';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectServerAction, retrievePlaylistAction } from './store/actions/index';
import PlaylistSection from './components/PlaylistSection.js';
import PlayerSection from './components/PlayerSection.js';

var connected = false;

function App() {
  const playlist = useSelector(state => state.Playlist.playlist);
  const dispatch = useDispatch();

  if (!connected) {
    dispatch(connectServerAction()).then(() => dispatch(retrievePlaylistAction()));
    connected = true;
  }

  return (
      <div className="App">
        <PlayerSection playlist={playlist} />
        <PlaylistSection playlist={playlist} />
      </div>
  )
}

export default App;