import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';


import { Link, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root:{
        width:'100%',
    },
    paper:{
        display: 'flex',
        alignItems: 'center',
        width:'100%',
    },
    input:{
        flex:1,
        marginLeft:'15px',
    },
    searchButton:{
        padding:'6px',
    },
    searchListRoot:{
        position:'absolute',
        zIndex:100,
        //padding: '2px 4px',
        width:'100%',
        marginTop:'15px',
        paddingTop:'15px',
        paddingBottom:'15px',
        borderTopLeftRadius:'0px',
        borderTopRightRadius:'0px',
    },
    listItemIcon:{
        color:"rgba(0, 0, 0, 0.54)",
    }
}));

let getBook = async (searchQuery) => {
    let book = await fetch('https://mostare1.pythonanywhere.com/api/short-search/' + searchQuery)
    .then(response => response.json())
    .then(data => data);

    return book;
}

export default function SearchBar(){
    const classes = useStyles();
    const location = useLocation();

    const [isTyping, setTyping] = React.useState(false);
    const [text, setText] = React.useState("");
    const [results, setResults] = React.useState(null);

    const handleTyping = (event) =>{
        setText(event.target.value);

        if(event.target.value.length > 0)
            getBook(event.target.value).then(data => setResults(data));

        event.target.value.length > 0 ?  setTyping(true) : setTyping(false);
    };

    const handleClose = () =>{
        setTyping(false);
    }


    return(
        <div className={classes.root}>
            <ClickAwayListener onClickAway={handleClose}>
                <div style={{width:'100%',position:'relative'}}>
                    <Paper component="form" className={classes.paper}>
                        <InputBase 
                            className={classes.input}
                            placeholder="Search for books"
                            onChange={handleTyping}
                            onFocus={handleTyping}
                        >
                        </InputBase>
                        <IconButton 
                            className={classes.searchButton}
                            disabled={text.length === 0 ? true : false}
                            component={Link}
                            to={"/search/" + text}
                            onClick={handleClose}
                        >
                            <SearchIcon/>
                        </IconButton>
                    </Paper>
                    {isTyping ? (
                        <Fade in={isTyping}>
                        <Paper elevation={10} className={classes.searchListRoot}>
                        {results === null? <></> :
                            <List component="nav" aria-label="search elements">
                            {results.map((book, index)=>(
                                <ListItem 
                                    button 
                                    key={index} 
                                    component={Link}
                                    to={"/book/" + book.bookID}
                                    replace={location.pathname === ("/book/" + book.bookID)}
                                    onClick={handleClose}
                                >
                                    <ListItemIcon>
                                        <img src={"/resources/" + (book.coverPicture || "cover.jpg")} alt="" style={{height:60, width:40}}/>
                                    </ListItemIcon>
                                    <ListItemText>
                                        {book.title}
                                    </ListItemText>
                                    <ListItemSecondaryAction className={classes.listItemIcon}>
                                        <ArrowForwardIcon/>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            {results.length === 0 ? 
                                <ListItem>No results</ListItem> : 
                                <ListItem 
                                    button
                                    component={Link}
                                    to={"/search/" + text}
                                    replace={location.pathname === ("/search/" + text)}
                                    onClick={handleClose}
                                >
                                    <ListItemText style={{textAlign:'center'}}>
                                        More results
                                    </ListItemText>
                                </ListItem>
                            }
                            </List>
                        }
                        </Paper>
                        </Fade>
                        ) : null
                    }
                </div>
            </ClickAwayListener>
        </div>
    );
}