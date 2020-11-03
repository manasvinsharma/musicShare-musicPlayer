import React, { Component } from 'react';
import {
    Typography,
    Avatar,
    IconButton,
    makeStyles
} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks';
import { ADD_OR_REMOVE_FROM_QUEUE } from '../graphql/mutations';

const QueuedSongList = ({queue}) => {
    return ( 
        <div style={{margin:'10px 0'}}>
            <Typography color='textSecondary' variant='button'>
                QUEUE ({queue.length})
            </Typography>
            {queue.map((song,i)=>(
                <QueuedSong key={i} song={song}/>
            ))}
        </div>
     );
}

const useStyles = makeStyles({
    avatar:{
        width:44,
        height:44
    },
    text:{
        textOverflow:'ellipsis',
        overflow:'hidden'
    },
    container:{
        display:'grid',
        gridAutoFlow:'column',
        gridTemplateColumns:'50px auto 50px',
        gridGap:12,
        alignItems:'center',
        marginTop:10
    },
    songInfoContainer:{
        overflox:'hidden',
        whiteSpace:'nowrap'
    }
})

const QueuedSong = ({song}) => {

    const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE,{
        onCompleted: data =>{
            localStorage.setItem('queue',JSON.stringify(data.addOrRemoveFromQueue));
        }
    });

    const classes = useStyles();
    const {thumbnail,artist,title} = song;        

    function handleAddOrRemoveQueue()
    {
        addOrRemoveFromQueue({
            variables:{input:{...song,__typename:'Song'}}
        });
    }

    return ( 
        <div className={classes.container}>
            <Avatar className={classes.avatar} src={thumbnail} alt="Song thumbnail"/>
            <div className={classes.songInfoContainer}>
                <Typography className={classes.text} variant='subtitle2'>
                    {title}
                </Typography>
                <Typography className={classes.text} variant='body2' color="textSecondary">
                    {artist}
                </Typography>
            </div>
            <IconButton onClick={handleAddOrRemoveQueue}>
                <Delete color="error"/>
            </IconButton>
        </div>

     );
}

export default QueuedSongList;