import React, { Component,useState } from 'react';
import {
    TextField,
    InputAdornment,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    makeStyles
} from '@material-ui/core';
import {Link,AddBoxOutlined} from '@material-ui/icons';
import SoundcloudPlayer from 'react-player/lib/players/SoundCloud';
import YoutubePlayer from 'react-player/lib/players/YouTube';
import ReactPlayer from 'react-player';
import { useMutation } from '@apollo/react-hooks';
import { ADD_SONG } from '../graphql/mutations';

const useStyles = makeStyles(theme=>({
    container:{
        display:'flex',
        alignItems:'center'
    },
    urlInput:{
        margin:theme.spacing(1)
    },
    addSongButton:{
        margin:theme.spacing(1)
    },
    dialog:{
        textAlign:'center'
    },
    thumbnail:{
        width:'90%'
    }
}))

const DEFAULT_SONG = {
        duration:0,
        title:'',
        artist:'',
        thumbnail:''
}

const AddSong = () => {

    const classes = useStyles();
    const [addSong,{error}] = useMutation(ADD_SONG);
    const [dialog,setDialog] = React.useState(false);
    const [url,setUrl] = React.useState('');
    const [playable,setPlayable] = React.useState(false);
    const [song,setSong] = React.useState(DEFAULT_SONG);

    React.useEffect(()=>{
        const isPlayable = SoundcloudPlayer.canPlay(url) || YoutubePlayer.canPlay(url);
        setPlayable(isPlayable);
    },[url])

    function handleChangeSong(event)
    {
        const {name,value} = event.target;
        setSong(prevSong=>({
            ...prevSong,
            [name]:value
        }));
    }

    function handleCloseDialog()
    {
        setDialog(false);
    }

    async function handleEditSong({player})
    {
        const nestdPlayer = player.player.player;

        let songData;
        if(nestdPlayer.getVideoData)
        {
            songData = getYoutubeInfo(nestdPlayer)
        }
        else if(nestdPlayer.getCurrentSound)
        {
            songData = await getSoundcloudinfo(nestdPlayer);   
        }
        setSong({...songData,url});    
    }

    async function handleAddSong()
    {
        try{
            const {url,thumbnail,duration,title,artist} = song;
            await addSong({
                variables:{
                url : url.length > 0 ? url : null,
                thumbnail : thumbnail.length > 0 ? thumbnail : null,
                duration : duration > 0 ? duration : null,
                title : title.length > 0 ? title : null,  
                artist : artist.length > 0 ? artist : null
                }
            })
            handleCloseDialog();
            setSong(DEFAULT_SONG);
            setUrl('');     
        }
        catch(error){
            console.error("Error in adding song",error);
        }
    }

    function getYoutubeInfo(player)
    {
        const duration = player.getDuration();
        const {title,video_id,author} = player.getVideoData();
        const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
        return {
            duration,
            title,
            artist:author,
            thumbnail
        }
    }

    function getSoundcloudinfo(player)
    {
        return new Promise(resolve=>{
            player.getCurrentSound((songData)=>{
                if(songData){
                    resolve ({
                        duration:Number(songData.duration/1000),
                        title:songData.title,
                        artist:songData.user.username,
                        thumbnail:songData.artwork_url.replace('-large','-t500x500')
                    })
                }
            })      
        })
    }

    function handleInputFieldError(field)
    {
        return error && error.graphQLErrors[0].extensions.path.includes(field);
    }

    const {thumbnail,title,artist} = song;
    console.log(error);
    return ( 
        <div className={classes.container}>
            <Dialog
                className={classes.dialog}
                open={dialog}
                onClose={handleCloseDialog}
            >
               <DialogTitle>Edit Song</DialogTitle>
               <DialogContent>
                    <img src={thumbnail} 
                        alt="song thumbnail"
                        className={classes.thumbnail}
                    />
                    <TextField
                        value={title}
                        onChange={handleChangeSong}
                        margin="dense"
                        name="title"
                        label="Title"
                        fullWidth
                        error={handleInputFieldError('title')}
                        helperText={handleInputFieldError('title')&&'Fill out this field'}
                    />
                    <TextField
                        value={artist}
                        onChange={handleChangeSong}
                        margin="dense"
                        name="artist"
                        label="Artist"
                        fullWidth
                        error={handleInputFieldError('artist')}
                        helperText={handleInputFieldError('artist')&&'Fill out this field'}
                    />
                    <TextField
                        value={thumbnail}
                        onChange={handleChangeSong}
                        margin="dense"
                        name="thumbnail"
                        label="Thumbnail"
                        fullWidth
                        error={handleInputFieldError('thumbnail')}
                        helperText={handleInputFieldError('thumbnail')&&'Fill out this field'}
                    />
                </DialogContent> 
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                </DialogActions>
                <DialogActions>
                    <Button onClick={handleAddSong} variant="outlined" color="primary">Add Song</Button>
                </DialogActions>    
            </Dialog>
            <TextField
                className={classes.urlInput}
                value={url}
                onChange={event=>setUrl(event.target.value)}
                placeholder="Add Youtube or Soundcloud URL"
                fullWidth
                margin="normal"
                type="url"
                InputProps={{
                    startAdornment:(
                        <InputAdornment position="start">
                        <Link/>
                        </InputAdornment>
                    )
                }}
            />
            <Button
            disabled={!playable}
            className={classes.button}
            onClick={()=>setDialog(true)}
            variant="contained"
            color="primary"
            endIcon={<AddBoxOutlined/>}
            >
            Add        
            </Button>
            <ReactPlayer url={url} hidden={true} onReady={handleEditSong}/>
        </div>
     );
}
 
export default AddSong;