import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


let getBookGenres = async (bookID) => {
    let genres = await fetch('https://mostare1.pythonanywhere.com/api/genres-book/'+bookID)
    .then(response => response.json())
    .then(data => data);
    
    let allGenres = ""; 
    genres.forEach(genre => {
        allGenres += ", " + genre.name;
    });

    return allGenres.substring(1, allGenres.length);
}

  
export default function AdditionalInfo(props) {

    const classes = useStyles();
    const [genres, setGenres] = React.useState("");

    let bookData = props.bookData;

    React.useEffect(()=>{
        getBookGenres(bookData.bookID).then(data => setGenres(data));
    },[bookData.bookID])
    
    
    let info = [
        {
            title: 'Publisher',
            content: bookData.publisherName,

        },
        {
            title: 'Published on',
            content: bookData.date.substring(0, bookData.date.length - 12),
            
        },
        {
            title: 'Genres',
            content: genres,
        },
        {
            title: 'Digital Format',
            content: bookData.isDigital? 'Yes' : 'No',
        },
        {
            title: 'Pages',
            content: bookData.pages,
        },
        {
            title: 'Price',
            content: bookData.price,
        }
    ]
    
    return(
        <div className={classes.root}>
        <Typography>
            ADDITIONAL INFORMATION
        </Typography>
        <Grid container spacing={3} className={classes.gridContainer}>
            {info.map((obj, index) => (
                <Grid key={index} item xs={4}>
                    <Typography>{obj.title}</Typography>
                    <Typography variant="body2" className={classes.contentText}>
                        {obj.content}
                    </Typography>
                </Grid>
            ))}
        </Grid>
        </div>
    );
    
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '2rem',
    },
    gridContainer:{
        paddingTop: 20,
    },
    contentText:{
        color: 'dimgrey',
    }
}));