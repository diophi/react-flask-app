import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import BookTile from '../Layout/BookTile';

const getRecommendedBooks = async (bookID) => {
    return await fetch('/api/recommended/'+bookID)
    .then(response => response.json())
    .then(data => data)
}

export default function RecommendedBooks(props){

    const classes = useStyles();

    const bookData = props.bookData;

    const [books, setBooks] = React.useState([]);

    React.useEffect(()=>{
        getRecommendedBooks(bookData.bookID).then(data => setBooks(data));
    },[bookData.bookID])

    return(
        <div className={classes.root}>
            <Typography variant="h6" fontSize="h6.fontSize" className={classes.rootTitle}>Recommended</Typography>
            {books.map((book, index) => (
                <BookTile key={index} book={book}/>
            ))}
        </div>
    );
}


const useStyles = makeStyles((theme) => ({
    root:{
            marginTop:'0px',
            marginLeft:'50px',
            maxWidth:'170px',
            marginRight:'20px',

        [theme.breakpoints.down('sm')]: {
            marginTop:'50px',
            marginLeft:'20px',
        },
    },
    rootTitle:{
        marginBottom:20,
    },

}));