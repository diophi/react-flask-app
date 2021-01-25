import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root:{
        width:'100%',
    },
}));

export default function SearchBar(){
    const classes = useStyles();
    const location = useLocation();



    return(
       <IconButton style={{color:'white'}}>
           <SearchIcon fontSize="large"/>
       </IconButton>
    );
}