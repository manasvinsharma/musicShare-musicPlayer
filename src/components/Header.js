import React, { Component } from 'react';
import {AppBar,Toolbar, Typography,makeStyles} from '@material-ui/core';  
import HeadsetTwoToneIcon from '@material-ui/icons/HeadsetTwoTone';

const useStyles = makeStyles(theme=>({
    title:{
        marginLeft:theme.spacing(2)
    }
}));

const Header = () => {
    const classes = useStyles();

    return (
        <AppBar color='primary' position='fixed'>
            <Toolbar>
                <HeadsetTwoToneIcon/>
                <Typography className={classes.title} variant='h6' component='h1' >
                    Music Share
                </Typography>
            </Toolbar>
        </AppBar>
      );
}
 
export default Header;