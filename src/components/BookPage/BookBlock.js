import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import ReactLink from '@material-ui/core/Link';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';

import { Link, useLocation } from "react-router-dom";

import ReviewsBlock from './ReviewsBlock';
import FavoriteButton from './FavoriteButton';
import AdditionalInfo from './AdditionalInfo';


export default function BookBlock(props){

    const classes = useStyles();
    const location = useLocation();

    const bookData = props.bookData;
    const user = props.user;

    return(
        <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item xs={12} className={classes.bookBox} style={{display:'flex'}} >
                    <Fade in={true}>
                        <Box className={classes.imageBox}>
                            <img src={"/resources/"+ (bookData.coverPicture || "cover.jpg")} alt="" className={classes.image}/>
                        </Box>
                    </Fade>
                   <Box display="flex" flexDirection="column" className={classes.textInfo}>
                        <Typography variant="h2" className={classes.title}>
                            {bookData.title}
                        </Typography>
                        <Box display="flex" style={{marginBottom:12}}>
                            {bookData.authors.map((author,index) => (
                                <Typography key={index} style={{fontSize:14,color:'#616161', marginRight:7}}>
                                    <ReactLink 
                                        component={Link} 
                                        to={"/author/"+author.authorID}
                                        replace={location === ("/author" + author.authorID)}
                                    >
                                        {author.firstName +" " +    author.lastName}
                                    </ReactLink>
                                </Typography>
                            ))}
                        </Box>
                        <Typography style={{fontSize:14,color:'#616161', flex:1}}>
                            {"Publisher: "}
                            <ReactLink 
                                component={Link} 
                                to={"/publisher/" + bookData.publisherID}
                                replace={location === ("/publisher/" + bookData.publisherID)}
                            >
                                {bookData.publisherName}
                            </ReactLink>
                        </Typography>
                        <div style={{width:'100%', display:'flex'}}>
                        <Box style={{flex:1}}>
                            <Box display="flex">
                                <Typography style={{fontSize:30}}>
                                    {bookData.rating}
                                </Typography>
                                <StarIcon color="primary" style={{marginTop:4, fontSize:35}}/>
                            </Box>
                        </Box>
                        <Box style={{textAlign:'end'}}>
                            {user.username !== "" ?
                                <FavoriteButton 
                                    bookData={bookData} 
                                    user={user} 
                                    remountHeader={props.remountHeader}
                                />:
                                <Tooltip title="Login for favorites" placement="top">
                                    <IconButton>
                                        <FavoriteIcon/>
                                    </IconButton>
                                </Tooltip>
                            }
                            <Button color="primary" variant="contained" style={{marginRight: 'calc(3rem - 30px)'}}>
                                Buy {bookData.price}$ 
                            </Button>
                        </Box>
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={12} className={classes.descriptionBox}>
                    <Typography  className={classes.description}>
                        {bookData.description}
                    </Typography>
                </Grid>
            </Grid>
            <Divider variant="middle" />
            <ReviewsBlock bookData={bookData} user={user}/>
            <Divider variant="middle" />
            <AdditionalInfo bookData={bookData}/>
            <Divider variant="middle" />
        </Paper> 
    );
}

const useStyles = makeStyles((theme) => ({
    paper:{
        marginLeft:20,
        paddingBottom:50,
        maxWidth:800,
        [theme.breakpoints.down('sm')]: {
            marginRight:0,
            marginLeft:0,
        },
    },

    bookBox:{
        flexDirection:'row',
       
    },

    imageBox:{
        marginLeft: 30,
        marginTop: 30,
        
    },
    image:{
        width:100,
        height:150,
        boxShadow: '0px 0px 10px 0px',
        [theme.breakpoints.up(450)]: {
            width:175,
            height:260,
        },
        [theme.breakpoints.up('md')]: {
            width:200,
            height:300,
        },
    },
    textInfo:{
        height:'100%', 
        width:'100%', 
        marginRight:30, 
        marginLeft:30,
      
    },
    title:{
        fontSize: 35,
        fontWeight: 300,
        fontVariant:'all-small-caps',
        lineHeight:0.8,
        marginBottom:30,
        marginTop:30,
    },
    descriptionBox:{
        marginTop:'1rem',
        marginBottom:'2rem',
        marginLeft: '3rem',
        marginRight: '3rem',
    },
    description:{
        color:'#333333', 
        fontFamily: 'system-ui',
        fontSize: 15,
        fontWeight: 200,
        overflowWrap:'break-word',
    },
    
  }));
