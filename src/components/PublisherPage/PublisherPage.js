import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
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
    },
    paper:{
        minHeight:200,
        marginBottom:30,
        display:'flex',
    },
    authorBox:{
        padding:20,
        flex:1,
    },
    authorIll:{
        height: 200,
        paddingRight: 30,
    },
    title:{
        marginBottom:30,
        color:'#333333',
        fontSize:'1.8em',
        [theme.breakpoints.down('sm')]: {
            marginLeft:'5%',
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

let getPublisherData =  async (publisherID) => {
    let publisherData = await fetch('https://mostare1.pythonanywhere.com/api/publisher/' + publisherID)
    .then(response => response.json())
    .then(data => (data.length > 0 ? data[0] : {noPublisher:true}) );
    
    return publisherData;
}

let getPublisherBooks = async (publisherID) => {
    let books = await fetch('https://mostare1.pythonanywhere.com/api/publisher/' + publisherID + '/get-books')
    .then(response => response.json())
    .then(data => data);
    
    return books;
}

export default function AuthorPage(props) {

    const classes = useStyles();
    const publisherID = props.match.params.id;


    const [books, setBooks] = React.useState(null);
    const [publisher, setPublisher] = React.useState(null);
    
    
    React.useEffect(() => { 
        getPublisherBooks(publisherID).then(data => setBooks(data));
        getPublisherData(publisherID).then(data => setPublisher(data));
    },[publisherID]);

    return(
        <div className={classes.root}>
            {publisher === null || books == null ? 
            <CircularProgress/> : publisher.noPublisher ? <>No publisher found</> :
                <>
                <Paper className={classes.paper}>
                    <Box 
                        display="flex" 
                        flexDirection="column" 
                        className={classes.authorBox}
                    >
                        <Typography variant="h5">
                            {publisher.name}
                        </Typography>
                        <Typography variant="body2" color="primary">
                        Email:  {publisher.email}
                        </Typography>
                        <Typography variant="body2" style={{color:'grey'}}>
                        Phone:  {publisher.phone}
                        </Typography>
                        <Typography variant="body2" style={{color:'grey'}}>
                        Address:  {publisher.address}
                        </Typography>
                        <Typography variant="body2" style={{paddingTop:20}}>
                            {publisher.description}
                        </Typography>
                    </Box>
                    <Box 
                        display="flex" 
                        flexDirection="column" 
                    >
                        <img src={"/resources/publisher.png"} alt="" className={classes.authorIll}/>
                    </Box>
                </Paper>
                <Typography variant="h4" className={classes.title}>
                    From this publisher ({books.length})
                </Typography>
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
                                    <BookTile 
                                        book={{...book}}
                                    />
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