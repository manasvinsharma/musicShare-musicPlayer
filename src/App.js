import React from 'react';
import Header from './components/Header';
import SongList from './components/SongList';
import AddSong from './components/AddSong';
import SongPlayer from './components/SongPlayer';
import {Grid} from '@material-ui/core';
import songReducer from './reducer';

export const SongContext = React.createContext({
  song:{
    id:'0793454c-de07-4f50-8d2f-02bf313e0709',
    title:'Justin Bieber',
    artist:'Yummy (Official Video)',
    thumbnail:'http://img.youtube.com/vi/8EJ3zbKTWQ8/0.jpg',
    url:'https://www.youtube.com/watch?v=8EJ3zbKTWQ8',
    duration:231
  },
  isPlaying:false
});

function App() {
  const initialSongState = React.useContext(SongContext);
  const [state,dispatch] = React.useReducer(songReducer,initialSongState);
  return (
    <SongContext.Provider value={{state,dispatch}}> 
    <Header/>
    <Grid container spacing={3}>
      <Grid style={{paddingTop:80 }} 
      item xs={12} md={7}>
        <AddSong/>
        <SongList/>
      </Grid>
    
      <Grid style={{ 
        position:'fixed',
        width:'100%',
        right:0,
        top:70
        }} 
        item xs={12} 
        md={5}
      >
        <SongPlayer/>
      </Grid>
    </Grid>
    </SongContext.Provider>
  );
}

export default App;
