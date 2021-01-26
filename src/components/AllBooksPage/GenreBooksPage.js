import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import CircularProgress from '@material-ui/core/CircularProgress';

import BookTile from '../Layout/BookTile';


const useStyles = makeStyles((theme) => ({
    root:{
        marginRight:'10%',
        marginLeft:'10%',
        [theme.breakpoints.down('sm')]: {
            marginRight:'0%',
            marginLeft:'0%',
        },
        paddingBottom:50,
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

let getAllBooks = async (name) => {
    let books = await fetch('https://mostare1.pythonanywhere.com/api/genres/'+name)
    .then(response => response.json())
    .then(data => data);
    
    return books;
}

export default function GenreBooksPage(props) {

    const classes = useStyles();
    const genreName = props.match.params.genre;

    const [books, setBooks] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    //console.log(open);

    React.useEffect(() => {
        setOpen(false);
    },[genreName]);

    React.useEffect(() => {
        if(!open) setOpen(true);
        if(open) getAllBooks(genreName).then(data => setBooks(data));

        return () => {setBooks(null);}
    },[open, genreName]);

    return(
        <div className={classes.root}>
            <Typography variant="h4" className={classes.title}>
                All Books In {genreName}
            </Typography>
            {books === null ? <CircularProgress/> :
                <>
                {open?
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
                :<CircularProgress/>
                }
                </>
            }
        </div>
    );
}