import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Zoom from '@material-ui/core/Grow';

import BookTile from '../Layout/BookTile';


const useStyles = makeStyles((theme) => ({
    root:{
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

let getFavoriteBooks = async (userID) => {
    let favorites = await fetch('https://mostare1.pythonanywhere.com/api/favorite/user/' + userID)
    .then(response => response.json())
    .then(data => data);
    
    return favorites;
}

export default function FavoritePage(props) {

    const classes = useStyles();
    const user = props.user;

    const [books, setBooks] = React.useState(null);
    
    React.useEffect(() => { 
        getFavoriteBooks(user.userID).then(data => setBooks(data));
    },[user.userID]);

    return(
        <div className={classes.root}>
            {books === null ? <></> :
                <>
                <Typography variant="h4" className={classes.title}>
                    Your favorite books ({books.length})
                </Typography>
                <Zoom in={true}>
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
                </Zoom>
                </>
            }
        </div>
    );
}