import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';

import BookTile from '../Layout/BookTile';


const useStyles = makeStyles((theme) => ({
    root:{
        marginRight:'10%',
        marginLeft:'10%',
        [theme.breakpoints.down('sm')]: {
            marginRight:'0%',
            marginLeft:'0%',
        },
        paddingBottom:50
    },
    title:{
        color:'#333333',
        fontSize:'1.8em',
        [theme.breakpoints.down('sm')]: {
            marginRight:'10%',
            marginLeft:'10%',
        },
        
    },
    underTitle:{
        marginBottom:30,
        [theme.breakpoints.down('sm')]: {
            marginRight:'10%',
            marginLeft:'10%',
        },
    },
    grid:{
        [theme.breakpoints.down('sm')]: {
            justifyContent:'space-evenly',
            paddingLeft:0,
            paddingRight:0,
        },
    },
    gridItem:{
        display:'flex',
        alignItems:'center',
    }
}));

let getAllBooks = async () => {
    let books = await fetch('/api/allbooks')
    .then(response => response.json())
    .then(data => data);
    
    return books;
}

export default function AllBooksPage(props) {

    const classes = useStyles();

    const [books, setBooks] = React.useState([]);
    
    React.useEffect(() => { 
        getAllBooks().then(data => setBooks(data));
    },[]);

    return(
        <div className={classes.root}>
            <Typography variant="h4" className={classes.title}>
                All Books
            </Typography>
            <Fade in={books.length > 0}>
                <Typography variant="body2" className={classes.underTitle}>
                    {books.length} Books
                </Typography>
            </Fade>
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
                                    <BookTile book={book}/>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grow>
                </>
            }
        </div>
    );
}