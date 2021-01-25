import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Box } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import StarIcon from '@material-ui/icons/Star';

import { Link, useLocation } from "react-router-dom";


let getPublishers=  async () => {
    let publishers = await fetch('/api/homepage/popularpublishers')
    .then(response => response.json())
    .then(data => data );
    
    return publishers;
}

let getBooks = async () => {
    let books = await fetch('/api/homepage/highratedbooks')
    .then(response => response.json())
    .then(data => data);
    
    return books;
}

export default function HomePage(props){
    const classes = useStyles();
    const location = useLocation();

    const [checked, setChecked] = React.useState(true);
    const [publishers, setPublishers] = React.useState([]);
    const [books, setBooks] = React.useState([]);

    React.useEffect(()=>{
        getPublishers().then(data => setPublishers(data));
        getBooks().then(data => setBooks(data));
        return () => { setPublishers([]); setBooks([])}
    },[]);

    const handleChange = () => {
      setChecked((prev) => !prev);
    };

    
    return (
        <div className={classes.root}>
            <Collapse in={checked} style={{marginBottom:40}}>
                <Paper style={{height:200}}>
                    <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}>
                        <IconButton onClick={handleChange}>
                            <CloseIcon color="primary" />
                        </IconButton>
                    </div>
                        <Box display="flex">
                            <Fade in={true}>
                                <img 
                                    src={"/resources/homepage.png"} alt="" 
                                    className={classes.banner}
                                />
                            </Fade>
                            <Box display="flex" flexDirection="column">
                                <Typography color="primary" variant="h4" className={classes.bannerText}>
                                    Welcome to books!
                                </Typography>
                                <Typography color="primary" variant="h6" className={classes.bannerText}>
                                    This is a website about books, authors and publishers.
                                </Typography>
                                <Typography color="primary" variant="body1" className={classes.bannerText}>
                                    You can even leave reviews or save favorite books.
                                </Typography>
                            </Box>
                        </Box>
                </Paper>
            </Collapse>

            <div className={classes.highRatedBooks}>
                <Typography variant="h4" className={classes.title}>
                    High Rated Books
                </Typography>
                {books.length === 0 ? <></> :
                    <>
                    <Grow in={true}>
                        <Grid 
                            container 
                            spacing={0}
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            className={classes.grid}
                        >
                            {books.map((book, index)=>(
                                <Grid key={index} item >
                                    <Box display="flex" justifyContent="center" style={{minWidth:170}}>
                                        <Paper elevation={2} className={classes.tileRoot}>
                                            <Box>
                                                <Grid container>
                                                    <Button 
                                                        className={classes.imageHolder}  
                                                        component={Link} 
                                                        to={"/book/" + book.bookID}
                                                        replace={location === ("/book/" + book.bookID)}
                                                    >
                                                        <img src={"/resources/" + (book.coverPicture || "cover.jpg")} alt="" className={classes.image}/>
                                                    </Button>
                                                    <Grid item xs={12} className={classes.details}>
                                                        <Typography noWrap>
                                                            <Link
                                                                className={classes.tileTitle}
                                                                to={"/book/" + book.bookID}
                                                                replace={location === ("/book/" + book.bookID)}
                                                            >
                                                                {book.title}
                                                            </Link>
                                                        </Typography>
                                                        <Box display="flex">
                                                            <Typography>{book.rating}</Typography>
                                                            <StarIcon color="primary" style={{marginTop:-2}}/>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Paper>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grow>
                    </>
                }
            </div>

            <div className={classes.popularPublishers} style={{paddingTop:15}}>
                <Typography 
                    variant="h4" 
                    className={classes.title}
                >
                    Popular Publishers
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
                                        secondary={'Points: ' + publisher.ReviewsCount}
                                    />
                                    <ListItemSecondaryAction>
                                    <Typography
                                        variant="h4"
                                        color="primary"
                                    >
                                        {index + 1} 
                                    </Typography>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </Paper>
                        </div >
                    ))}
                </List>
                </Fade>
            </div> 
        </div>
    );

}

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom:40,
        marginRight:'10%',
        marginLeft:'10%',
        [theme.breakpoints.down('sm')]: {
            marginRight:'0%',
            marginLeft:'0%',
        },
    },
    banner:{
        marginTop:-40,
        height:200,
        [theme.breakpoints.down('sm')]: {
            marginTop:-17,
            height:150,
        },
    },
    title:{
        marginBottom:15,
        color:'#333333',
        fontSize:'1.8em',
        [theme.breakpoints.down('sm')]: {
            marginRight:'10%',
            marginLeft:'10%',
        },
        
    },
    listPaper:{
        marginBottom:7
    },
    popularPublishers:{
        marginBottom:30
    },
    //book tile
    tileRoot:{
        marginBottom:20,
        paddingBottom:5,
        maxWidth:160,
    },
    imageHolder:{
        textAlign:'center',
        paddingTop:5,
        width:'100%',

        "&:hover": {
            background: "#efefef",
        },
    },
    image:{
        width:150,
        height:225,
    },
    details:{
        marginTop:5,
        paddingLeft:10,
        paddingRight:10,
    },
    tileTitle:{
        lineHeight:'1',
        fontSize:15,
        textDecoration:'none',
        color:'#313131',
        "&:hover": {
           borderBottom:'0.5px solid #bbb' ,
        },
    },
    bannerText:{
        [theme.breakpoints.down('sm')]: {
            fontSize:16,
        },
    }
}));