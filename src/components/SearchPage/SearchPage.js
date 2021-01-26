import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';

import { Link, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        marginRight:'10%',
        marginLeft:'10%',
        [theme.breakpoints.down('sm')]: {
            marginRight:'0%',
            marginLeft:'0%',
        },
    },
    title:{
        marginBottom:30,
        color:'#333333',
        fontSize:'1.8em',
        [theme.breakpoints.down('sm')]: {
            marginRight:'10%',
            marginLeft:'10%',
        },
        
    },
    listPaper:{
        marginBottom:7
    }
}));

let getResults = async (name) => {
    let results = await fetch('https://mostare1.pythonanywhere.com/api/long-search/' + name)
    .then(response => response.json())
    .then(data => data );
    
    return results;
}

export default function SearchPage(props) {
    const classes = useStyles();
    const name = props.match.params.name;

    const [results, setResults] = React.useState([]);

    const location = useLocation();

    React.useEffect(()=>{
        getResults(name).then(data => setResults(data));
    },[name]);

    return (
        <div className={classes.root}>
            <Typography 
                variant="h4" 
                className={classes.title}
            >
                Search Results for: {name}
            </Typography>
            <Fade in={true}>
                <List component="nav" aria-label="search elements">
                    {results.map((book, index)=>(
                        <div key={index}>
                        <Paper variant="outlined" className={classes.listPaper}>
                            <ListItem 
                                button 
                                key={index} 
                                component={Link}
                                to={"/book/" + book.bookID}
                                replace={location.pathname === ("/book/" + book.bookID)}
                            >
                                <ListItemIcon>
                                    <img src={"/resources/" + (book.coverPicture || "cover.jpg")} alt="" style={{height:60, width:40}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={book.title}
                                    secondary={'Publisher: ' + book.name}
                                />
                                <ListItemSecondaryAction className={classes.listItemIcon}>
                                    <ArrowForwardIcon/>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Paper>
                        </div>
                    ))}
                </List>
            </Fade>
        </div>
    );
}