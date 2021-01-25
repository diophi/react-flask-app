import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
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
        paddingBottom:50
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

let getPublishers=  async () => {
    let publishers = await fetch('/api/allpublishers')
    .then(response => response.json())
    .then(data => data );
    
    return publishers;
}

export default function AllPublishersPage(props) {
    const classes = useStyles();
    const [publishers, setPublishers] = React.useState([]);

    const location = useLocation();

    React.useEffect(()=>{
        getPublishers().then(data => setPublishers(data));

        return () => { setPublishers([]); }
    },[]);

    return (
        <div className={classes.root}>
            <Typography 
                variant="h4" 
                className={classes.title}
            >
                All Publishers
            </Typography>
            <Fade in={true}>
            <List>
                {publishers.map((publisher, index) => (
                    <div key={index}>
                     <Paper variant="outlined" className={classes.listPaper}>
                        <ListItem 
                            button 
                            style={{paddingTop:10, paddingBottom:10}}
                            component={Link}
                            to={"/publisher/"+publisher.publisherID}
                            replace={location.pathname === ("/publisher/"+publisher.publisherID)}
                        >
                            <ListItemAvatar>
                                <Avatar style={{backgroundColor:'#1976d2'}}>
                                    {publisher.name.charAt(0).toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={publisher.name}
                                secondary={publisher.booksCount + " books"}
                            />
                            <ListItemSecondaryAction>
                            
                            </ListItemSecondaryAction>
                        </ListItem>
                    </Paper>
                    </div >
                ))}
            </List>
            </Fade>
        </div>
    );
}