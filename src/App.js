import './App.css';
import React from 'react';
import { useDispatch } from 'react-redux';
import { connectServerAction, retrievePlaylistAction } from './store/actions/index';
import PlaylistSection from './components/PlaylistSection.js';
import PlayerSection from './components/PlayerSection.js';


function App() {
  const dispatch = useDispatch();
  dispatch(connectServerAction())
    .then(() => dispatch(retrievePlaylistAction()));

  return (
      <div className="App">
        <PlayerSection />
        <PlaylistSection />
      </div>
  )
}

export default App;