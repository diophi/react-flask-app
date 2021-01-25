import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import { Link, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root:{
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
    title:{
        lineHeight:'1',
        fontSize:15,
        textDecoration:'none',
        color:'#313131',
        "&:hover": {
           borderBottom:'0.5px solid #bbb' ,
        },
    },
    author:{
        marginTop:5,
        fontSize:13,
        color:'grey',
        marginBottom:10,
        textDecoration:'none',
        "&:hover": {
           borderBottom:'0.5px solid #bbb' ,
        },
    }
   
}));

export default function BookTile(props){
    const classes = useStyles();
    const location = useLocation();

    const book = props.book || {};

    return(
        <Paper elevation={2} className={classes.root}>
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
                                className={classes.title}
                                to={"/book/" + book.bookID}
                                replace={location === ("/book/" + book.bookID)}
                            >
                                {book.title}
                            </Link>
                        </Typography>
                        <Typography>
                            <Link 
                                className={classes.author}
                                to={"/author/"+book.authorNameID}
                                replace={location === ("/book/" + book.authorNameID)}
                            >
                                {book.authorName}
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}