import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import BookBlock from './BookBlock';
import RecommendedBooks from './RecommendedBooks';


let getAuthors = async (bookID) => {
    let authors = await fetch('/api/book-authors/' + bookID)
    .then(response => response.json())
    .then(data => data);
    
    return authors;
}

let getRating = async (bookID) => {
    let rating = await fetch('/api/book-rating/' + bookID)
    .then(response => response.json())
    .then(data => data.length > 0 ? data[0].rating : 'None');
    
    return rating;
}

let getBookJSON = async (bookID) => {

    let bookData = await fetch('/api/book/' + bookID)
    .then(response => response.json())
    .then(data => data.length > 0 ? data[0] : Object.create({noBook:true}));

    bookData.authors = await getAuthors(bookID).then(data => data );
    bookData.rating = await getRating(bookID).then(data => data);

    return bookData;
}

  
export default function BookPage(props) {

    const classes = useStyles();
    const [bookData,setBookData] = React.useState(null);
    const bookID = props.match.params.id;
    
    React.useEffect(()=>{
        getBookJSON(bookID).then(data => {setBookData(data);});
    },[bookID]);
    
    return(
        <div>
        { 
            bookData === null? null:
            bookData.noBook?
            <p style={{marginTop:120, marginLeft:50}}>
                Book not found
            </p>:
            <Box justifyContent="center" m={6} className={classes.root}>
                <Box display="flex" className={classes.content}>
                    <BookBlock bookData={bookData} user={props.user} remountHeader={props.remountHeader}/>
                    <RecommendedBooks bookData={bookData} />
                </Box> 
            </Box>
        }
        </div>
    );
    
}

const useStyles = makeStyles((theme) => ({
    root: {
        marginRight:0,
        marginLeft:0,
        [theme.breakpoints.up('sm')]: {
            display:'flex',
        },
    },
    content:{
        flexDirection:'column',
        [theme.breakpoints.up('md')]: {
            flexDirection:'row',
        },
    },
    paper:{
        marginLeft:20,
        paddingBottom:200,
        maxWidth:800,
        [theme.breakpoints.down('sm')]: {
            marginRight:20,
        },
    },
}));